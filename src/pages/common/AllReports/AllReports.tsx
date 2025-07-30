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
} from "../../../hooks";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { useState } from "react";
import { ExportPopup } from "../manage-attendance/views";
import { downloadFile, showToast } from "../../../utils";
import { NavLink } from "react-router";
import ExportRequestsPopup from "../../Manager/RequestsSummary/Views/ExportRequestsPopup";

const AllReports = () => {
  const { t } = useTranslation([ATTENDANCE_NS]);
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
      subDeptartmentId || 0
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
    subDeptartmentId || 0
  );

  const {
    refetchExportData: refetchSummaryExportData,
    isLoading: isExportSummaryDataLoading,
  } = useExportAttendanceSummaryReport(
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

  const {
    isLoadingPDF: isLoadingSummaryPDF,
    refetchExportDataPDF: refetchSummaryExportDataPDF,
  } = useExportAttendanceSummaryReportPDF(
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

  const {
    refetchExportData: refetchDetailedRequestsExcel,
    isLoading: isLoadingDetailedExcel,
  } = useExportReport(
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

  const {
    refetchExportDataPDF: refetchDetailedRequestsPDF,
    isLoadingPDF: isLoadingDetailedPDF,
  } = useExportReportPDF(
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

  const {
    refetchExportData: refetchRequestsSummaryData,
    isLoading: isRequestsSummaryExcelLoading,
  } = useEmployeeRequestsSummaryReport(
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

  const {
    isLoadingPDF: isRequestsSummaryPdfLoading,
    refetchExportDataPDF: refetchRequestsSummaryDataPDF,
  } = useEmployeeRequestsSummaryReportPDF(
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

  // detailed excel
  const handleDownload = async () => {
    const { data, isSuccess, isError } = await refetchExportData();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
    } else if (isError) {
      showToast("error", t("export.exportError"));
    }
  };

  // detailed pdf
  const handleDownloadPDF = async () => {
    const { data, isSuccess, isError } = await refetchExportDataPDF();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
    } else if (isError) {
      showToast("error", t("export.exportError"));
    }
  };

  // summary excel
  const handleDownloadSummary = async () => {
    const { data, isSuccess, isError } = await refetchSummaryExportData();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
    } else if (isError) {
      showToast("error", t("export.exportError"));
    }
  };

  // summary pdf
  const handleDownloadPDFSummary = async () => {
    const { data, isSuccess, isError } = await refetchSummaryExportDataPDF();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
    } else if (isError) {
      showToast("error", t("export.exportError"));
    }
  };

  const handleDownloadDetailedRequests = async () => {
    const { data, isSuccess, isError } = await refetchDetailedRequestsExcel();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
    } else if (isError) {
      showToast("error", t("export.exportError"));
    }
  };
  const handleDownloadDetailedRequestsPDF = async () => {
    const { data, isSuccess, isError } = await refetchDetailedRequestsPDF();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
    } else if (isError) {
      showToast("error", t("export.exportError"));
    }
  };

  const handleDownloadRequestsSummaryExcel = async () => {
    const { data, isSuccess, isError } = await refetchRequestsSummaryData();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
    } else if (isError) {
      showToast("error", t("export.exportError"));
    }
  };

  const handleDownloadRequestsSummaryPDF = async () => {
    const { data, isSuccess, isError } = await refetchRequestsSummaryDataPDF();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
    } else if (isError) {
      showToast("error", t("export.exportError"));
    }
  };

  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header heading={t("header.heading")} subtitle={t("header.subtitle")} />
      </div>

      <div className="w-[1000px] max-xl:w-full grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto mb-20">
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
                onClick={() => setIsDownloadReportPopupOpen(true)}
              >
                {t("exportActionCard.button")}
              </Button>
            </ActionCard>
            <p dir="rtl" className="text-sm text-gray-700 mt-2">
              لمزيد من خيارات الفلترة، يمكنك زيارة{" "}
              <NavLink
                to="/manager/manage-attendance"
                className="inline text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                صفحة الحضور التفصيلية
              </NavLink>
            </p>
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
                isLoading={isLoadingSummaryPDF || isExportSummaryDataLoading}
                onClick={() => setIsDownloadSummaryReportPopupOpen(true)}
              >
                {t("exportActionCard.button")}
              </Button>
            </ActionCard>
            <p dir="rtl" className="text-sm text-gray-700 mt-2">
              لمزيد من خيارات الفلترة، يمكنك زيارة{" "}
              <NavLink
                to="../manage-attendance/overview"
                className="inline text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                صفحة الحضور التفصيلية
              </NavLink>
            </p>
          </HasPermission>
        </div>

        <div className="flex-1">
          <HasPermission
            permission={[
              "Export Requests Report Excel",
              "Export Requests Report PDF",
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
                isLoading={isLoadingDetailedExcel}
                onClick={() => {
                  setIsDownloadRequestsReportPopupOpen(true);
                }}
              >
                {t("exportActionCard.button")}
              </Button>
            </ActionCard>
            <p dir="rtl" className="text-sm text-gray-700 mt-2">
              لمزيد من خيارات الفلترة، يمكنك زيارة{" "}
              <NavLink
                to="../manage-attendance/overview"
                className="inline text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                صفحة الحضور التفصيلية
              </NavLink>
            </p>
          </HasPermission>
        </div>

        <div className="flex-1">
          {/* Requests Summary Export Button */}
          <HasPermission
            permission={[
              "Export Requests Report PDF",
              "Export Requests Report Excel",
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
                isLoading={isRequestsSummaryExcelLoading}
                onClick={() => setIsRequestsSummaryPopupOpen(true)}
              >
                {t("exportActionCard.button")}
              </Button>
            </ActionCard>
            <p dir="rtl" className="text-sm text-gray-700 mt-2">
              لمزيد من خيارات الفلترة، يمكنك زيارة{" "}
              <NavLink
                to="../requestsSummary"
                className="inline text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                صفحة الحضور التفصيلية
              </NavLink>
            </p>
          </HasPermission>
        </div>
      </div>

      {/* attendance  detailed */}
      <ExportPopup
        isOpen={isDownloadReportPopupOpen}
        handleClose={() => setIsDownloadReportPopupOpen(false)}
        handleDownload={handleDownload}
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
        isLoading={isExportSummaryDataLoading}
        isloadingPDF={isLoadingSummaryPDF}
        handleDownloadPDF={handleDownloadPDFSummary}
      />

      {/* requests detailed  */}
      <ExportPopup
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
        isLoading={isLoadingDetailedExcel}
        isloadingPDF={isLoadingDetailedPDF}
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
        isLoading={isRequestsSummaryExcelLoading}
        isloadingPDF={isRequestsSummaryPdfLoading}
        handleDownloadPDF={handleDownloadRequestsSummaryPDF}
      />
    </>
  );
};

export default AllReports;
