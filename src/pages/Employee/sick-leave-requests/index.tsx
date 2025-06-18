import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FilePlus2, ShieldCheck } from "lucide-react";
import { ActionCard, Button, Header, InfoPopup, Paginator, SectionHeader } from "../../../components/ui";
import { yupResolver } from "@hookform/resolvers/yup";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { useTranslation } from "react-i18next";
import { ISickRequestCredentials } from "../../../interfaces";
import { sickRequestSchema } from "../../../validation";
import { SICK_REQUESTS_EMPLOYEE_VIDEO, SICK_REQUESTS_NS } from "../../../constants";
import { useCreateSickRequest, useGetMySickRequestById, useGetMySickRequests } from "../../../hooks";
import { AddInputs, AddPopup, ConditionsPopup, Filters, ShowPopup, SickRequestsList } from "./views";

const SickRequestsPage = () => {
  const { t } = useTranslation(SICK_REQUESTS_NS);

  const {getParam, setParam, clearParams} = useURLSearchParams();

  const [selectedID, setSelectedID] = useState<number>(0);

  const [isConditionsOpen, setIsConditionsOpen] = useState(false);

  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<ISickRequestCredentials>({
    resolver: yupResolver(sickRequestSchema),
    mode: "onChange"
  });

  const handleShowPopupOpen = (id: number) => {
    setSelectedID(id)
    setIsShowPopupOpen(true) 
  }
  const handleAddPopupOpen = () => {
    setSelectedID(0)
    reset()
    setIsAddPopupOpen(true)
  }

  // Using the enhanced getParam with parser support from the improved hook
  const rawPage = getParam('page', Number);
  const rawPageSize = getParam('pageSize', Number);
  const rawStartDate = getParam('startDate');
  const rawEndDate = getParam('endDate');
  const rawStatus = getParam('status', Number);

  // Use nullish coalescing to default numeric values, undefined for dates if empty
  const page = rawPage ?? 1;
  const pageSize = rawPageSize ?? 10;
  const startDate = rawStartDate || undefined;
  const endDate = rawEndDate || undefined;
  const status = rawStatus !== null ? rawStatus : undefined;

  // Pass filtered params to hook
  const { sickRequests, metadata, isLoading: isSickRequestsLoading } = useGetMySickRequests(
    page,
    pageSize,
    startDate,
    endDate,
    status
  );

  const { sickRequest, isLoading: isSickRequestLoading } = useGetMySickRequestById(selectedID);
  const { mutate: createSickRequest, isPending: isAdding } = useCreateSickRequest()

  const handleConfirmAdd: SubmitHandler<ISickRequestCredentials> = (request: ISickRequestCredentials) => {
    createSickRequest(request);
    setIsAddPopupOpen(false)
  };

  return (
    <div className="sm:p-6 p-4 space-y-5">
      <Header
        heading={t("employeeHeader.heading")}
        subtitle={t("employeeHeader.subtitle")}
      />

      {/* Action Buttons Section */}
      <div className="max-w-[1000px] mx-auto space-y-6">
        <div className="w-full flex items-center justify-center">
          <InfoPopup
            title={t("infoPopupMissionRequestsEmployees.title")}
            description={t("infoPopupMissionRequestsEmployees.description")}
            videoUrl={SICK_REQUESTS_EMPLOYEE_VIDEO}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-1/2">
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

          <div className="w-full md:w-1/2">
            <ActionCard
              icon={<ShieldCheck />}
              iconBgColor="bg-[#fff3e0]"
              iconColor="text-[#f57c00]"
              title={t("conditionsActionCard.title")}
              description={t("conditionsActionCard.description")}
            >
              <Button
                fullWidth
                variant="secondary"
                onClick={() => setIsConditionsOpen(true)}
              >
                {t("conditionsActionCard.button")}
              </Button>
            </ActionCard>
          </div>
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

        <SickRequestsList
          sickRequests={sickRequests}
          isLoading={isSickRequestsLoading}
          handleEditPopupOpen={() => {}}
          handleShowPopupOpen={handleShowPopupOpen}
        />

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

      {/* Conditions Popup */}
      <ConditionsPopup
        isOpen={isConditionsOpen}
        handleClose={() => setIsConditionsOpen(false)}
      />

      <ShowPopup
        isOpen={isShowPopupOpen}
        handleClose={() => setIsShowPopupOpen(false)} 
        sickRequest={sickRequest}
        isLoading={isSickRequestLoading}
      />

      {/* Add Leave Request Popup */}
      <AddPopup
        isOpen={isAddPopupOpen}
        handleClose={() => {
          setIsAddPopupOpen(false);
        }}
        handleSubmit={handleSubmit(handleConfirmAdd)}
        formInputs={
          <AddInputs
            register={register}
            errors={errors}
            control={control}
          />
        }
        isLoading={isAdding}
      />
    </div>
  );
};

export default SickRequestsPage;
