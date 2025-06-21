import { Building } from "lucide-react"
import { Header, CountCard, SectionHeader, Button, Paginator, InfoPopup } from "../../../components/ui/"
import { formatValue } from "../../../utils"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import { DeletePopup, EditPopup, EntitiesTable, Inputs, ShowPopup, TableFilters } from "./views"
import { EntityFormValues, entitySchema } from "../../../validation"
import { HasPermission } from "../../../components/auth"
import { useCreateEntity, useDebounce, useDeleteEntity, useGetEntities, useGetEntityByID, useUpdateEntity } from "../../../hooks/"
import { ENTITY_NS, ENTITY_VIDEO } from "../../../constants"
import { useLanguageStore } from "../../../store"
import useURLSearchParams from "../../../hooks/URLSearchParams.hook"

const ManageEntitiesPage = () => {
  const { t } = useTranslation([ENTITY_NS]);
  const { language } = useLanguageStore();
  
  const { register: registerAdd, handleSubmit: handleSubmitAdd, formState: { errors: errorsAdd } } = useForm<EntityFormValues>({
    resolver: yupResolver(entitySchema),
    mode: "onChange"
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: errorsEdit }, reset: resetEditInputs } = useForm<EntityFormValues>({
    resolver: yupResolver(entitySchema),
    mode: "onChange"
  });
  

  const [selectedID, setSelectedID] = useState<number>(0);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  const handleShowPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsShowPopupOpen(true)
  }

  const handleEditPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsEditPopupOpen(true)
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
  

  const { entities, count, metadata, isLoading: isEntitiesDataLoading } = useGetEntities(
    page, 
    pageSize, 
    searchKey, 
    searchQuery
  );

  const { entity, isLoading: isEntityDataLoading } = useGetEntityByID(selectedID, resetEditInputs);

  const { mutate: addEntity, isPending: isAdding } = useCreateEntity();
  const { mutate: updateEntity, isPending: isUpdating } = useUpdateEntity();
  const { mutate: deleteEntity, isPending: isDeleting } = useDeleteEntity();
  

  const handleConfirmAdd: SubmitHandler<EntityFormValues> = (request) => {
    addEntity(request)
  };
  const handleConfirmUpdate: SubmitHandler<EntityFormValues> = (request) => {
    updateEntity(request)
    setIsEditPopupOpen(false)
  };
  const handleConfirmDelete = () => {
    if (!selectedID) return;
    deleteEntity(selectedID)
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
          videoUrl={ENTITY_VIDEO}
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

          <HasPermission permission="Add Entity">
            {/* Entity Form */}
            <div className="bg-white shadow-sm rounded-lg p-4 space-y-4">
              <SectionHeader
                title={t("sectionsHeader.add.title")} 
                description={t("sectionsHeader.add.description")} 
              />
              <form className="space-y-4" onSubmit={handleSubmitAdd(handleConfirmAdd)}>
                <Inputs register={registerAdd} errors={errorsAdd} />
                <Button variant={"secondary"} fullWidth={true} isLoading={isAdding}>
                  {(isAdding)
                    ? t("buttons.loading")
                    : t("buttons.create")}
                </Button>
              </form>
            </div>
          </HasPermission>
        </div>

        {/* Right Column: Filters & Table */}
        <div className="bg-white shadow-md space-y-5 p-4 rounded-lg sm:col-span-2 col-span-1">
          <SectionHeader
            title={t("sectionsHeader.entitiesList.title")} 
            description={t("sectionsHeader.entitiesList.description")} 
          />

          {/* Filters */}
          <TableFilters searchBy={metadata.searchBy} getParam={getParam} setParam={setParam} clearParams={clearParams} />

          <EntitiesTable
            entities={entities}
            handleShow={handleShowPopupOpen}
            handleEdit={handleEditPopupOpen} 
            handleDelete={handleDeletePopupOpen} 
            isLoading={isEntitiesDataLoading} 
          />

          {/* Pagination Component */}
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isEntitiesDataLoading}
            onClickFirst={() => setParam("page", String(1))}
            onClickPrev={() => setParam("page", String(Math.max((Number(getParam('page')) || 1) - 1, 1)))}
            onClickNext={() => setParam("page", String(Math.min((Number(getParam('page')) || 1) + 1, metadata?.pagination?.totalPages || 1)))}
          />
        </div>
      </div>

      <ShowPopup
        isOpen={isShowPopupOpen}
        handleClose={() => {
          setIsShowPopupOpen(false)
        }} 
        handleDeletePopupOpen={() => {
          handleDeletePopupOpen(selectedID)
        }}
        handleEditPopupOpen={() => {
          handleEditPopupOpen(selectedID)
          setIsShowPopupOpen(false)
        }}
        entity={entity}
        isLoading={isEntityDataLoading}
      />

      <EditPopup 
        isOpen={isEditPopupOpen} 
        handleClose={() => {
          setSelectedID(0)
          setIsEditPopupOpen(false)
        }} 
        isLoading={isUpdating} 
        handleSubmit={handleSubmitEdit(handleConfirmUpdate)} 
        formInputs={<Inputs register={registerEdit} errors={errorsEdit} isLoading={isEntityDataLoading} />} 
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

export default ManageEntitiesPage