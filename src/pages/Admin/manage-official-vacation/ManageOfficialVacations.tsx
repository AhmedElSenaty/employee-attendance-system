import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CirclePlus, TreePalm } from "lucide-react";
import { formatValue } from "../../../utils";
import { useDebounce } from "../../../hooks/useDebounceHook";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFiltersHook } from "../../../hooks/useFiltersHook";
import { IOfficialVacationCredentials } from "../../../interfaces";
import { officialVacationSchema } from "../../../validation";
import { AddOfficialVacationPopup, DeleteOfficialVacationPopup, EditOfficialVacationPopup, OfficialVacationsTable, OfficialVacationTableFilters, RenderOfficialVacationInputs, ShowOfficialVacationPopup } from "./views";
import { OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE } from ".";
import { HasPermission } from "../../../components/auth";
import { useLanguageStore } from "../../../store/language.store";
import { ActionCard, Button, CountCard, Header, Paginator, SectionHeader } from "../../../components/ui";
import { useCreateOfficialVacation, useDeleteOfficialVacation, useGetOfficialVacationById, useGetOfficialVacations, useUpdateOfficialVacation } from "../../../hooks/useOfficialVacationHook";

const ManageOfficialVacationsPage = () => {
  const { t } = useTranslation(["common", OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE]);
    const { language } = useLanguageStore();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<IOfficialVacationCredentials>({
    resolver: yupResolver(officialVacationSchema),
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
    reset({ id: 0, name: "", startDate: "", endDate: "" })
    setIsAddPopupOpen(true)
  }
  const handleEditPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsEditPopupOpen(true)
  }
  const handleEditPopupClose = () => {
    setSelectedID(0)
    reset({ id: 0, name: "", startDate: "", endDate: "" })
    setIsEditPopupOpen(false)
  }
  const handleDeletePopupOpen = (id: number) => {
    setSelectedID(id)
    setIsDeletePopupOpen(true) 
  }

  const { page, pageSize, searchKey, search, setFilters } = useFiltersHook()

  const debouncedSearchQuery = useDebounce(search, 650);

  const { officialVacations, totalOfficialVacations, metadata, isOfficialVacationsDataLoading } = useGetOfficialVacations(Number(page) || 1, Number(pageSize) || 5, searchKey || "", debouncedSearchQuery || "");

  const { officialVacation, isOfficialVacationDataLoading } = useGetOfficialVacationById(selectedID, reset);

  const renderOfficialVacationInputs = <RenderOfficialVacationInputs register={register} errors={errors} t={t} isLoading={isOfficialVacationDataLoading} />

  const { mutate: addOfficialVacation, isPending: isAdding } = useCreateOfficialVacation();
  const { mutate: updateOfficialVacation, isPending: isUpdating } = useUpdateOfficialVacation();
  const { mutate: deleteOfficialVacation, isPending: isDeleting } = useDeleteOfficialVacation();
  

  /* ____________ HANDLER ____________ */
  const handleConfirmAdd: SubmitHandler<IOfficialVacationCredentials> = (request: IOfficialVacationCredentials) => {
    addOfficialVacation(request)
    setIsAddPopupOpen(false)
  };
  const handleConfirmUpdate: SubmitHandler<IOfficialVacationCredentials> = (request: IOfficialVacationCredentials) => {
    request.id = selectedID
    updateOfficialVacation(request)
    setIsEditPopupOpen(false);
  };
  const handleConfirmDelete = () => {
    if (!selectedID) return;
    deleteOfficialVacation(selectedID);
    setIsDeletePopupOpen(false);
    setIsShowPopupOpen(false);
  };

  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header
          heading={t("header.heading", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
          subtitle={t("header.subtitle", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })} 
        />
        <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <CountCard 
            title={t("CountCard.title", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
            description={t("CountCard.description", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
            count={formatValue(totalOfficialVacations, language)}
            icon={<TreePalm size={28} />} 
            bgColor="bg-[#b38e19]" 
          />
          <HasPermission permission="Add Official Vacation">
            <ActionCard
              icon={<CirclePlus />}
              iconBgColor="bg-[#f5e4b2]"
              iconColor="text-[#b38e19]"
              title={t("actions.add.title", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
              description={t("actions.add.description", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
            >
              <Button fullWidth={true} variant="secondary" onClick={handleAddPopupOpen}>
                {t("actions.add.button", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
              </Button>
            </ActionCard>
          </HasPermission>
        </div>

        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("sectionHeader.title", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })} 
            description={t("sectionHeader.description", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })} 
          />

          <div className="flex flex-wrap gap-4">
            <OfficialVacationTableFilters 
              searchBy={metadata.searchBy} 
              t={t} 
            />
          </div>
          <div className="w-full overflow-x-auto">
            <OfficialVacationsTable
              officialVacations={officialVacations}
              isLoading={isOfficialVacationsDataLoading}
              handleShow={handleShowPopupOpen}
              handleEdit={handleEditPopupOpen}
              handleDelete={handleDeletePopupOpen}
              t={t}
            />
          </div>

          {/* Pagination Component */}
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isOfficialVacationsDataLoading}
            onClickFirst={() => setFilters({ page: 1 })}
            onClickPrev={() => setFilters({ page: Math.max((page || 1) - 1, 1) })}
            onClickNext={() => setFilters({ page: Math.min((page || 1) + 1, metadata?.pagination?.totalPages || 1) })}
          />
        </div>
      </div>

      <AddOfficialVacationPopup
        isOpen={isAddPopupOpen}
        formInputs={renderOfficialVacationInputs}
        handleSubmit={handleSubmit(handleConfirmAdd)}
        handleClose={() => setIsAddPopupOpen(false)}
        isLoading={isAdding}
        t={t}
      />

      <EditOfficialVacationPopup
        isOpen={isEditPopupOpen} 
        handleClose={handleEditPopupClose} 
        isLoading={isUpdating} 
        handleSubmit={handleSubmit(handleConfirmUpdate)} 
        formInputs={renderOfficialVacationInputs} 
        t={t}
      />

      <DeleteOfficialVacationPopup
        isOpen={isDeletePopupOpen}
        handleClose={() => { setIsDeletePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        t={t}
      />

      <ShowOfficialVacationPopup
        isOpen={isShowPopupOpen}
        handleClose={() => setIsShowPopupOpen(false)} 
        handleDeletePopupOpen={() => {
          handleDeletePopupOpen(selectedID)
        }}
        handleEditPopupOpen={() => {
          handleEditPopupOpen(selectedID)
          setIsShowPopupOpen(false)
        }}
        officialVacation={officialVacation}
        isLoading={isOfficialVacationDataLoading}
        t={t}
      />
    </>
  )
}

export default ManageOfficialVacationsPage