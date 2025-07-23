import { useTranslation } from "react-i18next";
import {
  Header,
  NoDataMessage,
  Paginator,
  StatusBadge,
  Table,
  TableCell,
  TableRow,
  TableSkeleton,
} from "../../../components/ui";
import { useGetAllSubDepartmentRequests } from "../../../hooks/request.hook";
import { useLanguageStore } from "../../../store";
import { getRequestStatusVariant } from "../../../utils";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { useDebounce } from "../../../hooks";
import Filters from "./View/Filters";

const AllSubDepartmentRequests = () => {
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

  // Use nullish coalescing to default numeric values, undefined for dates if empty
  const page = rawPage ?? 1;
  const pageSize = rawPageSize ?? 10;
  const startDate = rawStartDate || undefined;
  const endDate = rawEndDate || undefined;
  const status = rawStatus !== null ? rawStatus : undefined;
  const leaveType = rawLeaveType !== null ? rawLeaveType : undefined;
  const searchKey = rawSearchKey || undefined;
  const searchQuery = rawSearchQuery || undefined;

  const { requests, isLoading, metadata } = useGetAllSubDepartmentRequests(
    page,
    pageSize,
    startDate,
    endDate,
    status,
    leaveType,
    searchKey,
    searchQuery
  );

  const REQUESTS_TABLE_COLUMNS = [
    // "table.columns.id",
    "table.columns.employeeName",
    "table.columns.startDate",
    "table.columns.endDate",
    "table.columns.requestType",
    "table.columns.requestStatus",
    "table.columns.requestAt",
    "table.columns.description",
    "table.columns.comment",
    "table.columns.subDepartment",
  ];
  const columns = REQUESTS_TABLE_COLUMNS.map((key) => t(key));

  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header heading={t("header.heading")} subtitle={t("header.subtitle")} />
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
                      {/* <TableCell
                       label={columns[0]}>{request?.id}
                       </TableCell> */}

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
                        {t(`leaveType.${request.type}`)}
                      </TableCell>

                      <TableCell label={columns[4]}>
                        <StatusBadge
                          variant={getRequestStatusVariant(request.status)}
                          size="medium"
                          shape="rounded"
                        >
                          {t(`status.${request.status}`)}
                        </StatusBadge>
                      </TableCell>

                      <TableCell label={columns[5]}>
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
                      <TableCell label={columns[6]}>
                        {request.description}
                      </TableCell>
                      <TableCell label={columns[7]}>
                        {request.comment}
                      </TableCell>
                      <TableCell label={columns[8]}>
                        {request.subDepartment}
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
    </>
  );
};
export default AllSubDepartmentRequests;
