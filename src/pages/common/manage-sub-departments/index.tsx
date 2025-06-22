import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, CirclePlus } from "lucide-react";
import { formatValue } from "../../../utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddPopup, DeletePopup, EditPopup, Inputs, ShowPopup, SubDepartmentsTable, TableFilters } from "./view";
import { HasPermission } from "../../../components/auth";
import { useLanguageStore } from "../../../store/";
import { ActionCard, Button, CountCard, Header, InfoPopup, Paginator, SectionHeader } from "../../../components/ui";
import { useCreateSubDepartment, useDebounce, useDeleteSubDepartment, useGetSubDepartmentByID, useGetSubDepartments, useUpdateSubDepartment } from "../../../hooks/";
import { SUB_DEPARTMENT_NS, SUB_DEPARTMENT_VIEDO } from "../../../constants";
import { SubDepartmentFormValues, subDepartmentSchema } from "../../../validation";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";

const ManageSubDepartmentsPage = () => {
  const { t } = useTranslation([SUB_DEPARTMENT_NS]);
  const { language } = useLanguageStore();

  const { register, handleSubmit, formState: { errors }, reset , watch, control} = useForm<SubDepartmentFormValues>({
    resolver: yupResolver(subDepartmentSchema),
    mode: "onChange"
  });

  const [selectedID, setSelectedID] = useState<number>(0);

  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  const handleShowPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsShowPopupOpen(true) 
  }
  const handleAddPopupOpen = () => {
    setSelectedID(0)
    reset({name: "", description: "", entityId: 0, departmentID: 0})
    setIsAddPopupOpen(true)
  }
  const handleEditPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsEditPopupOpen(true)
  }

  const handleEditPopupClose = () => {
    setSelectedID(0)
    reset({ name: "", description: "", entityId: 0, departmentID: 0})
    setIsEditPopupOpen(false)
  }
  const handleDeletePopupOpen = (id: number) => {
    setSelectedID(id)
    setIsDeletePopupOpen(true) 
  }

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
  


  const { subDepartments, count, metadata, isLoading: isSubDepartmentsDataLoading } = useGetSubDepartments(
    page, 
    pageSize, 
    searchKey, 
    searchQuery
  );

  const { subDepartment, isLoading: isSubDepartmentDataLoading } = useGetSubDepartmentByID(selectedID, reset);
  
  const { mutate: addSubDepartment, isPending: isAdding } = useCreateSubDepartment();
  const { mutate: updateSubDepartment, isPending: isUpdating } = useUpdateSubDepartment();
  const { mutate: deleteSubDepartment, isPending: isDeleting } = useDeleteSubDepartment();

  /* ____________ HANDLER ____________ */
  const handleConfirmAdd: SubmitHandler<SubDepartmentFormValues> = (request: SubDepartmentFormValues) => {
    addSubDepartment(request)
    setIsAddPopupOpen(false)
  };

  const handleConfirmUpdate: SubmitHandler<SubDepartmentFormValues> = (request: SubDepartmentFormValues) => {
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
        <Header heading={t("header.heading")} subtitle={t("header.subtitle")} />
        <div className="w-full flex items-center justify-center">
          <InfoPopup
            title={t("infoPopup.title")}
            description={t("infoPopup.description")}
            videoUrl={SUB_DEPARTMENT_VIEDO}
          />
        </div>

        <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <CountCard 
            title={t("CountCard.title")}
            description={t("CountCard.description")}
            count={formatValue(count, language)}
            icon={<Building2 size={28} />} 
            bgColor="bg-[#b38e19]" 
          />
          {/* ActionCard */}
          <HasPermission permission="Add SubDepartment">
            <ActionCard
              icon={<CirclePlus />}
              iconBgColor="bg-[#f5e4b2]"
              iconColor="text-[#b38e19]"
              title={t("addActionCard.title")}
              description={t("addActionCard.description")}
            >
              <Button fullWidth={true} variant="secondary" onClick={handleAddPopupOpen}>
                {t("addActionCard.button")}
              </Button>
            </ActionCard>
          </HasPermission>
        </div>

        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("sectionHeader.title")} 
            description={t("sectionHeader.description")} 
          />

          <div className="flex flex-wrap gap-4">
            <TableFilters searchBy={metadata.searchBy} getParam={getParam} setParam={setParam} clearParams={clearParams} />
          </div>

          <div className="w-full overflow-x-auto">
            <SubDepartmentsTable 
              subDepartments={subDepartments} 
              isLoading={isSubDepartmentsDataLoading} 
              handleShow={handleShowPopupOpen} 
              handleEdit={handleEditPopupOpen}
              handleDelete={handleDeletePopupOpen}
            />
          </div>

          {/* Pagination Component */}
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isSubDepartmentsDataLoading}
            onClickFirst={() => setParam("page", String(1))}
            onClickPrev={() => setParam("page", String(Math.max((Number(getParam('page')) || 1) - 1, 1)))}
            onClickNext={() => setParam("page", String(Math.min((Number(getParam('page')) || 1) + 1, metadata?.pagination?.totalPages || 1)))}
          />
        </div>
      </div>

      <AddPopup
        isOpen={isAddPopupOpen}
        formInputs={<Inputs control={control} register={register} errors={errors} watch={null} />}
        handleSubmit={handleSubmit(handleConfirmAdd)}
        handleClose={() => setIsAddPopupOpen(false)}
        isLoading={isAdding}
      />

      <EditPopup
        isOpen={isEditPopupOpen} 
        handleClose={handleEditPopupClose} 
        isLoading={isUpdating}
        handleSubmit={handleSubmit(handleConfirmUpdate)} 
        formInputs={<Inputs control={control} register={register} errors={errors} watch={watch} isLoading={isSubDepartmentDataLoading} />}
      />

      <DeletePopup
        isOpen={isDeletePopupOpen}
        handleClose={() => { setIsDeletePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
      />

      <ShowPopup
        isOpen={isShowPopupOpen}
        handleClose={() => setIsShowPopupOpen(false)} 
        handleDeletePopupOpen={() => {
          handleDeletePopupOpen(selectedID)
        }}
        handleEditPopupOpen={() => {
          handleEditPopupOpen(selectedID)
          setIsShowPopupOpen(false)
        }}
        subDepartment={subDepartment}
        isLoading={isSubDepartmentDataLoading}
      />
    </>
  )
}


export default ManageSubDepartmentsPage