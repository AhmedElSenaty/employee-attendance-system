import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarSearch, CirclePlus, FileDown } from "lucide-react";
import { downloadFile, formatValue, showToast } from "../../../utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AttendanceFormValues, attendanceSchema } from "../../../validation";
import { HasPermission } from "../../../components/auth";
import { useLanguageStore } from "../../../store/";
import {
  ActionCard,
  Button,
  CountCard,
  Header,
  InfoPopup,
  Paginator,
  SectionHeader,
} from "../../../components/ui";
import {
  useCreateAttendance,
  useDeleteAttendance,
  useGetAttendanceDetails,
  useGetAttendances,
  useUpdateAttendance,
  useExportAttendanceReport,
  useDebounce,
  useExportAttendanceReportPDF,
} from "../../../hooks/";
import { ATTENDANCE_NS, ATTENDANCE_VIDEO } from "../../../constants";
import {
  AddPopup,
  AttendanceTable,
  AttendanceTableFilters,
  DeletePopup,
  EditPopup,
  ExportPopup,
  Inputs,
  ShowPopup,
} from "./views";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";

const ManageAttendancePage = () => {
  const { t } = useTranslation([ATTENDANCE_NS]);
  const { language } = useLanguageStore();
  const { getParam, setParam, clearParams, setParams } = useURLSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<AttendanceFormValues>({
    resolver: yupResolver(attendanceSchema),
    mode: "onChange",
  });

  const [selectedID, setSelectedID] = useState<number>(0);

  const [isShowPopupOpen, setIsShowPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isDownloadReportPopupOpen, setIsDownloadReportPopupOpen] =
    useState(false);

  const handleShowPopupOpen = (id: number) => {
    setSelectedID(id);
    setIsShowPopupOpen(true);
  };
  const handleAddPopupOpen = () => {
    setSelectedID(0);
    reset({
      deviceId: 0,
      employeeId: 0,
      attendanceDate: "",
      attendanceTime: "",
      status: "",
    });
    setIsAddPopupOpen(true);
  };
  const handleEditPopupOpen = (id: number) => {
    setSelectedID(id);
    setIsEditPopupOpen(true);
  };

  const handleEditPopupClose = () => {
    setSelectedID(0);
    reset({
      deviceId: 0,
      employeeId: 0,
      attendanceDate: "",
      attendanceTime: "",
      status: "",
    });
    setIsEditPopupOpen(false);
  };
  const handleDeletePopupOpen = (id: number) => {
    setSelectedID(id);
    setIsDeletePopupOpen(true);
  };

  // Using the enhanced getParam with parser support from the improved hook
  const rawPage = getParam("page", Number);
  const rawPageSize = getParam("pageSize", Number);
  const rawStartDate = getParam("startDate");
  const rawEndDate = getParam("endDate");
  const rawStartTime = getParam("startTime");
  const rawEndTime = getParam("endTime");
  const rawSearchKey = getParam("searchKey");
  const rawSearchQuery = useDebounce(getParam("searchQuery"), 650);
  const rawStatus = getParam("status");
  const rawDepartmentId = getParam("searchByDepartmentId", Number);
  const rawSubDeptartmentId = getParam("searchBySubDeptartmentId", Number);
  const rawChecked = getParam("IncludeSubDepartments");
  const rowAbsenceOnly = getParam("AbsenceOnly");

  // Use nullish coalescing to default numeric values, undefined for dates if empty
  const page = rawPage ?? 1;
  const pageSize = rawPageSize ?? 10;
  const startDate = rawStartDate || undefined;
  const endDate = rawEndDate || undefined;
  const startTime = rawStartTime || undefined;
  const endTime = rawEndTime || undefined;
  const searchKey = rawSearchKey || undefined;
  const status = rawStatus || undefined;
  const searchQuery = useDebounce(rawSearchQuery, 650) || undefined;
  const departmentId = rawDepartmentId || "";
  const checked = rawChecked || false;
  const subDeptartmentId = rawSubDeptartmentId || "";
  const absenceOnly = rowAbsenceOnly || false;

  const {
    attendancesData,
    count: totalAttendances,
    metadata,
    isLoading: isAttendancesDataLoading,
  } = useGetAttendances(
    page,
    pageSize,
    searchKey,
    searchQuery,
    startDate,
    endDate,
    startTime,
    endTime,
    status,
    departmentId || 0,
    subDeptartmentId || 0
  );

  // Use the custom hook to fetch data
  const { refetchExportData, isLoading: isExportDataLoading } =
    useExportAttendanceReport(
      searchKey,
      searchQuery,
      startDate,
      endDate,
      startTime,
      endTime,
      status,
      checked,
      departmentId || 0,
      subDeptartmentId || 0,
      // absenceOnly
    );
  const { isLoadingPDF, refetchExportDataPDF } = useExportAttendanceReportPDF(
    searchKey,
    searchQuery,
    startDate,
    endDate,
    startTime,
    endTime,
    status,
    checked,
    departmentId || 0,
    subDeptartmentId || 0,
    absenceOnly
  );

  const { detailedAttendance, isLoading: isDetailedAttendanceLoading } =
    useGetAttendanceDetails(selectedID, reset);

  const renderAttendanceInputs = (
    <Inputs register={register} errors={errors} control={control} />
  );

  const { mutate: addAttendance, isPending: isAdding } = useCreateAttendance();
  const { mutate: updateAttendance, isPending: isUpdating } =
    useUpdateAttendance();
  const { mutate: deleteAttendance, isPending: isDeleting } =
    useDeleteAttendance();

  /* ____________ HANDLER ____________ */
  const handleConfirmAdd: SubmitHandler<AttendanceFormValues> = (
    request: AttendanceFormValues
  ) => {
    addAttendance(request);
    setIsAddPopupOpen(false);
  };
  const handleConfirmUpdate: SubmitHandler<AttendanceFormValues> = (
    request: AttendanceFormValues
  ) => {
    updateAttendance(request);
    setIsEditPopupOpen(false);
  };
  const handleConfirmDelete = () => {
    if (!selectedID) return;
    deleteAttendance(selectedID);
    setIsDeletePopupOpen(false);
    setIsShowPopupOpen(false);
  };

  const handleDownload = async () => {
    const { data, isSuccess, isError } = await refetchExportData();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
    }
    if (isError) {
      showToast("error", t("export.exportError"));
    }
  };
  const handleDownloadPDF = async () => {
    const { data, isSuccess, isError } = await refetchExportDataPDF();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
    }
    if (isError) {
      showToast("error", t("export.exportError"));
    }
  };
  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header heading={t("header.heading")} subtitle={t("header.subtitle")} />
        <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="w-full flex items-center justify-center">
            <InfoPopup
              title={t("infoPopupAttendance.title")}
              description={t("infoPopupAttendance.description")}
              videoUrl={ATTENDANCE_VIDEO}
            />
          </div>
          <CountCard
            title={t("CountCard.title")}
            description={t("CountCard.description")}
            count={formatValue(totalAttendances, language)}
            icon={<CalendarSearch size={28} />}
            bgColor="bg-[#b38e19]"
          />
          {/* ActionCard */}
        </div>
        <div className="w-[1000px] max-xl:w-full grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto">
          <div className="flex-1">
            <HasPermission permission="Add Attendance">
              <ActionCard
                icon={<CirclePlus />}
                iconBgColor="bg-[#f5e4b2]"
                iconColor="text-[#b38e19]"
                title={t("addActionCard.title")}
                description={t("addActionCard.description")}
              >
                <Button
                  fullWidth={true}
                  variant="secondary"
                  onClick={handleAddPopupOpen}
                >
                  {t("addActionCard.button")}
                </Button>
              </ActionCard>
            </HasPermission>
          </div>
          <div className="flex-1">
            <HasPermission
              permission={[
                "Export Attendance Report Excel",
                "Export Attendance Report PDF",
              ]}
            >
              <ActionCard
                icon={<FileDown />}
                iconBgColor="bg-[#a7f3d0]"
                iconColor="text-[#10b981]"
                title={t("exportActionCard.title")}
                description={t("exportActionCard.description")}
              >
                <Button
                  fullWidth
                  variant="success"
                  isLoading={isExportDataLoading}
                  onClick={() => {
                    setIsDownloadReportPopupOpen(true);
                  }}
                >
                  {t("exportActionCard.button")}
                </Button>
              </ActionCard>
            </HasPermission>
          </div>
        </div>

        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader
            title={t("sectionHeader.title")}
            description={t("sectionHeader.description")}
          />

          <div className="flex flex-col gap-5">
            <AttendanceTableFilters
              searchBy={metadata.searchBy}
              getParam={getParam}
              setParam={setParam}
              clearParams={clearParams}
              setParams={setParams}
            />
          </div>
          <div className="w-full overflow-x-auto">
            <AttendanceTable
              attendances={attendancesData}
              isLoading={isAttendancesDataLoading}
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
            isLoading={isAttendancesDataLoading}
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
      </div>
      <AddPopup
        isOpen={isAddPopupOpen}
        formInputs={renderAttendanceInputs}
        handleSubmit={handleSubmit(handleConfirmAdd)}
        handleClose={() => setIsAddPopupOpen(false)}
        isLoading={isAdding}
      />
      <EditPopup
        isOpen={isEditPopupOpen}
        handleClose={handleEditPopupClose}
        isLoading={isUpdating}
        handleSubmit={handleSubmit(handleConfirmUpdate)}
        formInputs={renderAttendanceInputs}
      />
      <DeletePopup
        isOpen={isDeletePopupOpen}
        handleClose={() => {
          setIsDeletePopupOpen(false);
        }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
      />
      ;
      <ShowPopup
        isOpen={isShowPopupOpen}
        handleClose={() => setIsShowPopupOpen(false)}
        handleDeletePopupOpen={() => {
          handleDeletePopupOpen(selectedID);
        }}
        handleEditPopupOpen={() => {
          handleEditPopupOpen(selectedID);
          setIsShowPopupOpen(false);
        }}
        attendance={detailedAttendance}
        isLoading={isDetailedAttendanceLoading}
      />
      <ExportPopup
        isOpen={isDownloadReportPopupOpen}
        handleClose={() => setIsDownloadReportPopupOpen(false)}
        handleDownload={() => {
          handleDownload();
        }}
        filteredData={{
          searchKey: searchKey || "",
          search: searchQuery || "",
          startDate:
            startDate ||
            `${new Date().getFullYear()}-${String(
              new Date().getMonth() + 1
            ).padStart(2, "0")}-01`,
          endDate:
            endDate ||
            `${new Date().getFullYear()}-${String(
              new Date().getMonth() + 1
            ).padStart(2, "0")}-${String(
              new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                0
              ).getDate()
            ).padStart(2, "0")}`,

          startTime: startTime || "",
          endTime: endTime || "",
          status: status || "",
          searchByDepartmentId: Number(departmentId || 0),
          searchBySubDeptartmentId: Number(subDeptartmentId || 0),
          checked: checked,
        }}
        isLoading={isExportDataLoading}
        isloadingPDF={isLoadingPDF}
        handleDownloadPDF={handleDownloadPDF}
      />
    </>
  );
};

export default ManageAttendancePage;
