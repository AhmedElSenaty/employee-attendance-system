import { Building } from "lucide-react"
import { Header, CountCard, SectionHeader, Button, Paginator, InfoPopup } from "../../../components/ui"
import { formatValue } from "../../../utils"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useDebounce } from "../../../hooks/debounce.hook"
import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import { DepartmentFormValues, departmentSchema } from "../../../validation"
import { useCreateDepartment, useDeleteDepartment, useGetDepartmentByID, useGetDepartments, useUpdateDepartment } from "../../../hooks/department.hooks"
import { HasPermission } from "../../../components/auth"
import { DEPARTMENT_NS, DEPARTMENT_VIEDO } from "../../../constants"
import { useLanguageStore } from "../../../store"
import useURLSearchParams from "../../../hooks/URLSearchParams.hook"
import { DeletePopup, DepartmentsTable, EditPopup, Inputs, ShowPopup, TableFilters } from "./views"

const ManageDepartmentsPage = () => {
  const { t } = useTranslation([DEPARTMENT_NS]);
  const { language } = useLanguageStore();

  const { register: registerAdd, handleSubmit: handleSubmitAdd, formState: { errors: errorsAdd } } = useForm<DepartmentFormValues>({
    resolver: yupResolver(departmentSchema),
    mode: "onChange"
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: errorsEdit }, reset: resetEditInputs, watch } = useForm<DepartmentFormValues>({
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

  const {getParam, setParam, clearParams} = useURLSearchParams();

  // Using the enhanced getParam with parser support from the improved hook
  const rawPage = getParam('page', Number);
  const rawPageSize = getParam('pageSize', Number);
  const rawSearchKey = getParam('searchKey');
  const rawSearchQuery = useDebounce(getParam('searchQuery'), 650);

  // Use nullish coalescing to default numeric values, undefined for dates if empty
  const page = rawPage ?? 1;
  const pageSize = rawPageSize ?? 10;
  const searchKey = rawSearchKey || undefined;
  const searchQuery = rawSearchQuery || undefined;

  const { departments, count, metadata, isLoading: isDepartmentsDataLoading } = useGetDepartments(
    page, 
    pageSize, 
    searchKey, 
    searchQuery
  );

  const { department, isLoading: isDepartmentDataLoading } = useGetDepartmentByID(selectedID, resetEditInputs);

  const { mutate: createDepartment, isPending: isAdding } = useCreateDepartment();
  const { mutate: updateDepartment, isPending: isUpdating } = useUpdateDepartment();
  const { mutate: deleteDepartment, isPending: isDeleting } = useDeleteDepartment();

  const handleConfirmAdd: SubmitHandler<DepartmentFormValues> = (request) => {
    createDepartment(request)
  };
  const handleConfirmUpdate: SubmitHandler<DepartmentFormValues> = (request) => {
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
        heading={t("header.heading")}
        subtitle={t("header.subtitle")}
      />

      <div className="w-full flex items-center justify-center">
        <InfoPopup
          title={t("infoPopup.title")}
          description={t("infoPopup.description")}
          videoUrl={DEPARTMENT_VIEDO}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Count Card & Form */}
        <div className="space-y-6 col-span-1">
          {/* Count Card */}
          <CountCard 
            title={t("CountCard.title")}
            description={t("CountCard.description")}
            count={formatValue(count, language)}
            icon={<Building size={28} />} 
            bgColor="bg-[#b38e19]" 
          />

          {/* Department Form */}
          <div className="bg-white shadow-sm rounded-lg p-4 space-y-4">
            <SectionHeader
              title={t("sectionsHeader.addNew.title")} 
              description={t("sectionsHeader.addNew.description")} 
            />
            <HasPermission permission="Add Department">
              <form className="space-y-4" onSubmit={handleSubmitAdd(handleConfirmAdd)}>
                <Inputs register={registerAdd} errors={errorsAdd} />
                <Button variant={"secondary"} fullWidth={true} isLoading={isAdding}>
                  {(isAdding)
                    ? t("buttons.loading")
                    : t("buttons.create")}
                </Button>
              </form>
            </HasPermission>
          </div>
        </div>

        {/* Right Column: Filters & Table */}
        <div className="bg-white shadow-md space-y-5 p-4 rounded-lg sm:col-span-2 col-span-1">
          {/* Filters */}
          <SectionHeader
            title={t("sectionsHeader.departmentsList.title")} 
            description={t("sectionsHeader.departmentsList.description")} 
          />

          <TableFilters searchBy={metadata.searchBy} getParam={getParam} setParam={setParam} clearParams={clearParams} />

          {/* Table */}
          <DepartmentsTable departments={departments} handleDelete={handleDeletePopupOpen} isLoading={isDepartmentsDataLoading} handleEdit={handleEditPopupOpen} handleShow={handleShowPopupOpen}  />

          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isDepartmentsDataLoading}
            onClickFirst={() => setParam("page", String(1))}
            onClickPrev={() => setParam("page", String(Math.max((Number(getParam('page')) || 1) - 1, 1)))}
            onClickNext={() => setParam("page", String(Math.min((Number(getParam('page')) || 1) + 1, metadata?.pagination?.totalPages || 1)))}
          />
        </div>
      </div>

      <ShowPopup
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
        isLoading={isDepartmentDataLoading}
      />

      <EditPopup 
        isOpen={isEditPopupOpen} 
        handleClose={handleEditPopupClose} 
        isLoading={isUpdating} 
        handleSubmit={handleSubmitEdit(handleConfirmUpdate)} 
        formInputs={<Inputs register={registerEdit} errors={errorsEdit} watch={watch} isLoading={isDepartmentDataLoading} />} 
      />

      <DeletePopup
        isOpen={isDeletePopupOpen}
        handleClose={() => { setIsDeletePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}

export default ManageDepartmentsPage