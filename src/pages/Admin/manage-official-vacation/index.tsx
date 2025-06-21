import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CirclePlus, TreePalm } from "lucide-react";
import { formatValue } from "../../../utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { OfficialVacationFormValues, officialVacationSchema } from "../../../validation";
import { HasPermission } from "../../../components/auth";
import { useLanguageStore } from "../../../store/";
import { ActionCard, Button, CountCard, Header, InfoPopup, Paginator, SectionHeader } from "../../../components/ui";
import { useCreateOfficialVacation, useDebounce, useDeleteOfficialVacation, useGetOfficialVacationById, useGetOfficialVacations, useUpdateOfficialVacation } from "../../../hooks/";
import { OFFICIAL_VACATION_NS, OFFICIAL_VACATION_VIDEO } from "../../../constants";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { AddPopup, DeletePopup, EditPopup, Inputs, OfficialVacationsTable, ShowPopup, TableFilters } from "./views";
import { OfficialVacationCredentials } from "../../../interfaces";

const ManageOfficialVacationsPage = () => {
  const { t } = useTranslation([OFFICIAL_VACATION_NS]);
  const { language } = useLanguageStore();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<OfficialVacationFormValues>({
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
    reset({ name: "", startDate: "", endDate: "" })
    setIsAddPopupOpen(true)
  }
  const handleEditPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsEditPopupOpen(true)
  }
  const handleEditPopupClose = () => {
    setSelectedID(0)
    reset({ name: "", startDate: "", endDate: "" })
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
  const rawStartDate = getParam('startDate');
  const rawEndDate = getParam('endDate');

  // Use nullish coalescing to default numeric values, undefined for dates if empty
  const page = rawPage ?? 1;
  const pageSize = rawPageSize ?? 10;
  const searchKey = rawSearchKey || undefined;
  const searchQuery = rawSearchQuery || undefined;
  const startDate = rawStartDate || undefined;
  const endDate = rawEndDate || undefined;

  const { officialVacations, count, metadata, isLoading: isOfficialVacationsDataLoading } = useGetOfficialVacations(
    page, 
    pageSize, 
    startDate,
    endDate,
    searchKey, 
    searchQuery
  );

  const { officialVacation, isLoading: isOfficialVacationDataLoading } = useGetOfficialVacationById(selectedID, reset);

  const renderOfficialVacationInputs = <Inputs register={register} errors={errors} isLoading={isOfficialVacationDataLoading} />

  const { mutate: addOfficialVacation, isPending: isAdding } = useCreateOfficialVacation();
  const { mutate: updateOfficialVacation, isPending: isUpdating } = useUpdateOfficialVacation();
  const { mutate: deleteOfficialVacation, isPending: isDeleting } = useDeleteOfficialVacation();
  

  /* ____________ HANDLER ____________ */
  const handleConfirmAdd: SubmitHandler<OfficialVacationFormValues> = (request: OfficialVacationCredentials) => {
    addOfficialVacation(request)
    setIsAddPopupOpen(false)
  };
  const handleConfirmUpdate: SubmitHandler<OfficialVacationFormValues> = (request: OfficialVacationCredentials) => {
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
          heading={t("header.heading")}
          subtitle={t("header.subtitle")} 
        />

        <div className="w-full flex items-center justify-center">
          <InfoPopup
            title={t("infoPopup.title")}
            description={t("infoPopup.description")}
            videoUrl={OFFICIAL_VACATION_VIDEO}
          />
        </div>

        <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <CountCard 
            title={t("CountCard.title")}
            description={t("CountCard.description")}
            count={formatValue(count, language)}
            icon={<TreePalm size={28} />} 
            bgColor="bg-[#b38e19]" 
          />
          <HasPermission permission="Add Official Vacation">
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

          <TableFilters 
            searchBy={metadata.searchBy}
            getParam={getParam}
            setParam={setParam}
            clearParams={clearParams}
          />
          
          <div className="w-full overflow-x-auto">
            <OfficialVacationsTable
              officialVacations={officialVacations}
              isLoading={isOfficialVacationsDataLoading}
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
            isLoading={isOfficialVacationsDataLoading}
            onClickFirst={() => setParam("page", String(1))}
            onClickPrev={() => setParam("page", String(Math.max((Number(getParam('page')) || 1) - 1, 1)))}
            onClickNext={() => setParam("page", String(Math.min((Number(getParam('page')) || 1) + 1, metadata?.pagination?.totalPages || 1)))}
          />
        </div>
      </div>

      <AddPopup
        isOpen={isAddPopupOpen}
        formInputs={renderOfficialVacationInputs}
        handleSubmit={handleSubmit(handleConfirmAdd)}
        handleClose={() => setIsAddPopupOpen(false)}
        isLoading={isAdding}
      />

      <EditPopup
        isOpen={isEditPopupOpen} 
        handleClose={handleEditPopupClose} 
        isLoading={isUpdating} 
        handleSubmit={handleSubmit(handleConfirmUpdate)} 
        formInputs={renderOfficialVacationInputs} 
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
        officialVacation={officialVacation}
        isLoading={isOfficialVacationDataLoading}
      />
    </>
  )
}

export default ManageOfficialVacationsPage