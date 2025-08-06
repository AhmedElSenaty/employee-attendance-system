import { useTranslation } from "react-i18next";
import { ActionCard, Button, Header } from "../../../components/ui";
import { ATTENDANCE_NS } from "../../../constants";
import { HasPermission } from "../../../components/auth";
import { FileDown } from "lucide-react";
import {
  useDebounce,
  useEmployeeRequestsSummaryReport,
  useEmployeeRequestsSummaryReportPDF,
  useExportAttendanceReport,
  useExportAttendanceReportPDF,
  useExportAttendanceSummaryReport,
  useExportAttendanceSummaryReportPDF,
  useExportReport,
  useExportReportPDF,
  useExportVacationSaverReport,
  useExportVacationSaverReportPDF,
} from "../../../hooks";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { useState } from "react";
import { ExportPopup } from "../../common/manage-attendance/views";
import { downloadFile, showToast } from "../../../utils";
import { NavLink } from "react-router";
import ExportRequestsPopup from "../../Manager/RequestsSummary/Views/ExportRequestsPopup";

const AllAdminReports = () => {
  const { t } = useTranslation("allReports");

  const [isDownloadingDetailedAttendance, setIsDownloadingDetailedAttendance] =
    useState(false);
  const [
    isDownloadingDetailedAttendancePDF,
    setIsDownloadingDetailedAttendancePDF,
  ] = useState(false);

  const [isDownloadingSummaryAttendance, setIsDownloadingSummaryAttendance] =
    useState(false);
  const [
    isDownloadingSummaryAttendancePDF,
    setIsDownloadingSummaryAttendancePDF,
  ] = useState(false);

  const [isDownloadingDetailedRequests, setIsDownloadingDetailedRequests] =
    useState(false);
  const [isDownloadingDetailedRequestsPDF, setIsDownloadingDetailedRquestsPDF] =
    useState(false);

  const [isDownloadingSummaryRequests, setIsDownloadingSummaryRequests] =
    useState(false);
  const [isDownloadingSummaryRequestsPDF, setIsDownloadingSummaryRequestsPDF] =
    useState(false);

  const [isDownloadingVacationSaver, setIsDownloadingVacationSaver] =
    useState(false);
  const [isDownloadingVacationSaverPDF, setIsDownloadingVacationSaverPDF] =
    useState(false);

  const { getParam, setParam, clearParams, setParams } = useURLSearchParams();
  const [isDownloadReportPopupOpen, setIsDownloadReportPopupOpen] =
    useState(false);
  const [
    isDownloadSummaryReportPopupOpen,
    setIsDownloadSummaryReportPopupOpen,
  ] = useState(false);

  const [
    isDownloadRequestsReportPopupOpen,
    setIsDownloadRequestsReportPopupOpen,
  ] = useState(false);

  const [isRequestsSummaryPopupOpen, setIsRequestsSummaryPopupOpen] =
    useState(false);

  const [isVacationSaverPopupOpen, setIsVacationSaverPopupOpen] =
    useState(false);

  const rawStartDate = getParam("startDate");
  const rawEndDate = getParam("endDate");
  const rawStartTime = getParam("startTime");
  const rawEndTime = getParam("endTime");
  const rawSearchKey = getParam("searchKey");
  const rawLeaveType = getParam("leaveType", Number);
  const rawSearchQuery = useDebounce(getParam("searchQuery"), 650);
  const rawStatus = getParam("status");
  const rawDepartmentId = getParam("searchByDepartmentId", Number);
  const rawSubDeptartmentId = getParam("searchBySubDeptartmentId", Number);
  const rawChecked = getParam("IncludeSubDepartments");
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
  const leaveType = rawLeaveType !== null ? rawLeaveType : undefined;

  const { refetchExportData } = useExportAttendanceReport(
    searchKey,
    searchQuery,
    startDate,
    endDate,
    startTime,
    endTime,
    status,
    checked,
    departmentId || 0,
    subDeptartmentId || 0
  );

  const { refetchExportDataPDF } = useExportAttendanceReportPDF(
    searchKey,
    searchQuery,
    startDate,
    endDate,
    startTime,
    endTime,
    status,
    checked,
    departmentId || 0,
    subDeptartmentId || 0
  );

  const { refetchExportData: refetchSummaryExportData } =
    useExportAttendanceSummaryReport(
      searchKey,
      searchQuery,
      startDate,
      endDate,
      startTime,
      endTime,
      status,
      checked,
      departmentId || 0,
      subDeptartmentId || 0
    );

  const { refetchExportDataPDF: refetchSummaryExportDataPDF } =
    useExportAttendanceSummaryReportPDF(
      searchKey,
      searchQuery,
      startDate,
      endDate,
      startTime,
      endTime,
      status,
      checked,
      departmentId || 0,
      subDeptartmentId || 0
    );

  const { refetchExportData: refetchDetailedRequestsExcel } = useExportReport(
    searchKey,
    searchQuery,
    startDate,
    endDate,
    status,
    leaveType,
    checked,
    departmentId || 0,
    subDeptartmentId || 0
  );

  const { refetchExportDataPDF: refetchDetailedRequestsPDF } =
    useExportReportPDF(
      searchKey,
      searchQuery,
      startDate,
      endDate,
      status,
      leaveType,
      checked,
      departmentId || 0,
      subDeptartmentId || 0
    );

  const { refetchExportData: refetchRequestsSummaryData } =
    useEmployeeRequestsSummaryReport(
      searchKey,
      searchQuery,
      startDate,
      endDate,
      status,
      leaveType,
      checked,
      departmentId || 0,
      subDeptartmentId || 0
    );

  const { refetchExportDataPDF: refetchRequestsSummaryDataPDF } =
    useEmployeeRequestsSummaryReportPDF(
      searchKey,
      searchQuery,
      startDate,
      endDate,
      status,
      leaveType,
      checked,
      departmentId || 0,
      subDeptartmentId || 0
    );

  const { refetchExportData: refetchExportVacationSaverData } =
    useExportVacationSaverReport(
      searchKey,
      searchQuery,
      startDate,
      endDate,
      checked,
      departmentId || 0,
      subDeptartmentId || 0
    );

  const { refetchExportDataPDF: refetchExportVacationSaverDataPDF } =
    useExportVacationSaverReportPDF(
      searchKey,
      searchQuery,
      startDate,
      endDate,
      checked,
      departmentId || 0,
      subDeptartmentId || 0
    );

  // detailed excel
  const handleDownload = async () => {
    setIsDownloadingDetailedAttendance(true);
    const { data, isSuccess, isError } = await refetchExportData();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
      setIsDownloadingDetailedAttendance(false);
    } else if (isError) {
      showToast("error", t("export.exportError"));
      setIsDownloadingDetailedAttendance(false);
    }
  };

  // detailed pdf
  const handleDownloadPDF = async () => {
    setIsDownloadingDetailedAttendancePDF(true);
    const { data, isSuccess, isError } = await refetchExportDataPDF();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
      setIsDownloadingDetailedAttendancePDF(false);
    } else if (isError) {
      showToast("error", t("export.exportError"));
      setIsDownloadingDetailedAttendancePDF(false);
    }
  };

  // summary excel
  const handleDownloadSummary = async () => {
    setIsDownloadingSummaryAttendance(true);
    const { data, isSuccess, isError } = await refetchSummaryExportData();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
      setIsDownloadingSummaryAttendance(false);
    } else if (isError) {
      showToast("error", t("export.exportError"));
      setIsDownloadingSummaryAttendance(false);
    }
  };

  // summary pdf
  const handleDownloadPDFSummary = async () => {
    setIsDownloadingSummaryAttendancePDF(true);
    const { data, isSuccess, isError } = await refetchSummaryExportDataPDF();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
      setIsDownloadingSummaryAttendancePDF(false);
    } else if (isError) {
      showToast("error", t("export.exportError"));
      setIsDownloadingSummaryAttendancePDF(false);
    }
  };

  // detailed requests excel
  const handleDownloadDetailedRequests = async () => {
    setIsDownloadingDetailedRequests(true);
    const { data, isSuccess, isError } = await refetchDetailedRequestsExcel();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
      setIsDownloadingDetailedRequests(false);
    } else if (isError) {
      showToast("error", t("export.exportError"));
      setIsDownloadingDetailedRequests(false);
    }
  };

  // detailed requests pdf
  const handleDownloadDetailedRequestsPDF = async () => {
    setIsDownloadingDetailedRquestsPDF(true);
    const { data, isSuccess, isError } = await refetchDetailedRequestsPDF();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
      setIsDownloadingDetailedRquestsPDF(false);
    } else if (isError) {
      showToast("error", t("export.exportError"));
      setIsDownloadingDetailedRquestsPDF(false);
    }
  };

  // summary requests excel
  const handleDownloadRequestsSummaryExcel = async () => {
    setIsDownloadingSummaryRequests(true);
    const { data, isSuccess, isError } = await refetchRequestsSummaryData();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
      setIsDownloadingSummaryRequests(false);
    } else if (isError) {
      showToast("error", t("export.exportError"));
      setIsDownloadingSummaryRequests(false);
    }
  };

  const handleDownloadRequestsSummaryPDF = async () => {
    setIsDownloadingSummaryRequestsPDF(true);
    const { data, isSuccess, isError } = await refetchRequestsSummaryDataPDF();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
      setIsDownloadingSummaryRequestsPDF(false);
    } else if (isError) {
      showToast("error", t("export.exportError"));
      setIsDownloadingSummaryRequestsPDF(false);
    }
  };

  const handleDownloadVacationSaver = async () => {
    setIsDownloadingVacationSaver(true);
    const { data, isSuccess, isError } = await refetchExportVacationSaverData();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
      setIsDownloadingVacationSaver(false);
    }
    if (isError) {
      showToast("error", t("export.exportError"));
      setIsDownloadingVacationSaver(false);
    }
  };

  const handleDownloadVacationSaverPDF = async () => {
    setIsDownloadingVacationSaverPDF(true);
    const { data, isSuccess, isError } =
      await refetchExportVacationSaverDataPDF();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
      setIsDownloadingVacationSaverPDF(false);
    }
    if (isError) {
      showToast("error", t("export.exportError"));
      setIsDownloadingVacationSaverPDF(false);
    }
  };

  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header
          heading="جميع التقارير"
          subtitle="يمكنك تصدير تقارير الحضور والانصراف وطلبات الإجازات بالتفصيل أو كملخص، بصيغ Excel أو PDF مع خيارات فلترة متقدمة"
        />
      </div>

      <div className="w-[1000px] max-xl:w-full grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto mb-20">
        {/* detailed attendance */}

        <div className="flex-1">
          <HasPermission
            permission={[
              "Export Attendance Report Excel",
              "Export Attendance Report PDF",
            ]}
          >
            <ActionCard
              icon={<FileDown />}
              iconBgColor="bg-[#f5e4b2]"
              iconColor="text-[#10b981]"
              title={t("detailedAttendance.heading")}
              description={t("detailedAttendance.subtitle")}
            >
              <Button
                fullWidth
                variant="secondary"
                isLoading={
                  isDownloadingDetailedAttendance ||
                  isDownloadingDetailedAttendancePDF
                }
                onClick={() => setIsDownloadReportPopupOpen(true)}
              >
                {t("exportActionCard.button")}
              </Button>
            </ActionCard>
            <p dir="rtl" className="text-sm text-gray-700 mt-2">
              {t("detailedAttendance.link")}{" "}
              <NavLink
                to="../manage-attendance"
                className="inline text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                {t("detailedAttendance.pageName")}{" "}
              </NavLink>
            </p>
          </HasPermission>
        </div>

        {/* summary attendnace */}
        <div className="flex-1">
          <HasPermission
            permission={[
              "Export Attendance Report Excel",
              "Export Attendance Report PDF",
            ]}
          >
            <ActionCard
              icon={<FileDown />}
              iconBgColor="bg-[#f5e4b2]"
              iconColor="text-[#10b981]"
              title={t("detailedAttendance.heading")}
              description={t("detailedAttendance.subtitle")}
            >
              <Button
                fullWidth
                variant="secondary"
                isLoading={
                  isDownloadingSummaryAttendance ||
                  isDownloadingSummaryAttendancePDF
                }
                onClick={() => setIsDownloadSummaryReportPopupOpen(true)}
              >
                {t("exportButton")}
              </Button>
            </ActionCard>
            <p dir="rtl" className="text-sm text-gray-700 mt-2">
              {t("detailedAttendance.link")}{" "}
              <NavLink
                to="../manage-attendance/overview"
                className="inline text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                {t("summaryAttendance.link")}{" "}
              </NavLink>
            </p>
          </HasPermission>
        </div>
      </div>

      {/* attendance detailed */}
      <ExportPopup
        isOpen={isDownloadReportPopupOpen}
        handleClose={() => setIsDownloadReportPopupOpen(false)}
        handleDownload={handleDownload}
        filteredData={{
          searchKey: searchKey || "",
          search: searchQuery || "",
          startDate: startDate || new Date().toISOString().slice(0, 10),
          endDate: endDate || new Date().toISOString().slice(0, 10),
          startTime: startTime || "",
          endTime: endTime || "",
          status: status || "",
          searchByDepartmentId: Number(departmentId || 0),
          searchBySubDeptartmentId: Number(subDeptartmentId || 0),
          checked: checked,
        }}
        isLoading={isDownloadingDetailedAttendance}
        isloadingPDF={isDownloadingDetailedAttendancePDF}
        handleDownloadPDF={handleDownloadPDF}
      />

      {/* attendance summary */}
      <ExportPopup
        isOpen={isDownloadSummaryReportPopupOpen}
        handleClose={() => setIsDownloadSummaryReportPopupOpen(false)}
        handleDownload={handleDownloadSummary}
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
        isLoading={isDownloadingSummaryAttendance}
        isloadingPDF={isDownloadingSummaryAttendancePDF}
        handleDownloadPDF={handleDownloadPDFSummary}
      />

      {/* requests detailed  */}
      <ExportRequestsPopup
        isOpen={isDownloadRequestsReportPopupOpen}
        handleClose={() => setIsDownloadRequestsReportPopupOpen(false)}
        handleDownload={handleDownloadDetailedRequests}
        handleDownloadPDF={handleDownloadDetailedRequestsPDF}
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
          status: status || "",
          type: leaveType,
          searchByDepartmentId: Number(departmentId || 0),
          searchBySubDeptartmentId: Number(subDeptartmentId || 0),
          checked: checked,
        }}
        isLoading={isDownloadingDetailedRequests}
        isloadingPDF={isDownloadingDetailedRequestsPDF}
      />

      {/* Requests Summary Export Popup */}
      <ExportRequestsPopup
        isOpen={isRequestsSummaryPopupOpen}
        handleClose={() => setIsRequestsSummaryPopupOpen(false)}
        handleDownload={handleDownloadRequestsSummaryExcel}
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
          status: status || "",
          type: leaveType,
          searchByDepartmentId: Number(departmentId || 0),
          searchBySubDeptartmentId: Number(subDeptartmentId || 0),
          checked: checked,
        }}
        isLoading={isDownloadingSummaryRequests}
        isloadingPDF={isDownloadingSummaryRequestsPDF}
        handleDownloadPDF={handleDownloadRequestsSummaryPDF}
      />
    </>
  );
};

export default AllAdminReports;
