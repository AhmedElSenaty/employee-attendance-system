import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FilePlus2 } from "lucide-react";
import {
  ActionCard,
  Button,
  Header,
  InfoPopup,
  NoDataMessage,
  Paginator,
  SectionHeader,
} from "../../../components/ui";
import { yupResolver } from "@hookform/resolvers/yup";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { useTranslation } from "react-i18next";
import {
  AddPopup,
  ChangeToSickInputs,
  ChangeToSickPopup,
  EditPopup,
  Filters,
  Inputs,
  List,
  ShowPopup,
} from "./views";
import {
  HOME_VISIT_REQUESTS_NS,
  HOME_VISIT_REQUESTS_EMPLOYEE_VIDEO,
} from "../../../constants";
import { ChangeToSickFormValues, changeToSickSchema, HomeVisitFormValues, homeVisitRequestSchema } from "../../../validation/homeVisit.schema";
import { useChangeToSickRequest, useCreateHomeVisit, useGetHomeVisitById, useGetMyHomeVisitRequests, useUpdateHomeVisit } from "../../../hooks/hoomVisit.hooks";
import { BaseSickRequest, UpdateRequest } from "../../../interfaces/HomeVisit.interfaces";

const HomeVisitRequestsPage = () => {
  const { t } = useTranslation(HOME_VISIT_REQUESTS_NS);

  const { getParam, setParam, clearParams } = useURLSearchParams();

  const [selectedID, setSelectedID] = useState<number>(0);

  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isChangePopupOpen, setIsChangePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HomeVisitFormValues>({
    resolver: yupResolver(homeVisitRequestSchema),
    mode: "onChange",
  });
  const {
    register: changeRegister,
    handleSubmit: changeHandleSubmit,
    formState: { errors: changeErrors },
    watch
  } = useForm<ChangeToSickFormValues>({
    resolver: yupResolver(changeToSickSchema),
    mode: "onChange",
  });

  const handleShowPopupOpen = (id: number) => {
    setSelectedID(id);
    setIsShowPopupOpen(true);
  };
  const handleAddPopupOpen = () => {
    setSelectedID(0);
    reset({ startDate: "", numberOfDays: 0, description: "" });
    setIsAddPopupOpen(true);
  };
  const handleChangePopupOpen = (id: number) => {
    setSelectedID(id);
    setIsChangePopupOpen(true);
  };
  const handleEditPopupOpen = (id: number) => {
    setSelectedID(id);

    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    
    const numberOfDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    reset({
      startDate: request.startDate,
      numberOfDays,
      description: request.description
    });
    
    setIsEditPopupOpen(true);
  };
  const handleEditPopupClose = () => {
    setSelectedID(0);
    reset({ startDate: "", numberOfDays: 0, description: "" });
    setIsEditPopupOpen(false);
  };

  // Using the enhanced getParam with parser support from the improved hook
  const rawPage = getParam("page", Number);
  const rawPageSize = getParam("pageSize", Number);
  const rawStartDate = getParam("startDate");
  const rawEndDate = getParam("endDate");

  // Use nullish coalescing to default numeric values, undefined for dates if empty
  const page = rawPage ?? 1;
  const pageSize = rawPageSize ?? 10;
  const startDate = rawStartDate || undefined;
  const endDate = rawEndDate || undefined;

  // Pass filtered params to hook
  const { homeVisits, metadata, isLoading: isRequestsLoading } =
  useGetMyHomeVisitRequests(page, pageSize, startDate, endDate);

  const { request, isLoading: isRequestLoading } = useGetHomeVisitById(
    selectedID,
  );

  const { mutate: createRequest, isPending: isAdding } =
    useCreateHomeVisit();

  const { mutate: updateRequest, isPending: isUpdating } =
  useUpdateHomeVisit();

  const { mutate: changeRequest, isPending: isChanging } =
  useChangeToSickRequest();

  const handleConfirmAdd: SubmitHandler<HomeVisitFormValues> = (
    request: HomeVisitFormValues
  ) => {
    createRequest(request);
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
    setIsChangePopupOpen(false)
  };

  return (
    <div className="sm:p-6 p-4 space-y-5">
      <Header
        heading={t("employeeHeader.heading")}
        subtitle={t("employeeHeader.subtitle")}
      />

      {/* Action Buttons Section */}
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
            title={t("addActionCard.title")}
            description={t("addActionCard.description")}
          >
            <Button
              fullWidth
              variant="secondary"
              onClick={handleAddPopupOpen}
            >
              {t("addActionCard.button")}
            </Button>
          </ActionCard>
        </div>
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader
          title={t("employeeSectionHeader.title")}
          description={t("employeeSectionHeader.description")}
        />

        <Filters
          getParam={getParam}
          setParam={setParam}
          clearParams={clearParams}
        />

        {homeVisits.length > 0 ? (
          <List
            requests={homeVisits}
            isLoading={isRequestsLoading}
            handleEditPopupOpen={handleEditPopupOpen}
            handleShowPopupOpen={handleShowPopupOpen}
            handleChangePopupOpen={handleChangePopupOpen}
          />
        ) : (
          <NoDataMessage
            title={t("table.emptyTable.title")}
            message={t("table.emptyTable.message")}
          />
        )}

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
      <AddPopup
        isOpen={isAddPopupOpen}
        handleClose={() => {
          setIsAddPopupOpen(false);
        }}
        handleSubmit={handleSubmit(handleConfirmAdd)}
        formInputs={
          <Inputs register={register} errors={errors} isLoading={isAdding} />
        }
        isLoading={isAdding}
      />
      <ChangeToSickPopup
        isOpen={isChangePopupOpen}
        handleClose={() => {
          setIsChangePopupOpen(false);
        }}
        handleSubmit={changeHandleSubmit(handleConfirmChange)}
        formInputs={
          <ChangeToSickInputs register={changeRegister} errors={changeErrors} watch={watch} />
        }
        isLoading={isChanging}
      />

      <EditPopup
        isOpen={isEditPopupOpen}
        handleClose={handleEditPopupClose}
        handleSubmit={handleSubmit(handleConfirmUpdate)}
        formInputs={
          <Inputs register={register} errors={errors} isLoading={isUpdating} />
        }
        isLoading={isUpdating}
      />
    </div>
  );
};

export default HomeVisitRequestsPage;
