import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FilePlus2 } from "lucide-react";
import {
  ActionCard,
  Button,
  Header,
  InfoPopup,
  Paginator,
  SectionHeader,
} from "../../../components/ui";
import { yupResolver } from "@hookform/resolvers/yup";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { useTranslation } from "react-i18next";
import {
  AssignPopup,
  ChangeToSickInputs,
  ChangeToSickPopup,
  EditPopup,
  Filters,
  HomeVisitTable,
  Inputs,
  ShowPopup,
} from "./views";
import {
  HOME_VISIT_REQUESTS_NS,
  HOME_VISIT_REQUESTS_EMPLOYEE_VIDEO,
} from "../../../constants";
import {
  AssignHomeLeaveRequestSchema,
  assignHomeLeaveRequestSchema,
  ChangeToSickFormValues,
  changeToSickSchema,
  HomeVisitFormValues,
  homeVisitRequestSchema,
} from "../../../validation/homeVisit.schema";
import {
  useAssignHomeVisit,
  useChangeToSickRequest,
  useGetAllHomeVisitRequests,
  useGetHomeVisitById,
  useUpdateHomeVisit,
} from "../../../hooks/hoomVisit.hooks";
import {
  BaseSickRequest,
  UpdateRequest,
} from "../../../interfaces/HomeVisit.interfaces";
import { useDebounce } from "../../../hooks";
import DeletePopup from "../requests/views/DeletePopup";
import { ISoftDeleteRequestCredentials } from "../../../interfaces/request.interfaces";
import { useSoftDeleteRequest } from "../../../hooks/request.hook";
import { HasPermission } from "../../../components/auth";

