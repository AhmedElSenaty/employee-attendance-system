import {
  Header,
  SectionHeader,
  Paginator,
  InfoPopup,
  ActionCard,
  Button,
} from "../../../components/ui/";
import { useTranslation } from "react-i18next";

import {
  useDebounce,
  useExportWorkOvertimeReportExcel,
  useExportWorkOvertimeReportPDF,
} from "../../../hooks/";
import { ENTITY_VIDEO } from "../../../constants";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";

import OverTimeWorkTable from "./views/OverTimeWorkTable";
import { useGetAllWorkOvertime } from "../../../hooks/request.hook";
import OverTimeFilter from "./views/OverTimeFilter";
import { HasPermission } from "../../../components/auth";
import { FileDown } from "lucide-react";
import { useState } from "react";
import { downloadFile, showToast } from "../../../utils";
import ExportRequestsPopup from "../../Manager/RequestsSummary/Views/ExportRequestsPopup";

const ManageWorkoverTimePage = () => {
  const { t } = useTranslation("workOvertime");

  const { getParam, setParam, clearParams } = useURLSearchParams();

  const rawPage = getParam("page", Number);
  const rawPageSize = getParam("pageSize", Number);
  const rawSearchKey = getParam("searchKey");
  const rawSearchQuery = useDebounce(getParam("searchQuery"), 650);
  const rawDepartmentId = getParam("searchByDepartmentId", Number);
  const rawSubDeptartmentId = getParam("searchBySubDeptartmentId", Number);
  const rawChecked = getParam("IncludeSubDepartments");
  const rawStartDate = getParam("startDate");
  const rawEndDate = getParam("endDate");

  // Use nullish coalescing to default numeric values, undefined for dates if empty
  const page = rawPage ?? 1;
  const pageSize = rawPageSize ?? 10;
  const searchKey = rawSearchKey || undefined;
  const searchQuery = rawSearchQuery || undefined;
  const departmentId = rawDepartmentId || "";
  const checked = rawChecked || false;
  const subDeptartmentId = rawSubDeptartmentId || "";
  const startDate = rawStartDate || undefined;
  const endDate = rawEndDate || undefined;

  const {
    requests,
    metadata,
    isLoading: isEntitiesDataLoading,
  } = useGetAllWorkOvertime(
    page,
    pageSize,
    startDate,
    endDate,
    searchKey,
    searchQuery
  );

  // =============== excel =====================
  const [isDownloadingWorkOvertimeReport, setIsDownloadingWorkOvertimeReport] =
    useState(false);

  const { refetchExportData: WorkovertimeReport } =
    useExportWorkOvertimeReportExcel(
      searchKey,
      searchQuery,
      startDate,
      endDate,
      checked,
      departmentId || 0,
      subDeptartmentId || 0
    );

  const handleDownload = async () => {
    setIsDownloadingWorkOvertimeReport(true);
    const { data, isSuccess, isError } = await WorkovertimeReport();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
      setIsDownloadingWorkOvertimeReport(false);
    }
    if (isError) {
      showToast("error", t("export.exportError"));
      setIsDownloadingWorkOvertimeReport(false);
    }
  };

  // =============== pdf =====================
  const [
    isDownloadingWorkOvertimeReportPDF,
    setIsDownloadingWorkOvertimeReportPDF,
  ] = useState(false);

  const [
    isWorkOvertimeReportDownloadReportPopupOpen,
    setWorkOvertimeReportIsDownloadReportPopupOpen,
  ] = useState(false);

  const { refetchExportDataPDF: workOvertimeReportPDF } =
    useExportWorkOvertimeReportPDF(
      searchKey,
      searchQuery,
      startDate,
      endDate,
      checked,
      departmentId || 0,
      subDeptartmentId || 0
    );

  const handleDownloadPDF = async () => {
    setWorkOvertimeReportIsDownloadReportPopupOpen(true);
    const { data, isSuccess, isError } = await workOvertimeReportPDF();
    if (isSuccess) {
      showToast("success", t("export.exportSuccess"));
      downloadFile(data.file);
      setWorkOvertimeReportIsDownloadReportPopupOpen(false);
    }
    if (isError) {
      showToast("error", t("export.exportError"));
      setWorkOvertimeReportIsDownloadReportPopupOpen(false);
    }
  };

  // const handleAbsenceFromWorkReportDownload = async () => {
  //   setIsDownloadingAbsenceFromWorkReport(true);
  //   const { data, isSuccess, isError } = await AbsenceFromWorkReport();
  //   if (isSuccess) {
  //     showToast("success", t("export.exportSuccess"));
  //     downloadFile(data.file);
  //     setIsDownloadingAbsenceFromWorkReport(false);
  //   }
  //   if (isError) {
  //     showToast("error", t("export.exportError"));
  //     setIsDownloadingAbsenceFromWorkReport(false);
  //   }
  // };

  // const handleDownloadAbsenceFromWorkReportPDF = async () => {
  //   setIsDownloadingAbsenceFromWorkReportPDF(true);
  //   const { data, isSuccess, isError } = await AbsenceFromWorkReportPDF();
  //   if (isSuccess) {
  //     showToast("success", t("export.exportSuccess"));
  //     downloadFile(data.file);
  //     setIsDownloadingAbsenceFromWorkReportPDF(false);
  //   }
  //   if (isError) {
  //     showToast("error", t("export.exportError"));
  //     setIsDownloadingAbsenceFromWorkReportPDF(false);
  //   }
  // };

  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header heading={t("header.heading")} subtitle={t("header.subtitle")} />

        <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="w-full flex items-center justify-center">
            <InfoPopup
              title={t("infoPopup.title")}
              description={t("infoPopup.description")}
              videoUrl={ENTITY_VIDEO}
            />
          </div>
        </div>
        <div className="w-[1000px] max-xl:w-full grid grid-cols-1 md:grid-cols-2 gap-10 mx-auto">
          <div className="flex-1">
            <HasPermission
              permission={[
                "Export Overtime report Excel",
                "Export Overtime report PDF",
              ]}
            >
              <ActionCard
                icon={<FileDown />}
                iconBgColor="bg-[#f5e4b2]"
                iconColor="text-[#10b981]"
                title={t("exportActionCard.title")}
                description={t("exportActionCard.description")}
              >
                <Button
                  fullWidth
                  variant="secondary"
                  isLoading={
                    isDownloadingWorkOvertimeReportPDF ||
                    isDownloadingWorkOvertimeReport
                  }
                  onClick={() => {
                    setWorkOvertimeReportIsDownloadReportPopupOpen(true);
                  }}
                >
                  {t("exportActionCard.button")}
                </Button>
              </ActionCard>
            </HasPermission>
          </div>
        </div>
        {/* Right Column: Filters & Table */}
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader
            title={t("sectionsHeader.entitiesList.title")}
            description={t("sectionsHeader.entitiesList.description")}
          />

          {/* Filters */}
          <OverTimeFilter
            searchBy={metadata.searchBy}
            getParam={getParam}
            setParam={setParam}
            clearParams={clearParams}
          />

          <OverTimeWorkTable
            requests={requests}
            isLoading={isEntitiesDataLoading}
          />

          {/* Pagination Component */}
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isEntitiesDataLoading}
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

      <ExportRequestsPopup
        isOpen={isWorkOvertimeReportDownloadReportPopupOpen}
        handleClose={() =>
          setWorkOvertimeReportIsDownloadReportPopupOpen(false)
        }
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

          searchByDepartmentId: Number(departmentId || 0),
          searchBySubDeptartmentId: Number(subDeptartmentId || 0),
          checked: checked,
        }}
        isLoading={isDownloadingWorkOvertimeReport}
        isloadingPDF={isDownloadingWorkOvertimeReportPDF}
        handleDownloadPDF={handleDownloadPDF}
      />
    </>
  );
};

export default ManageWorkoverTimePage;
