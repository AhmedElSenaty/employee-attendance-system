import { useTranslation } from "react-i18next";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDebounce } from "../../../hooks";
import {
  ActionCard,
  Button,
  Header,
  InfoPopup,
  Paginator,
  SectionHeader,
} from "../../../components/ui";
import {
  useAcceptMissionRequest,
  useAssignMissionRequest,
  useGetMissionRequestByID,
  useGetMissionRequests,
  useRejectMissionRequest,
} from "../../../hooks";
import {
  IAssignMissionRequestCredentials,
  IRejectMissionRequestCredentials,
} from "../../../interfaces";
import {
  MISSION_REQUESTS_MANAGER_VIDEO,
  MISSION_REQUESTS_NS,
} from "../../../constants";
import {
  AcceptPopup,
  AssignInputs,
  AssignPopup,
  MissionRequestsTable,
  ShowPopup,
  TableFilters,
} from "./views";
import RejectPopup from "./views/RejectPop";
import { assignMissionRequestSchema } from "../../../validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { CirclePlus } from "lucide-react";
import { ISoftDeleteRequestCredentials } from "../../../interfaces/request.interfaces";
import { useSoftDeleteRequest } from "../../../hooks/request.hook";
import DeletePopup from "../requests/views/DeletePopup";
import EditRequestPopup from "../requests/views/EditRequestPopup";

