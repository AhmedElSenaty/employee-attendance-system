import { Building } from "lucide-react"
import { Header, CountCard, SectionHeader, Button, Paginator } from "../../../components/ui"
import { formatValue } from "../../../utils"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useFiltersHook } from "../../../hooks/useFiltersHook"
import { useDebounce } from "../../../hooks/useDebounceHook"
import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import { departmentSchema } from "../../../validation"
import { DeleteDepartmentPopup, DepartmentsTable, DepartmentTableFilters, EditDepartmentPopup, RenderDepartmentInputs, ShowDepartmentPopup } from "./views"
import { IDepartmentCredentials } from "../../../interfaces"
import {  useGetAllDepartments, useGetDepartmentByID, useManageDepartments } from "../../../hooks/useDepartmentHook"
import { DEPARTMENT_TRANSLATION_NAMESPACE } from "."
import { HasPermission } from "../../../components/auth"
import { useLanguageStore } from "../../../store/language.store"

const ManageDepartmentsPage = () => {
  const { t } = useTranslation(["common", DEPARTMENT_TRANSLATION_NAMESPACE]);
    const { language } = useLanguageStore();

  const { register: registerAdd, handleSubmit: handleSubmitAdd, formState: { errors: errorsAdd } } = useForm<IDepartmentCredentials>({
    resolver: yupResolver(departmentSchema),
    mode: "onChange"
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: errorsEdit }, reset: resetEditInputs, watch } = useForm<IDepartmentCredentials>({
    resolver: yupResolver(departmentSchema),
    mode: "onChange"
  });
  

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  const handleShowPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsShowPopupOpen(true) 
  }
  const handleShowPopupClose = () => {
    setIsShowPopupOpen(false)
  }

  const handleEditPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsEditPopupOpen(true)
  }
  const handleEditPopupClose = () => {
    setSelectedID(0)
    setIsEditPopupOpen(false)
  }

  const handleDeletePopupOpen = (id: number) => {
    setSelectedID(id)
    setIsDeletePopupOpen(true) 
  }

  const [selectedID, setSelectedID] = useState<number>(0);

  const { page, pageSize, searchKey, search, setFilters } = useFiltersHook()

  const debouncedSearchQuery = useDebounce(search, 650);

  const { departments, totalDepartments, metadata, isDepartmentsDataLoading } = useGetAllDepartments(
    Number(page) || 1, 
    Number(pageSize) || 5, 
    searchKey || "", 
    debouncedSearchQuery || ""
  );

  const { department, isDepartmentDataLoading } = useGetDepartmentByID(selectedID, resetEditInputs);

  const {
    addDepartment,
    updateDepartment,
    deleteDepartment,
    isAdding,
    isUpdating,
    isDeleting
  } = useManageDepartments();;

  const handleConfirmAdd: SubmitHandler<IDepartmentCredentials> = (request: IDepartmentCredentials) => {
    addDepartment(request)
  };
  const handleConfirmUpdate: SubmitHandler<IDepartmentCredentials> = (request: IDepartmentCredentials) => {
    updateDepartment(request)
    setIsEditPopupOpen(false)
  };
  const handleConfirmDelete = () => {
    if (!selectedID) return;
    deleteDepartment(selectedID)
    setIsDeletePopupOpen(false)
    setIsShowPopupOpen(false)
  };

  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header 
        heading={t("header.heading", { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}
        subtitle={t("header.subtitle", { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Count Card & Form */}
        <div className="space-y-6 col-span-1">
          {/* Count Card */}
          <CountCard 
            title={t("CountCard.title", { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}
            description={t("CountCard.description", { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}
            count={formatValue(totalDepartments, language)}
            icon={<Building size={28} />} 
            bgColor="bg-[#b38e19]" 
          />

          {/* Department Form */}
          <div className="bg-white shadow-sm rounded-lg p-4 space-y-4">
            <SectionHeader
              title={t("sectionsHeader.addNew.title", { ns: DEPARTMENT_TRANSLATION_NAMESPACE })} 
              description={t("sectionsHeader.addNew.description", { ns: DEPARTMENT_TRANSLATION_NAMESPACE })} 
            />
            <HasPermission permission="Add Department">
              <form className="space-y-4" onSubmit={handleSubmitAdd(handleConfirmAdd)}>
                <RenderDepartmentInputs register={registerAdd} errors={errorsAdd} t={t} />
                <Button variant={"secondary"} fullWidth={true} isLoading={isAdding}>
                  {t("buttons.add")}
                </Button>
              </form>
            </HasPermission>
          </div>
        </div>

        {/* Right Column: Filters & Table */}
        <div className="bg-white shadow-md space-y-5 p-1 rounded-lg sm:col-span-2 col-span-1">
          {/* Filters */}
          <DepartmentTableFilters searchBy={metadata.searchBy} t={t} />

          {/* Table */}
          <div className="bg-white shadow-sm rounded-lg p-4 space-y-5">
            <SectionHeader
              title={t("sectionsHeader.departmentsList.title", { ns: DEPARTMENT_TRANSLATION_NAMESPACE })} 
              description={t("sectionsHeader.departmentsList.description", { ns: DEPARTMENT_TRANSLATION_NAMESPACE })} 
            />
            <DepartmentsTable departments={departments} t={t} handleDeleteDepartment={handleDeletePopupOpen} isLoading={isDepartmentsDataLoading} handleEditDepartment={handleEditPopupOpen} handleShowDepartment={handleShowPopupOpen}  />

            <Paginator
              page={metadata?.pagination?.pageIndex || 0}
              totalPages={metadata?.pagination?.totalPages || 1}
              totalRecords={metadata?.pagination?.totalRecords || 0}
              isLoading={isDepartmentsDataLoading}
              onClickFirst={() => setFilters({ page: 1 })}
              onClickPrev={() => setFilters({ page: Math.max((page || 1) - 1, 1) })}
              onClickNext={() => setFilters({ page: Math.min((page || 1) + 1, metadata?.pagination?.totalPages || 1) })}
            />
          </div>
        </div>
      </div>

      <ShowDepartmentPopup
        isOpen={isShowPopupOpen}
        handleClose={handleShowPopupClose} 
        handleDeletePopupOpen={() => {
          handleDeletePopupOpen(selectedID)
        }}
        handleEditPopupOpen={() => {
          handleEditPopupOpen(selectedID)
          setIsShowPopupOpen(false)
        }}
        department={department}
        t={t}
        isLoading={isDepartmentDataLoading}
      />

      <EditDepartmentPopup 
        isOpen={isEditPopupOpen} 
        handleClose={handleEditPopupClose} 
        isLoading={isUpdating} 
        handleSubmit={handleSubmitEdit(handleConfirmUpdate)} 
        formInputs={<RenderDepartmentInputs register={registerEdit} errors={errorsEdit} t={t} watch={watch} />} 
        t={t}
      />

      <DeleteDepartmentPopup
        isOpen={isDeletePopupOpen}
        handleClose={() => { setIsDeletePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        t={t}
      />
    </div>
  )
}

export default ManageDepartmentsPage