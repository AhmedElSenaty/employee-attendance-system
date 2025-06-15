import { Eye, X, Check } from "lucide-react";
import {
  Button,
  NoDataMessage,
  StatusBadge,
  Table,
  TableCell,
  TableRow,
  TableSkeleton,
  Tooltip,
} from "../../../../components/ui";
import { ILeaveRequestData } from "../../../../interfaces/";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../../store/";
import { formatValue, getRequestStatusVariant } from "../../../../utils";
import { RequestStatusType } from "../../../../enums";
import { LEAVE_REQUESTS_NS } from "../../../../constants";

interface ITableProps {
  leaveRequests: ILeaveRequestData[];
  isLoading: boolean;
  handleShow: (id: number) => void;
  handleAccept: (id: number) => void;
  handleReject: (id: number) => void;
}

const LeaveRequestsTable = ({
  leaveRequests,
  isLoading,
  handleShow,
  handleAccept,
  handleReject,
}: ITableProps) => {
  const { t } = useTranslation(LEAVE_REQUESTS_NS);
  const { language } = useLanguageStore();
  const LEAVE_REQUESTS_TABLE_COLUMNS = [
    "table.columns.id",
    "table.columns.employeeName",
    "table.columns.date",
    "table.columns.requestedAt",
    "table.columns.type",
    "table.columns.status",
    "table.columns.actions",
  ]
  const columns = LEAVE_REQUESTS_TABLE_COLUMNS.map((key) => t(key));

  return (
    <>
      {isLoading ? (
        <TableSkeleton
          numberOfColumns={columns.length}
          defaultNumberOfRows={5}
        />
      ) : (
        <Table columns={columns}>
          {leaveRequests.length == 0 ? (
            <NoDataMessage
              title={t("table.emptyTable.title")}
              message={t("table.emptyTable.message")}
            />
          ) : (
            leaveRequests.map((leaveRequest) => (
              <TableRow key={leaveRequest.id} className="border-b">
                <TableCell label={columns[0]}>
                  {formatValue(leaveRequest?.id || 0, language)}
                </TableCell>
                <TableCell label={columns[1]}>
                  {leaveRequest.employeeName}
                </TableCell>
                <TableCell label={columns[2]}>
                  {new Date(leaveRequest.date || "").toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-CA"
                  )}
                </TableCell>
                <TableCell label={columns[3]}>
                  {new Date(leaveRequest.requestedAt || "").toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-CA"
                  )}
                </TableCell>
                <TableCell label={columns[4]}>
                  {t(`timeType.${leaveRequest?.type as number}`)}
                </TableCell>
                <TableCell label={columns[5]}>
                  <StatusBadge
                    variant={getRequestStatusVariant(leaveRequest.status)}
                    size="medium"
                    shape="rounded"
                  >
                    {t(`status.${leaveRequest.status as number}`)}
                  </StatusBadge>
                </TableCell>
                <TableCell label={columns[6]}>
                  <div className="flex flex-wrap gap-2">
                    <Tooltip content={t("table.buttons.toolTipShow")}>
                      <Button
                        variant="primary"
                        fullWidth={false}
                        size={"sm"}
                        icon={<Eye className="w-full h-full" />}
                        onClick={() => handleShow(leaveRequest.id)}
                      />
                    </Tooltip>
                    {leaveRequest.status == RequestStatusType.Pending && (
                      <>
                        <Tooltip content={t("table.buttons.toolTipAccept")}>
                          <Button
                            variant="success"
                            fullWidth={false}
                            size={"sm"}
                            icon={<Check className="w-full h-full" />}
                            onClick={() =>
                              handleAccept(leaveRequest.id)
                            }
                          />
                        </Tooltip>
                        <Tooltip content={t("table.buttons.toolTipReject")}>
                          <Button
                            variant="danger"
                            fullWidth={false}
                            size={"sm"}
                            icon={<X className="w-full h-full" />}
                            onClick={() =>
                              handleReject(leaveRequest.id)
                            }
                          />
                        </Tooltip>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </Table>
      )}
    </>
  );
};

export default LeaveRequestsTable;
