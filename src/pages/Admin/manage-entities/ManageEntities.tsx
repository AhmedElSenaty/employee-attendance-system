import { Building } from "lucide-react"
import { Header, CountCard, SectionHeader, Button, Paginator } from "../../../components/ui/"
import { formatValue } from "../../../utils"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useFiltersHook } from "../../../hooks/useFiltersHook"
import { useDebounce } from "../../../hooks/debounce.hook"
import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import { IEntityCredentials } from "../../../interfaces"
import { DeleteEntityPopup, EditEntityPopup, EntitiesTable, EntityTableFilters, RenderEntityInputs, ShowEntityPopup } from "./views"
import { entitySchema } from "../../../validation"
import { ENTITY_TRANSLATION_NAMESPACE } from "."
import { HasPermission } from "../../../components/auth"
import { useLanguageStore } from "../../../store/language.store"
import { useCreateEntity, useDeleteEntity, useGetEntities, useGetEntityByID, useUpdateEntity } from "../../../hooks/entity.hooks"

const ManageEntitiesPage = () => {
  const { t } = useTranslation(["common", ENTITY_TRANSLATION_NAMESPACE]);
    const { language } = useLanguageStore();
  
  const { register: registerAdd, handleSubmit: handleSubmitAdd, formState: { errors: errorsAdd } } = useForm<IEntityCredentials>({
    resolver: yupResolver(entitySchema),
    mode: "onChange"
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: errorsEdit }, reset: resetEditInputs } = useForm<IEntityCredentials>({
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

  
  const { page, pageSize, searchKey, search, setFilters } = useFiltersHook()

  const debouncedSearchQuery = useDebounce(search, 650);
  const { entities, totalEntities, metadata, isEntitiesDataLoading } = useGetEntities(Number(page) || 1, Number(pageSize) || 5, searchKey || "", debouncedSearchQuery || "");

  const { entity, isEntityDataLoading } = useGetEntityByID(selectedID, resetEditInputs);

  const { mutate: addEntity, isPending: isAdding } = useCreateEntity();
  const { mutate: updateEntity, isPending: isUpdating } = useUpdateEntity();
  const { mutate: deleteEntity, isPending: isDeleting } = useDeleteEntity();
  

  const handleConfirmAdd: SubmitHandler<IEntityCredentials> = (request: IEntityCredentials) => {
    addEntity(request)
  };
  const handleConfirmUpdate: SubmitHandler<IEntityCredentials> = (request: IEntityCredentials) => {
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
        heading={t("header.heading", { ns: ENTITY_TRANSLATION_NAMESPACE })}
        subtitle={t("header.subtitle", { ns: ENTITY_TRANSLATION_NAMESPACE })}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Count Card & Form */}
        <div className="space-y-6 col-span-1">
          {/* Count Card */}
          <CountCard 
            title={t("CountCard.title", { ns: ENTITY_TRANSLATION_NAMESPACE })}
            description={t("CountCard.description", { ns: ENTITY_TRANSLATION_NAMESPACE })}
            count={formatValue(totalEntities, language)}
            icon={<Building size={28} />} 
            bgColor="bg-[#b38e19]" 
          />

          <HasPermission permission="Add Entity">
            {/* Entity Form */}
            <div className="bg-white shadow-sm rounded-lg p-4 space-y-4">
              <SectionHeader
                title={t("sectionsHeader.add.title", { ns: ENTITY_TRANSLATION_NAMESPACE })} 
                description={t("sectionsHeader.add.description", { ns: ENTITY_TRANSLATION_NAMESPACE })} 
              />
              <form className="space-y-4" onSubmit={handleSubmitAdd(handleConfirmAdd)}>
                <RenderEntityInputs register={registerAdd} errors={errorsAdd} t={t} />
                <Button variant={"secondary"} fullWidth={true} isLoading={isAdding}>
                  {t("buttons.add")}
                </Button>
              </form>
            </div>
          </HasPermission>
        </div>

        {/* Right Column: Filters & Table */}
        <div className="bg-white shadow-md space-y-5 p-1 rounded-lg sm:col-span-2 col-span-1">
          {/* Filters */}
          <EntityTableFilters searchBy={metadata.searchBy} t={t} />

          {/* Table */}
          <div className="bg-white shadow-sm rounded-lg p-4 space-y-5">
            <SectionHeader
              title={t("sectionsHeader.entitiesList.title", { ns: ENTITY_TRANSLATION_NAMESPACE })} 
              description={t("sectionsHeader.entitiesList.description", { ns: ENTITY_TRANSLATION_NAMESPACE })} 
            />
            <EntitiesTable
              entities={entities}
              handleShowEntity={handleShowPopupOpen}
              handleEditEntity={handleEditPopupOpen} 
              handleDeleteEntity={handleDeletePopupOpen} 
              isLoading={isEntitiesDataLoading} 
              t={t} 
            />

            <Paginator
              page={metadata?.pagination?.pageIndex || 0}
              totalPages={metadata?.pagination?.totalPages || 1}
              totalRecords={metadata?.pagination?.totalRecords || 0}
              isLoading={isEntitiesDataLoading}
              onClickFirst={() => setFilters({ page: 1 })}
              onClickPrev={() => setFilters({ page: Math.max((page || 1) - 1, 1) })}
              onClickNext={() => setFilters({ page: Math.min((page || 1) + 1, metadata?.pagination?.totalPages || 1) })}
            />
          </div>
        </div>
      </div>

      <ShowEntityPopup
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
        t={t}
      />

      <EditEntityPopup 
        isOpen={isEditPopupOpen} 
        handleClose={() => {
          setSelectedID(0)
          setIsEditPopupOpen(false)
        }} 
        isLoading={isUpdating} 
        handleSubmit={handleSubmitEdit(handleConfirmUpdate)} 
        formInputs={<RenderEntityInputs register={registerEdit} errors={errorsEdit} t={t} isLoading={isEntityDataLoading} />} 
        t={t}
      />

      <DeleteEntityPopup
        isOpen={isDeletePopupOpen}
        handleClose={() => { setIsDeletePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        t={t}
      />
    </div>
  )
}

export default ManageEntitiesPage