const MissionRequestsPage = () => {
  const { t } = useTranslation(MISSION_REQUESTS_NS);
  const { getParam, setParam, clearParams } = useURLSearchParams();

  const [selectedID, setSelectedID] = useState<number>(0);
  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isAcceptPopupOpen, setIsAcceptPopupOpen] = useState(false);
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [isAssignPopupOpen, setIsAssignPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    register: registerDelete,
    handleSubmit: handleSubmitDelete,
    reset: restDelete,
    formState: { errors: deleteErrors },
  } = useForm<ISoftDeleteRequestCredentials>();

  const { register, handleSubmit, reset } =
    useForm<IRejectMissionRequestCredentials>();
  const {
    register: assignRegister,
    handleSubmit: handleSubmitAssign,
    reset: resetAssign,
    formState: { errors },
  } = useForm<IAssignMissionRequestCredentials>({
    resolver: yupResolver(assignMissionRequestSchema),
  });

  const handleShowPopupOpen = (id: number) => {
    setSelectedID(id);
    setIsShowPopupOpen(true);
  };
  const handleEditopupOpen = (id: number) => {
    setSelectedID(id);
    setIsEditOpen(true);
  };

  const handleAcceptPopupOpen = (id: number) => {
    setSelectedID(id);
    setIsAcceptPopupOpen(true);
  };

  const handleRejectPopupOpen = (id: number) => {
    setSelectedID(id);
    reset();
    setIsRejectPopupOpen(true);
  };

  const handleRejectPopupClose = () => {
    setSelectedID(0);
    reset();
    setIsRejectPopupOpen(false);
  };
  const handleDeletePopupOpen = (id: number) => {
    setSelectedID(id);
    restDelete();
    setIsDeletePopupOpen(true);
  };

  const handleDeletePopupClose = () => {
    setSelectedID(0);
    restDelete();
    setIsDeletePopupOpen(false);
  };

  const rawPage = getParam("page", Number);
  const rawPageSize = getParam("pageSize", Number);
  const rawStartDate = getParam("startDate");
  const rawEndDate = getParam("endDate");
  const rawStatus = getParam("status", Number);
  const rawSearchKey = getParam("searchKey");
  const rawSearchQuery = useDebounce(getParam("searchQuery"), 650);

  const page = rawPage ?? 1;
  const pageSize = rawPageSize ?? 10;
  const startDate = rawStartDate || undefined;
  const endDate = rawEndDate || undefined;
  const status = rawStatus !== null ? rawStatus : undefined;
  const searchKey = rawSearchKey || undefined;
  const searchQuery = rawSearchQuery || undefined;

  const { missionRequests, metadata, isMissionRequestsLoading } =
    useGetMissionRequests(
      page,
      pageSize,
      startDate,
      endDate,
      status,
      searchKey,
      searchQuery
    );

  const { missionRequest, isMissionRequestLoading } =
    useGetMissionRequestByID(selectedID);

  const { mutate: acceptMissionRequest, isPending: isAccepting } =
    useAcceptMissionRequest();
  const { mutate: rejectMissionRequest, isPending: isRejecting } =
    useRejectMissionRequest();
  const { mutate: assignMissionRequest, isPending: isSubmitting } =
    useAssignMissionRequest();
  const { mutate: deleteRequest, isPending: isDeleting } =
    useSoftDeleteRequest();

  const handleConfirmAccept = () => {
    acceptMissionRequest(selectedID);
    setIsAcceptPopupOpen(false);
  };

  const handleConfirmReject = handleSubmit(
    (request: IRejectMissionRequestCredentials) => {
      request.requestId = selectedID;
      rejectMissionRequest(request);
      setIsRejectPopupOpen(false);
    }
  );

  const onSubmit: SubmitHandler<IAssignMissionRequestCredentials> = (
    data: IAssignMissionRequestCredentials
  ) => {
    assignMissionRequest(data);
    setIsAssignPopupOpen(false);
  };
  const handleConfirmDelete = handleSubmitDelete(
    (request: ISoftDeleteRequestCredentials) => {
      request.requestId = selectedID;
      deleteRequest(request);
      setIsDeletePopupOpen(false);
    }
  );
  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header
        heading={t("managerHeader.title")}
        subtitle={t("managerHeader.subtitle")}
      />

      <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <div className="w-full flex items-center justify-center">
          <InfoPopup
            title={t("infoPopupMissionRequestsManager.title")}
            description={t("infoPopupMissionRequestsManager.description")}
            videoUrl={MISSION_REQUESTS_MANAGER_VIDEO}
          />
        </div>
        <ActionCard
          icon={<CirclePlus />}
          iconBgColor="bg-[#f5e4b2]"
          iconColor="text-[#b38e19]"
          title={t("assignMission.title")}
          description={t("assignMission.description")}
        >
          <Button
            fullWidth
            variant="secondary"
            onClick={() => {
              resetAssign({
                date: "",
                employeeId: 0,
                description: "",
              });
              setIsAssignPopupOpen(true);
            }}
          >
            {t("assignMission.button")}
          </Button>
        </ActionCard>
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader
          title={t("managerSectionHeader.title")}
          description={t("managerSectionHeader.description")}
        />

        <div className="flex flex-wrap gap-4">
          <TableFilters
            searchBy={metadata.searchBy}
            getParam={getParam}
            setParam={setParam}
            clearParams={clearParams}
          />
        </div>

        <div className="w-full overflow-x-auto">
          <MissionRequestsTable
            missionRequests={missionRequests}
            isLoading={isMissionRequestsLoading}
            handleShow={handleShowPopupOpen}
            handleAccept={handleAcceptPopupOpen}
            handleReject={handleRejectPopupOpen}
            handleDelete={handleDeletePopupOpen}
            handleEdit={handleEditopupOpen}
          />
        </div>

        <Paginator
          page={(metadata?.pagination?.pageIndex ?? 0) + 1} // converting 0-based index to 1-based
          totalPages={metadata?.pagination?.totalPages || 1}
          totalRecords={metadata?.pagination?.totalRecords || 0}
          isLoading={isMissionRequestsLoading}
          onClickFirst={() => setParam("page", "1")}
          onClickPrev={() => setParam("page", String(Math.max(page - 1, 1)))}
          onClickNext={() =>
            setParam(
              "page",
              String(Math.min(page + 1, metadata?.pagination?.totalPages || 1))
            )
          }
        />
      </div>

      <ShowPopup
        missionRequest={missionRequest}
        isOpen={isShowPopupOpen}
        handleClose={() => setIsShowPopupOpen(false)}
        isLoading={isMissionRequestLoading}
      />

      <AcceptPopup
        isOpen={isAcceptPopupOpen}
        handleConfirmAccept={handleConfirmAccept}
        isLoading={isAccepting}
        handleClose={() => setIsAcceptPopupOpen(false)}
      />

      <RejectPopup
        register={register}
        handleConfirmReject={handleConfirmReject}
        isLoading={isRejecting}
        isOpen={isRejectPopupOpen}
        handleClose={handleRejectPopupClose}
      />

      <AssignPopup
        isOpen={isAssignPopupOpen}
        handleClose={() => setIsAssignPopupOpen(false)}
        handleSubmit={handleSubmitAssign(onSubmit)}
        formInputs={<AssignInputs register={assignRegister} errors={errors} />}
        isLoading={isSubmitting}
      />
      <DeletePopup
        register={registerDelete}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        isOpen={isDeletePopupOpen}
        handleClose={handleDeletePopupClose}
        errors={deleteErrors}
      />

      <EditRequestPopup
        isOpen={isEditOpen}
        handleClose={() => {
          setIsEditOpen(false);
        }}
        requestId={selectedID}
      />
    </div>
  );
};

export default MissionRequestsPage;
