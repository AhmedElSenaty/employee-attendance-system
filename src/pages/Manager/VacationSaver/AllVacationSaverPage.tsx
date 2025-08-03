import { useTranslation } from "react-i18next";
import {
  ActionCard,
  Button,
  Header,
  NoDataMessage,
  Paginator,
  Table,
  TableCell,
  TableRow,
  TableSkeleton,
} from "../../../components/ui";
import { useGetAllVacationSaver } from "../../../hooks/request.hook";
import { useLanguageStore } from "../../../store";
import { downloadFile, showToast } from "../../../utils";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import {
  useDebounce,
  useExportVacationSaverReport,
  useExportVacationSaverReportPDF,
} from "../../../hooks";
import { useState } from "react";
import { FileDown } from "lucide-react";
import { HasPermission } from "../../../components/auth";
import Filters from "./views/Filters";
import ExportRequestsPopup from "../RequestsSummary/Views/ExportRequestsPopup";

const AllVacationSaverPage = () => {
  const [isDownloadReportPopupOpen, setIsDownloadReportPopupOpen] =
    useState(false);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const { t } = useTranslation("vacationSaver");
  const { language } = useLanguageStore();
  const { getParam, setParam, clearParams } = useURLSearchParams();
  // Using the enhanced getParam with parser support from the improved hook
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

  const { requests, isLoading, metadata } = useGetAllVacationSaver(
    page,
    pageSize,
    startDate,
    endDate,
    searchKey,
    searchQuery
  );

  // Use the custom hook to fetch data
  const { refetchExportData } = useExportVacationSaverReport(
    searchKey,
    searchQuery,
    startDate,
    endDate,
    checked,
    departmentId || 0,
    subDeptartmentId || 0
  );

  const { refetchExportDataPDF } = useExportVacationSaverReportPDF(
    searchKey,
    searchQuery,
    startDate,
    endDate,
    checked,
    departmentId || 0,
    subDeptartmentId || 0
  );

  const REQUESTS_TABLE_COLUMNS = [
    "table.columns.employeeName",
    "table.columns.subDeptName",
    "table.columns.day",
    "table.columns.date",
    "table.columns.dayStatus",
  ];
  const columns = REQUESTS_TABLE_COLUMNS.map((key) => t(key));

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
        <Header heading={t("header.heading")} subtitle={t("header.subtitle")} />
        <div className="w-[500px] max-xl:w-full grid grid-cols-1 gap-10 mx-auto">
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
          <div className="flex flex-wrap gap-4">
            <Filters
              searchBy={metadata.searchBy}
              getParam={getParam}
              setParam={setParam}
              clearParams={clearParams}
            />
          </div>

          <div className="w-full overflow-x-auto">
            {isLoading ? (
              <TableSkeleton
                numberOfColumns={columns.length}
                defaultNumberOfRows={5}
              />
            ) : (
              <Table columns={columns}>
                {requests.length === 0 ? (
                  <NoDataMessage
                    title={t("table.emptyTable.title")}
                    message={t("table.emptyTable.message")}
                  />
                ) : (
                  requests.map((request) => (
                    <TableRow key={request.id} className="border-b">
                      <TableCell label={columns[0]}>
                        {request.employeeName}
                      </TableCell>

                      <TableCell label={columns[1]}>
                        {request.subDeptName}
                      </TableCell>

                      <TableCell label={columns[2]}>{request.day}</TableCell>

                      <TableCell label={columns[2]}>
                        {new Date(request.date).toLocaleDateString(language)}
                      </TableCell>

                      <TableCell label={columns[1]}>
                        {request.dayStatus}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </Table>
            )}
          </div>
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isLoading}
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

export default AllVacationSaverPage;
