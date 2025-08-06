import { useTranslation } from "react-i18next";
import { CalendarSearch, FileDown } from "lucide-react";
import { downloadFile, formatValue, showToast } from "../../../utils";
import { useDebounce } from "../../../hooks/debounce.hook";
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
  useExportAttendanceSummaryReport,
  useExportAttendanceSummaryReportPDF,
  useGetAttendanceSummary,
} from "../../../hooks/";
import { ATTENDANCE_NS, ATTENDANCE_OVERVIEW_VIDEO } from "../../../constants";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { ExportPopup, OverviewTable, VacationTableFilters } from "./views";
import { useState } from "react";
import { HasPermission } from "../../../components/auth";

const AttendanceOverviewPage = () => {
  const { t } = useTranslation([ATTENDANCE_NS]);
  const { language } = useLanguageStore();
  const { getParam, setParam, clearParams } = useURLSearchParams();
  const [isDownloadReportPopupOpen, setIsDownloadReportPopupOpen] =
    useState(false);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

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
  const rawDepartmentId = getParam("SearchByDeptartmentID", Number);
  const rawSubDeptartmentId = getParam("SearchBySubDeptartmentId", Number);
  const rawChecked = getParam("IncludeSubDepartments");

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

  const {
    attendanceSummary,
    count: totalAttendanceSummary,
    metadata,
    isLoading: isAttendanceSummaryLoading,
  } = useGetAttendanceSummary(
    page,
    pageSize,
    searchKey,
    searchQuery,
    startDate,
    endDate,
    departmentId || 0,
    subDeptartmentId || 0
  );

  // Use the custom hook to fetch data
  const { refetchExportData } = useExportAttendanceSummaryReport(
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
  const { refetchExportDataPDF } = useExportAttendanceSummaryReportPDF(
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

  const handleDownload = async () => {
    setIsDownloading(true);
    const { data, isSuccess, isError } = await refetchExportData();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
      setIsDownloading(false);
    }
    if (isError) {
      showToast("error", t("export.exportError"));
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    const { data, isSuccess, isError } = await refetchExportDataPDF();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
      setIsDownloadingPDF(false);
    }
    if (isError) {
      showToast("error", t("export.exportError"));
      setIsDownloadingPDF(false);
    }
  };

  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header
          heading={t("headerSummary.heading")}
          subtitle={t("headerSummary.subtitle")}
        />
        <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="w-full flex items-center justify-center">
            <InfoPopup
              title={t("infoPopupSummary.title")}
              description={t("infoPopupSummary.description")}
              videoUrl={ATTENDANCE_OVERVIEW_VIDEO}
            />
          </div>
          <CountCard
            title={t("CountCardSummary.title")}
            description={t("CountCardSummary.description")}
            count={formatValue(totalAttendanceSummary, language)}
            icon={<CalendarSearch size={28} />}
            bgColor="bg-[#b38e19]"
          />
          {/* ActionCard */}
        </div>
        <div className="w-[500px] max-xl:w-full grid grid-cols-1 gap-10 mx-auto">
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
                isLoading={isDownloading || isDownloadingPDF}
                onClick={() => {
                  setIsDownloadReportPopupOpen(true);
                }}
              >
                {t("exportActionCard.button")}
              </Button>
            </ActionCard>
          </HasPermission>
        </div>
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader
            title={t("sectionHeaderSummary.title")}
            description={t("sectionHeaderSummary.description")}
          />

          <div className="flex flex-col gap-5">
            <VacationTableFilters
              searchBy={metadata.searchBy}
              getParam={getParam}
              setParam={setParam}
              clearParams={clearParams}
            />
          </div>
          <div className="w-full overflow-x-auto">
            <OverviewTable
              attendance={attendanceSummary}
              isLoading={isAttendanceSummaryLoading}
            />
          </div>

          {/* Pagination Component */}
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isAttendanceSummaryLoading}
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
        isLoading={isDownloading}
        isloadingPDF={isDownloadingPDF}
        handleDownloadPDF={handleDownloadPDF}
      />
    </>
  );
};

export default AttendanceOverviewPage;