const HomeVisitRequestsPage = () => {
  const { t } = useTranslation(HOME_VISIT_REQUESTS_NS);

  const { getParam, setParam, clearParams } = useURLSearchParams();

  const [selectedID, setSelectedID] = useState<number>(0);

  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isAssignPopupOpen, setIsAssignPopupOpen] = useState(false);
  const [isChangePopupOpen, setIsChangePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  const {
    register: updateRegister,
    handleSubmit: updateHandleSubmit,
    formState: { errors: updateErrors },
    reset: updateReset,
  } = useForm<HomeVisitFormValues>({
    resolver: yupResolver(homeVisitRequestSchema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<AssignHomeLeaveRequestSchema>({
    resolver: yupResolver(assignHomeLeaveRequestSchema),
    mode: "onChange",
  });

  const {
    register: registerDelete,
    handleSubmit: handleSubmitDelete,
    reset: restDelete,
    formState: { errors: deleteErrors },
  } = useForm<ISoftDeleteRequestCredentials>();

  const {
    register: changeRegister,
    handleSubmit: changeHandleSubmit,
    formState: { errors: changeErrors },
    watch,
  } = useForm<ChangeToSickFormValues>({
    resolver: yupResolver(changeToSickSchema),
    mode: "onChange",
  });

  const handleShowPopupOpen = (id: number) => {
    setSelectedID(id);
    setIsShowPopupOpen(true);
  };
  const handleAssignPopupOpen = () => {
    setSelectedID(0);
    reset({ startDate: "", numberOfDays: 0, description: "" });
    setIsAssignPopupOpen(true);
  };
  const handleChangePopupOpen = (id: number) => {
    setSelectedID(id);
    setIsChangePopupOpen(true);
  };

  const handleDeletePopupClose = () => {
    setSelectedID(0);
    restDelete();
    setIsDeletePopupOpen(false);
  };

  const handleDeletePopupOpen = (id: number) => {
    setSelectedID(id);
    restDelete();
    setIsDeletePopupOpen(true);
  };

  const handleEditPopupOpen = (id: number) => {
    setSelectedID(id);

    const start = new Date(request.startDate);
    const end = new Date(request.endDate);

    const numberOfDays =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    updateReset({
      startDate: request.startDate,
      numberOfDays,
      description: request.description,
    });

    setIsEditPopupOpen(true);
  };
  const handleEditPopupClose = () => {
    setSelectedID(0);
    reset({ startDate: "", numberOfDays: 0, description: "" });
    setIsEditPopupOpen(false);
  };

  const handleConfirmDelete = handleSubmitDelete(
    (request: ISoftDeleteRequestCredentials) => {
      request.requestId = selectedID;
      deleteRequest(request);
      setIsDeletePopupOpen(false);
    }
  );

  // Using the enhanced getParam with parser support from the improved hook
  const rawPage = getParam("page", Number);
  const rawPageSize = getParam("pageSize", Number);
  const rawStartDate = getParam("startDate");
  const rawEndDate = getParam("endDate");
  const rawStatus = getParam("status", Number);
  const rawSearchKey = getParam("searchKey");
  const rawSearchQuery = useDebounce(getParam("searchQuery"), 650);

  // Use nullish coalescing to default numeric values, undefined for dates if empty
  const page = rawPage ?? 1;
  const pageSize = rawPageSize ?? 10;
  const startDate = rawStartDate || undefined;
  const endDate = rawEndDate || undefined;
  const status = rawStatus !== null ? rawStatus : undefined;
  const searchKey = rawSearchKey || undefined;
  const searchQuery = rawSearchQuery || undefined;

  // Pass filtered params to hook
  const {
    homeVisits,
    metadata,
    isLoading: isRequestsLoading,
  } = useGetAllHomeVisitRequests(
    page,
    pageSize,
    startDate,
    endDate,
    status,
    searchKey,
    searchQuery
  );

  const { request, isLoading: isRequestLoading } = useGetHomeVisitById(
    selectedID,
    true
  );

  const { mutate: assignRequest, isPending: isAssigning } =
    useAssignHomeVisit();

  const { mutate: updateRequest, isPending: isUpdating } = useUpdateHomeVisit();

  const { mutate: changeRequest, isPending: isChanging } =
    useChangeToSickRequest();

  const { mutate: deleteRequest, isPending: isDeleting } =
    useSoftDeleteRequest();

  const handleConfirmAssign: SubmitHandler<AssignHomeLeaveRequestSchema> = (
    request: AssignHomeLeaveRequestSchema
  ) => {
    assignRequest(request);
  };

  const handleConfirmUpdate: SubmitHandler<HomeVisitFormValues> = (
    request: HomeVisitFormValues
  ) => {
    const updatePayload: UpdateRequest = {
      ...request,
      id: selectedID,
    };

    updateRequest(updatePayload);
  };

  const handleConfirmChange: SubmitHandler<ChangeToSickFormValues> = (
    request: ChangeToSickFormValues
  ) => {
    const updatePayload: BaseSickRequest = {
      Id: Number(selectedID),
      ...request,
      MedicalReport: (request.MedicalReport instanceof FileList
        ? request.MedicalReport[0]
        : request.MedicalReport) as File,
    };
    changeRequest(updatePayload);
  };

  return (
    <div className="sm:p-6 p-4 space-y-5">
      <Header
        heading={t("employeeHeader.heading")}
        subtitle={t("employeeHeader.subtitle")}
      />

      {/* Action Buttons Section */}
      <HasPermission permission="Assign Requests to Employee">
        <div className="max-w-[1000px] flex flex-col items-center mx-auto space-y-6">
          <div className="w-full flex items-center justify-center">
            <InfoPopup
              title={t("infoPopup.title")}
              description={t("infoPopup.description")}
              videoUrl={HOME_VISIT_REQUESTS_EMPLOYEE_VIDEO}
            />
          </div>
          <div className="w-full md:w-[500px]">
            <ActionCard
              icon={<FilePlus2 />}
              iconBgColor="bg-[#e0f7fa]"
              iconColor="text-[#00796b]"
              title={t("assignActionCard.title")}
              description={t("assignActionCard.description")}
            >
              <Button
                fullWidth
                variant="secondary"
                onClick={handleAssignPopupOpen}
              >
                {t("assignActionCard.button")}
              </Button>
            </ActionCard>
          </div>
        </div>
      </HasPermission>
      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader
          title={t("employeeSectionHeader.title")}
          description={t("employeeSectionHeader.description")}
        />

        <Filters
          getParam={getParam}
          setParam={setParam}
          clearParams={clearParams}
          searchBy={metadata.searchBy}
        />

        <HomeVisitTable
          requests={homeVisits}
          isLoading={isRequestsLoading}
          handleEdit={handleEditPopupOpen}
          handleShow={handleShowPopupOpen}
          handleChange={handleChangePopupOpen}
          handleDelete={handleDeletePopupOpen}
        />

        {/* Pagination Component */}
        <Paginator
          page={metadata?.pagination?.pageIndex || 0}
          totalPages={metadata?.pagination?.totalPages || 1}
          totalRecords={metadata?.pagination?.totalRecords || 0}
          isLoading={isRequestsLoading}
          onClickFirst={() => setParam("page", String(1))}
          onClickPrev={() =>
            setParam(
              "page",
              String(Math.max((Number(getParam("page")) || 1) - 1, 1))
            )
          }
          onClickNext={() =>
            setParam(
              "page",
              String(
                Math.min(
                  (Number(getParam("page")) || 1) + 1,
                  metadata?.pagination?.totalPages || 1
                )
              )
            )
          }
        />
      </div>

      <ShowPopup
        isOpen={isShowPopupOpen}
        handleClose={() => setIsShowPopupOpen(false)}
        handleEditPopupOpen={() => {
          handleEditPopupOpen(selectedID);
          setIsShowPopupOpen(false);
        }}
        request={request}
        isLoading={isRequestLoading}
      />

      {/* Add Leave Request Popup */}
      <AssignPopup
        isOpen={isAssignPopupOpen}
        handleClose={() => {
          setIsAssignPopupOpen(false);
        }}
        handleSubmit={handleSubmit(handleConfirmAssign)}
        formInputs={
          <Inputs
            register={register}
            errors={errors}
            isLoading={isAssigning}
            control={control}
            isUpdateForm={false}
          />
        }
        isLoading={isAssigning}
      />

      <ChangeToSickPopup
        isOpen={isChangePopupOpen}
        handleClose={() => {
          setIsChangePopupOpen(false);
        }}
        handleSubmit={changeHandleSubmit(handleConfirmChange)}
        formInputs={
          <ChangeToSickInputs
            register={changeRegister}
            errors={changeErrors}
            watch={watch}
          />
        }
        isLoading={isChanging}
      />

      <EditPopup
        isOpen={isEditPopupOpen}
        handleClose={handleEditPopupClose}
        handleSubmit={updateHandleSubmit(handleConfirmUpdate)}
        formInputs={
          <Inputs
            register={updateRegister}
            errors={updateErrors}
            isLoading={isUpdating}
          />
        }
        isLoading={isUpdating}
      />

      <DeletePopup
        register={registerDelete}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        isOpen={isDeletePopupOpen}
        handleClose={handleDeletePopupClose}
        errors={deleteErrors} // ✅ Add this line
      />
    </div>
  );
};

export default HomeVisitRequestsPage;
