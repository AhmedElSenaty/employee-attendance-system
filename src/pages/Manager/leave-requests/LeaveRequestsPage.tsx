import { useTranslation } from "react-i18next";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { useState } from "react";
import { IRejectLeaveRequestCredentials } from "../../../interfaces/";
import { useForm } from "react-hook-form";
import { useAcceptLeaveRequest, useGetLeaveRequestByID, useGetLeaveRequests, useRejectLeaveRequest } from "../../../hooks";
import { useDebounce } from "../../../hooks/";
import { Header, InfoPopup, Paginator, SectionHeader } from "../../../components/ui";
import { LEAVE_REQUESTS_MANAGER_VIDEO, LEAVE_REQUESTS_NS } from "../../../constants";
import { AcceptPopup, LeaveRequestsTable, ShowPopup, TableFilters } from "./views";
import RejectPopup from "./views/RejectPop";

const LeaveRequestsPage = () => {
  const { t } = useTranslation(LEAVE_REQUESTS_NS);

  const {getParam, setParam, clearParams} = useURLSearchParams();

  const [selectedID, setSelectedID] = useState<number>(0);

  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isAcceptPopupOpen, setIsAcceptPopupOpen] = useState(false);
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset
  } = useForm<IRejectLeaveRequestCredentials>();

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

  // Pass filtered params to hook
  const { leaveRequests, metadata, isLeaveRequestsLoading } = useGetLeaveRequests(
    page,
    pageSize,
    startDate,
    endDate,
    status,
    searchKey,
    searchQuery
  );

  const { leaveRequest, isLeaveRequestLoading } = useGetLeaveRequestByID(selectedID);

  const { mutate: acceptLeaveRequest, isPending: isAccepting } = useAcceptLeaveRequest()
  const { mutate: rejectLeaveRequest, isPending: isRejecting } = useRejectLeaveRequest()

  const handleConfirmAccept = () => {
    acceptLeaveRequest(selectedID);
    setIsAcceptPopupOpen(false)
  };

  const handleConfirmReject = handleSubmit((request: IRejectLeaveRequestCredentials) => {
    request.requestId = selectedID;
    console.log(request);
    
    rejectLeaveRequest(request);
    setIsRejectPopupOpen(false);
  });
  

  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header
        heading={t("managerHeader.title")}
        subtitle={t("managerHeader.subtitle")}
      />

      <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="w-full flex items-center justify-center">
          <InfoPopup
            title={t("infoPopupLeaveRequestsManager.title")}
            description={t("infoPopupLeaveRequestsManager.description")}
            videoUrl={LEAVE_REQUESTS_MANAGER_VIDEO}
          />
        </div>
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
          <LeaveRequestsTable leaveRequests={leaveRequests} isLoading={isLeaveRequestsLoading} handleShow={handleShowPopupOpen} handleAccept={handleAcceptPopupOpen} handleReject={handleRejectPopupOpen} />
        </div>

        {/* Pagination Component */}
        <Paginator
          page={metadata?.pagination?.pageIndex || 0}
          totalPages={metadata?.pagination?.totalPages || 1}
          totalRecords={metadata?.pagination?.totalRecords || 0}
          isLoading={isLeaveRequestsLoading}
          onClickFirst={() => setParam("page", String(1))}
          onClickPrev={() => setParam("page", String(Math.max((Number(getParam('page')) || 1) - 1, 1)))}
          onClickNext={() => setParam("page", String(Math.min((Number(getParam('page')) || 1) + 1, metadata?.pagination?.totalPages || 1)))}
        />
      </div>

        <ShowPopup 
          leaveRequest={leaveRequest}
          isOpen={isShowPopupOpen}
          handleClose={() =>  setIsShowPopupOpen(false) }
          isLoading={isLeaveRequestLoading}
        />

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
    </div>
  );
};

export default LeaveRequestsPage;
