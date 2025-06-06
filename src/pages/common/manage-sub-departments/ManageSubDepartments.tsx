import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/Button";
import { Building2, CirclePlus } from "lucide-react";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { Header } from "../../../components/ui/Header";
import { Paginator } from "../../../components/ui/Paginator";
import { formatValue } from "../../../utils";
import { useDebounce } from "../../../hooks/useDebounceHook";
import { ActionCard } from "../../../components/ui/ActionCard";
import { CountCard } from "../../../components/ui/CountCard";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFiltersHook } from "../../../hooks/useFiltersHook";
import { SubDepartmentSchema } from "../../../validation/";
import { AddSubDepartmentPopup, DeleteSubDepartmentPopup, EditSubDepartmentPopup, RenderSubDepartmentInputs, ShowSubDepartmentPopup, SubDepartmentsTable, SubDepartmentTableFilters } from "./view";
import { ISubDepartmentCredentials } from "../../../interfaces";
import { useGetAllSubDepartments, useGetSubDepartmentByID, useManageSubDepartments } from "../../../hooks/useSubDepartmentHook";
import { SUB_DEPARTMENT_TRANSLATION_NAMESPACE } from ".";
import { HasPermission } from "../../../components/auth";
import { useLanguageStore } from "../../../store/language.store";

const ManageSubDepartmentsPage = () => {
  const { t } = useTranslation(["common", SUB_DEPARTMENT_TRANSLATION_NAMESPACE]);
  const { language } = useLanguageStore();

  const { register, handleSubmit, formState: { errors }, reset , watch} = useForm<ISubDepartmentCredentials>({
    resolver: yupResolver(SubDepartmentSchema),
    mode: "onChange"
  });

  const [selectedID, setSelectedID] = useState<number>(0);

  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  const handleShowSubDepartmentPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsShowPopupOpen(true) 
  }
  const handleAddSubDepartmentPopupOpen = () => {
    setSelectedID(0)
    reset({name: "", description: "", entityId: 0, departmentID: 0})
    setIsAddPopupOpen(true)
  }
  const handleEditPopupSubDepartmentOpen = (id: number) => {
    setSelectedID(id)
    setIsEditPopupOpen(true)
  }

  const handleEditPopupSubDepartmentClose = () => {
    setSelectedID(0)
    reset({ name: "", description: "", entityId: 0, departmentID: 0})
    setIsEditPopupOpen(false)
  }
  const handleDeleteSubDepartmentPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsDeletePopupOpen(true) 
  }

  const { page, pageSize, searchKey, search, setFilters } = useFiltersHook()

  const debouncedSearchQuery = useDebounce(search, 650);

  const { subDepartments, totalSubDepartments, metadata, isSubDepartmentsDataLoading } = useGetAllSubDepartments(
    Number(page) || 1, 
    Number(pageSize) || 5, 
    searchKey || "", 
    debouncedSearchQuery || ""
  );

  const { subDepartment, isSubDepartmentDataLoading } = useGetSubDepartmentByID(selectedID, reset);

  const {
    addSubDepartment,
    updateSubDepartment,
    deleteSubDepartment,
    isAdding,
    isUpdating,
    isDeleting
  } = useManageSubDepartments();
  
  /* ____________ HANDLER ____________ */
  const handleConfirmAdd: SubmitHandler<ISubDepartmentCredentials> = (request: ISubDepartmentCredentials) => {
    addSubDepartment(request)
    setIsAddPopupOpen(false)
  };
  const handleConfirmUpdate: SubmitHandler<ISubDepartmentCredentials> = (request: ISubDepartmentCredentials) => {
    updateSubDepartment(request)
    setIsEditPopupOpen(false)
  };
  const handleConfirmDelete = () => {
    if (!selectedID) return;
    deleteSubDepartment(selectedID)
    setIsDeletePopupOpen(false)
    setIsShowPopupOpen(false)
  };

  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header heading={t("header.heading", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })} subtitle={t("header.subtitle", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })} />
        <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <CountCard 
            title={t("CountCard.title", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
            description={t("CountCard.description", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
            count={formatValue(totalSubDepartments, language)}
            icon={<Building2 size={28} />} 
            bgColor="bg-[#b38e19]" 
          />
          {/* ActionCard */}
          <HasPermission permission="Add SubDepartment">
            <ActionCard
              icon={<CirclePlus />}
              iconBgColor="bg-[#f5e4b2]"
              iconColor="text-[#b38e19]"
              title={t("subDepartmentActions.addNew.title", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
              description={t("subDepartmentActions.addNew.description", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
            >
              <Button fullWidth={true} variant="secondary" onClick={handleAddSubDepartmentPopupOpen}>
                {t("subDepartmentActions.addNew.button", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
              </Button>
            </ActionCard>
          </HasPermission>
        </div>

        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("sectionHeader.title", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })} 
            description={t("sectionHeader.description", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })} 
          />

          <div className="flex flex-wrap gap-4">
            <SubDepartmentTableFilters searchBy={metadata.searchBy} t={t} />
          </div>
          <div className="w-full overflow-x-auto">
            <SubDepartmentsTable 
              subDepartments={subDepartments} 
              isLoading={isSubDepartmentsDataLoading} 
              handleShowSubDepartment={handleShowSubDepartmentPopupOpen} 
              handleEditSubDepartment={handleEditPopupSubDepartmentOpen}
              handleDeleteSubDepartment={handleDeleteSubDepartmentPopupOpen}
              t={t}
            />
          </div>

          {/* Pagination Component */}
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isSubDepartmentsDataLoading}
            onClickFirst={() => setFilters({ page: 1 })}
            onClickPrev={() => setFilters({ page: Math.max((page || 1) - 1, 1) })}
            onClickNext={() => setFilters({ page: Math.min((page || 1) + 1, metadata?.pagination?.totalPages || 1) })}
          />
        </div>
      </div>

      <AddSubDepartmentPopup
        isOpen={isAddPopupOpen}
        formInputs={<RenderSubDepartmentInputs register={register} errors={errors} t={t} watch={null} />}
        handleSubmit={handleSubmit(handleConfirmAdd)}
        handleClose={() => setIsAddPopupOpen(false)}
        isLoading={isAdding}
        t={t}
      />

      <EditSubDepartmentPopup
        isOpen={isEditPopupOpen} 
        handleClose={handleEditPopupSubDepartmentClose} 
        isLoading={isUpdating}
        handleSubmit={handleSubmit(handleConfirmUpdate)} 
        formInputs={<RenderSubDepartmentInputs register={register} errors={errors} t={t} watch={watch} />}
        t={t}
      />

      <DeleteSubDepartmentPopup
        isOpen={isDeletePopupOpen}
        handleClose={() => { setIsDeletePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        t={t}
      />;

      <ShowSubDepartmentPopup
        isOpen={isShowPopupOpen}
        handleClose={() => setIsShowPopupOpen(false)} 
        handleDeletePopupOpen={() => {
          handleDeleteSubDepartmentPopupOpen(selectedID)
        }}
        handleEditPopupOpen={() => {
          handleEditPopupSubDepartmentOpen(selectedID)
          setIsShowPopupOpen(false)
        }}
        subDepartment={subDepartment}
        t={t}
        isLoading={isSubDepartmentDataLoading}
      />
    </>
  )
}


export default ManageSubDepartmentsPage