import { useTranslation } from "react-i18next";
import {
  ActionCard,
  Button,
  Header,
  NoDataMessage,
  Paginator,
  StatusBadge,
  Table,
  TableCell,
  TableRow,
  TableSkeleton,
  Tooltip,
} from "../../../components/ui";
import {
  useGetAllGenaricRequests,
  useSoftDeleteRequest,
} from "../../../hooks/request.hook";
import { useLanguageStore } from "../../../store";
import {
  downloadFile,
  getRequestStatusVariant,
  showToast,
} from "../../../utils";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import Filters from "./views/Filters";
import {
  useDebounce,
  useEmployeeRequestsSummaryReport,
  useEmployeeRequestsSummaryReportPDF,
} from "../../../hooks";
import { FileDown, FilePenLine, Trash } from "lucide-react";
import DeletePopup from "./views/DeletePopup";
import { ISoftDeleteRequestCredentials } from "../../../interfaces/request.interfaces";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ExportPopup } from "../../common/manage-attendance/views";
import AssignGenericPopup from "./views/AssignGenericInputs";

const GenaricRequestsPage = () => {
  const [isAssignGenericPopupOpen, setIsAssignGenericPopupOpen] =
    useState(false);
  const [isDownloadReportPopupOpen, setIsDownloadReportPopupOpen] =
    useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedID, setSelectedID] = useState<number>(0);
  const { t } = useTranslation("requests");
  const { language } = useLanguageStore();
  const { getParam, setParam, clearParams } = useURLSearchParams();
  // Using the enhanced getParam with parser support from the improved hook
  const rawPage = getParam("page", Number);
  const rawPageSize = getParam("pageSize", Number);
  const rawStartDate = getParam("startDate");
  const rawEndDate = getParam("endDate");
  const rawStatus = getParam("status", Number);
  const rawLeaveType = getParam("leaveType", Number);
  const rawSearchKey = getParam("searchKey");
  const rawSearchQuery = useDebounce(getParam("searchQuery"), 650);
  const rawDepartmentId = getParam("searchByDepartmentId", Number);
  const rawSubDeptartmentId = getParam("searchBySubDeptartmentId", Number);
  const rawChecked = getParam("IncludeSubDepartments");

  // Use nullish coalescing to default numeric values, undefined for dates if empty
  const page = rawPage ?? 1;
  const pageSize = rawPageSize ?? 10;
  const startDate = rawStartDate || undefined;
  const endDate = rawEndDate || undefined;
  const status = rawStatus !== null ? rawStatus : undefined;
  const leaveType = rawLeaveType !== null ? rawLeaveType : undefined;
  const searchKey = rawSearchKey || undefined;
  const searchQuery = rawSearchQuery || undefined;
  const departmentId = rawDepartmentId || "";
  const checked = rawChecked || false;
  const subDeptartmentId = rawSubDeptartmentId || "";

  const { requests, isLoading, metadata } = useGetAllGenaricRequests(
    page,
    pageSize,
    startDate,
    endDate,
    searchKey,
    searchQuery
  );

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

  const REQUESTS_TABLE_COLUMNS = [
    "table.columns.employeeName",
    "table.columns.startDate",
    "table.columns.endDate",
    "table.columns.requestStatus",
    "table.columns.requestAt",
    "table.columns.description",
    "table.columns.comment",
    "table.columns.subDepartment",
    "table.columns.actions",
  ];
  const columns = REQUESTS_TABLE_COLUMNS.map((key) => t(key));
  const { mutate: deleteRequest, isPending: isDeleting } =
    useSoftDeleteRequest();
  // const [isEditOpen, setIsEditOpen] = useState(false);
  const {
    register: registerDelete,
    handleSubmit: handleSubmitDelete,
    reset: restDelete,
    formState: { errors: deleteErrors },
  } = useForm<ISoftDeleteRequestCredentials>();

  const handleConfirmDelete = handleSubmitDelete(
    (request: ISoftDeleteRequestCredentials) => {
      request.requestId = selectedID;
      deleteRequest(request);
      setIsDeletePopupOpen(false);
    }
  );

  // const handleEditopupOpen = (id: number) => {
  //   setSelectedID(id);
  //   setIsEditOpen(true);
  // };

  // Use the custom hook to fetch data
  const { refetchExportData, isLoading: isExportDataLoading } =
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
  const { isLoadingPDF, refetchExportDataPDF } =
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
        {/* <div className="w-[500px] max-xl:w-full grid grid-cols-1 gap-10 mx-auto">
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
        </div> */}
        <ActionCard
          icon={<FileDown />}
          iconBgColor="bg-[#f5e4b2]"
          iconColor="text-[#b38e19]"
          title={t("assignActionCard.title")}
          description={t("assignActionCard.description")}
        >
          <Button
            fullWidth
            variant="secondary"
            onClick={() => {
              setIsAssignGenericPopupOpen(true);
            }}
          >
            {t("exportActionCard.button")}
          </Button>
        </ActionCard>
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
                        {new Date(request.startDate).toLocaleDateString(
                          language
                        )}
                      </TableCell>

                      <TableCell label={columns[2]}>
                        {new Date(request.endDate).toLocaleDateString(language)}
                      </TableCell>

                      <TableCell label={columns[3]}>
                        <StatusBadge
                          variant={getRequestStatusVariant(request.status)}
                          size="medium"
                          shape="rounded"
                        >
                          {t(`status.${request.status}`)}
                        </StatusBadge>
                      </TableCell>

                      <TableCell label={columns[4]}>
                        {new Date(request.requestedAt).toLocaleString(
                          language === "ar" ? "ar-EG" : "en-CA",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </TableCell>
                      <TableCell label={columns[4]}>
                        {request.description}
                      </TableCell>
                      <TableCell label={columns[5]}>
                        {request.comment}
                      </TableCell>
                      <TableCell label={columns[6]}>
                        {request.subDepartment}
                      </TableCell>
                      <TableCell label={columns[7]}>
                        <div className="flex flex-wrap gap-2">
                          <Tooltip content={t("table.buttons.toolTipDelete")}>
                            <Button
                              variant="error"
                              fullWidth={false}
                              size={"sm"}
                              icon={<Trash className="w-full h-full" />}
                              onClick={() => handleDeletePopupOpen(request.id)}
                            />
                          </Tooltip>
                          <Button
                            variant="info"
                            fullWidth={false}
                            size={"sm"}
                            icon={<FilePenLine className="w-full h-full" />}
                            onClick={() => handleEdit(request.id)}
                          />
                        </div>
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
      <DeletePopup
        register={registerDelete}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        isOpen={isDeletePopupOpen}
        handleClose={handleDeletePopupClose}
        errors={deleteErrors} // ✅ Add this line
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

          status: status || "",
          type: leaveType,
          searchByDepartmentId: Number(departmentId || 0),
          searchBySubDeptartmentId: Number(subDeptartmentId || 0),
          checked: checked,
        }}
        isLoading={isExportDataLoading}
        isloadingPDF={isLoadingPDF}
        handleDownloadPDF={handleDownloadPDF}
      />
      <AssignGenericPopup
        isOpen={isAssignGenericPopupOpen}
        handleClose={() => {
          setIsAssignGenericPopupOpen(false);
        }}
      />
    </>
  );
};

export default GenaricRequestsPage;
