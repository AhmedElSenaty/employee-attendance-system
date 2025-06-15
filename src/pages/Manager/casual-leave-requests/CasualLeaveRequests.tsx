import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from ".";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { useState } from "react";
import { IRejectLeaveRequestCredentials } from "../../../interfaces/leaveRequest.interfaces";
import { useForm } from "react-hook-form";
import { useDebounce } from "../../../hooks/debounce.hook";
import { CountCard, Header, Paginator, SectionHeader } from "../../../components/ui";
import { formatValue } from "../../../utils";
import { useLanguageStore } from "../../../store/language.store";
import { CalendarCheck } from "lucide-react";
import TableFilters from "./views/TableFilters";
import CasualLeaveRequestsTable from "./views/CasualLeaveRequestsTable";
import ShowPopup from "./views/ShowPopup";
import AcceptPopup from "./views/AcceptPopup";
import RejectPopup from "./views/RejectPop";
import { IRejectCasualLeaveRequestCredentials } from "../../../interfaces";
import { useAcceptCasualLeaveRequest, useGetCasualLeaveRequestByID, useGetCasualLeaveRequests, useRejectCasualLeaveRequest } from "../../../hooks";

const CasualLeaveRequestsPage = () => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);
  const { language } = useLanguageStore();

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
  const { casualLeaveRequests, totalRequests, metadata, isCasualLeaveRequestsLoading } = useGetCasualLeaveRequests(
    page,
    pageSize,
    startDate,
    endDate,
    status,
    searchKey,
    searchQuery
  );

  const { casualLeaveRequest, isCasualLeaveRequestLoading } = useGetCasualLeaveRequestByID(selectedID);

  const { mutate: acceptCasualLeaveRequest, isPending: isAccepting } = useAcceptCasualLeaveRequest()
  const { mutate: rejectCasualLeaveRequest, isPending: isRejecting } = useRejectCasualLeaveRequest()

  const handleConfirmAccept = () => {
    acceptCasualLeaveRequest(selectedID);
    setIsAcceptPopupOpen(false)
  };

  const handleConfirmReject = handleSubmit((request: IRejectCasualLeaveRequestCredentials) => {
    request.requestId = selectedID;
    console.log(request);
    
    rejectCasualLeaveRequest(request);
    setIsRejectPopupOpen(false);
  });
  

  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header
        heading={t("managerHeader.title")}
        subtitle={t("managerHeader.subtitle")}
      />

      <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <CountCard 
            title={t("countCard.title")}
            description={t("countCard.description")}
            count={formatValue(totalRequests, language)}
            icon={<CalendarCheck size={28} />} 
            bgColor="bg-[#b38e19]" 
          />
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
            <CasualLeaveRequestsTable casualLeaveRequests={casualLeaveRequests} isLoading={isCasualLeaveRequestsLoading} handleShow={handleShowPopupOpen} handleAccept={handleAcceptPopupOpen} handleReject={handleRejectPopupOpen} />
          </div>

          {/* Pagination Component */}
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isCasualLeaveRequestsLoading}
            onClickFirst={() => setParam("page", String(1))}
            onClickPrev={() => setParam("page", String(Math.max((Number(getParam('endDate')) || 1) - 1, 1)))}
            onClickNext={() => setParam("page", String(Math.min((Number(getParam('endDate')) || 1) + 1, metadata?.pagination?.totalPages || 1)))}
          />
        </div>

        <ShowPopup 
          casualLeaveRequest={casualLeaveRequest}
          isOpen={isShowPopupOpen}
          handleClose={() =>  setIsShowPopupOpen(false) }
          isLoading={isCasualLeaveRequestLoading}
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

export default CasualLeaveRequestsPage;
