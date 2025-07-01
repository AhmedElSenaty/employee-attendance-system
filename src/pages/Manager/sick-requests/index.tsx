import { useTranslation } from "react-i18next";
import { SICK_REQUESTS_MANAGER_VIDEO, SICK_REQUESTS_NS } from "../../../constants";
import { useAcceptSickRequest, useAssignSickRequest, useDebounce, useGetSickRequestById, useGetSickRequests, useRejectSickRequest } from "../../../hooks"
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { useState } from "react";
import { IAssignSickRequestCredentials, IRejectSickRequestCredentials } from "../../../interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { ActionCard, Button, Header, InfoPopup, Paginator, SectionHeader } from "../../../components/ui";
import { AcceptPopup, AssignInputs, AssignPopup, RejectPopup, ShowPopup, SickRequestsTable, TableFilters } from "./views";
import { yupResolver } from "@hookform/resolvers/yup";
import { assignSickRequestSchema } from "../../../validation";
import { CirclePlus } from "lucide-react";
import { HasPermission } from "../../../components/auth";

const SickLRequestsPage = () => {
  const { t } = useTranslation(SICK_REQUESTS_NS);

  const {getParam, setParam, clearParams} = useURLSearchParams();

  const [selectedID, setSelectedID] = useState<number>(0);

  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isAcceptPopupOpen, setIsAcceptPopupOpen] = useState(false);
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [isAssignPopupOpen, setIsAssignPopupOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset
  } = useForm<IRejectSickRequestCredentials>();

  const { register: assignRegister, handleSubmit: handleSubmitAssign, formState: { errors }, reset: resetAssign, watch, control } = useForm<IAssignSickRequestCredentials>({
    resolver: yupResolver(assignSickRequestSchema),
    mode: "onChange"
  });

  const handleShowPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsShowPopupOpen(true) 
  }

  const handleAcceptPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsAcceptPopupOpen(true)
  }
  const handleRejectPopupOpen = (id: number) => {
    setSelectedID(id)
    reset()
    setIsRejectPopupOpen(true)
  }
  const handleRejectPopupClose = () => {
    setSelectedID(0)
    reset()
    setIsRejectPopupOpen(false)
  }

    // Using the enhanced getParam with parser support from the improved hook
    const rawPage = getParam('page', Number);
    const rawPageSize = getParam('pageSize', Number);
    const rawStartDate = getParam('startDate');
    const rawEndDate = getParam('endDate');
    const rawStatus = getParam('status', Number);
    const rawSearchKey = getParam('searchKey');
    const rawSearchQuery = useDebounce(getParam('searchQuery'), 650);
  
    // Use nullish coalescing to default numeric values, undefined for dates if empty
    const page = rawPage ?? 1;
    const pageSize = rawPageSize ?? 10;
    const startDate = rawStartDate || undefined;
    const endDate = rawEndDate || undefined;
    const status = rawStatus !== null ? rawStatus : undefined;
    const searchKey = rawSearchKey || undefined;
    const searchQuery = rawSearchQuery || undefined;

  const { sickRequests, metadata, isLoading: isSickRequestsLoading } = useGetSickRequests(
    page,
    pageSize,
    startDate,
    endDate,
    status,
    searchKey,
    searchQuery
  );

  const { sickRequest, isLoading: isSickRequestLoading } = useGetSickRequestById(selectedID)

  const { mutate: acceptSickRequest, isPending: isAccepting } = useAcceptSickRequest()
  const { mutate: rejectSickRequest, isPending: isRejecting } = useRejectSickRequest()
  const { mutate: assignSickRequest, isPending: isAssigning } = useAssignSickRequest()

  const handleConfirmAccept = () => {
    acceptSickRequest(selectedID);
    setIsAcceptPopupOpen(false)
  };

  const handleConfirmReject = handleSubmit((request: IRejectSickRequestCredentials) => {
    request.requestId = selectedID;
    rejectSickRequest(request);
    setIsRejectPopupOpen(false);
  });
  
  const handleConfirmAssign: SubmitHandler<IAssignSickRequestCredentials> = (request: IAssignSickRequestCredentials) => {
    assignSickRequest(request)
    setIsAssignPopupOpen(false)
  };

  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header
        heading={t("managerHeader.title")}
        subtitle={t("managerHeader.subtitle")}
      />

      <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="w-full flex items-center justify-center">
          <InfoPopup
            title={t("infoPopupManager.title")}
            description={t("infoPopupManager.description")}
            videoUrl={SICK_REQUESTS_MANAGER_VIDEO}
          />
        </div>
        <HasPermission permission="Assign Requests to Employee">
          <ActionCard
            icon={<CirclePlus />}
            iconBgColor="bg-[#f5e4b2]"
            iconColor="text-[#b38e19]"
            title={t("assignActionCard.title")}
            description={t("assignActionCard.description")}
          >
            <Button fullWidth variant="secondary" onClick={() => {
              resetAssign()
              setIsAssignPopupOpen(true)
            }}>
              {t("assignActionCard.button")}
            </Button>
          </ActionCard>
        </HasPermission>
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("managerSectionHeader.title")} 
          description={t("managerSectionHeader.description")}
        />

          <div className="flex flex-wrap gap-4">
            <TableFilters searchBy={metadata.searchBy} getParam={getParam} setParam={setParam} clearParams={clearParams} />
          </div>

          <div className="w-full overflow-x-auto">
            <SickRequestsTable sickRequests={sickRequests} isLoading={isSickRequestsLoading} handleShow={handleShowPopupOpen} handleAccept={handleAcceptPopupOpen} handleReject={handleRejectPopupOpen} />
          </div>


          {/* Pagination Component */}
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isSickRequestsLoading}
            onClickFirst={() => setParam("page", String(1))}
            onClickPrev={() => setParam("page", String(Math.max((Number(getParam('page')) || 1) - 1, 1)))}
            onClickNext={() => setParam("page", String(Math.min((Number(getParam('page')) || 1) + 1, metadata?.pagination?.totalPages || 1)))}
          />
      </div>
      <AcceptPopup
        isOpen={isAcceptPopupOpen}
        handleConfirmAccept={handleConfirmAccept}
        isLoading={isAccepting}
        handleClose={() => setIsAcceptPopupOpen(false) }
      />
      <RejectPopup 
        register={register}
        handleConfirmReject={handleConfirmReject}
        isLoading={isRejecting}
        isOpen={isRejectPopupOpen}
        handleClose={handleRejectPopupClose}
      />
      <ShowPopup
        sickRequest={sickRequest}
        isOpen={isShowPopupOpen}
        handleClose={() => setIsShowPopupOpen(false)}
        handleAcceptPopupOpen={handleAcceptPopupOpen}
        handleRejectPopupOpen={handleRejectPopupOpen}
        isLoading={isSickRequestLoading}
      />

      <AssignPopup 
        isOpen={isAssignPopupOpen}
        handleClose={() => {
          resetAssign()
          setIsAssignPopupOpen(false)
        }}
        formInputs={
          <AssignInputs 
            register={assignRegister}
            errors={errors}
            watch={watch}
            control={control}
          />
        }
        handleSubmit={handleSubmitAssign(handleConfirmAssign)}
        isLoading={isAssigning}
      />
    </div>
  )
}

export default SickLRequestsPage
