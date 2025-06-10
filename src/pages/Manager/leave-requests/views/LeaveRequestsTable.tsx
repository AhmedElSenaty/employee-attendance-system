import { useMemo } from "react";
import { Eye, X, Check } from "lucide-react";
import { Button, NoDataMessage, StatusBadge, Table, TableCell, TableRow, TableSkeleton, Tooltip } from "../../../../components/ui";
import { ILeaveRequestData } from "../../../../interfaces/leaveRequest.interfaces";
import { LEAVE_REQUESTS_TABLE_COLUMNS, TRANSLATION_NAMESPACE } from "..";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../../store/language.store";
import { formatValue } from "../../../../utils";
import { LeaveRequestStatusType } from "../../../../enums";
import { VariantProps } from "class-variance-authority";

interface ITableProps {
  leaveRequests: ILeaveRequestData[];
  isLoading: boolean;
  handleShowLeaveRequests: (id: number) => void;
  handleAcceptLeaveRequests: (id: number) => void;
  handleRejectLeaveRequests: (id: number) => void;
}

const LeaveRequestsTable = ({ leaveRequests, isLoading, handleShowLeaveRequests, handleAcceptLeaveRequests, handleRejectLeaveRequests }: ITableProps) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);
  const { language } = useLanguageStore();

  const columns = useMemo(
    () => LEAVE_REQUESTS_TABLE_COLUMNS.map(key => t(key)),
    [t]
  );
  const getStatusVariant = (
    status: LeaveRequestStatusType
  ): VariantProps<typeof StatusBadge>["variant"] => {
    switch (status) {
      case LeaveRequestStatusType.Accepted:
        return "success";
      case LeaveRequestStatusType.Rejected:
        return "error";
      case LeaveRequestStatusType.Ignored:
        return "neutral";
      case LeaveRequestStatusType.Pending:
      default:
        return "warning";
    }
  };

  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {leaveRequests.length == 0 ? (
            <NoDataMessage title={t("table.emptyTable.title")} message={t("table.emptyTable.message")} />
          ) : (
            leaveRequests.map((leaveRequest) => (
              <TableRow key={leaveRequest.id} className="border-b">
                <TableCell label={columns[0]}>{formatValue(leaveRequest?.id || 0, language)}</TableCell>
                <TableCell label={columns[1]}>{leaveRequest.employeeName}</TableCell>
                <TableCell label={columns[2]}>{new Date(leaveRequest.date || "").toLocaleDateString(language === "ar" ? "ar-EG" : "en-CA")}</TableCell>
                <TableCell label={columns[3]}>{new Date(leaveRequest.requestedAt || "").toLocaleDateString(language === "ar" ? "ar-EG" : "en-CA")}</TableCell>
                <TableCell label={columns[4]}>{t(`timeType.${leaveRequest?.type as number}`)}</TableCell>
                <TableCell label={columns[5]}>
                  <StatusBadge
                    variant={getStatusVariant(leaveRequest.status)}
                    size="medium"
                    shape="rounded"
                  >
                    {t(`status.${leaveRequest.status as number}`)}
                  </StatusBadge>
                </TableCell>
                <TableCell label={columns[6]}>
                  <div className="flex flex-wrap gap-2">
                    <Tooltip 
                      content={t("table.buttons.toolTipShow")}
                    >
                      <Button 
                        variant="primary" 
                        fullWidth={false}
                        size={"sm"}
                        icon={<Eye className="w-full h-full" />} 
                        onClick={() => handleShowLeaveRequests(leaveRequest.id)}
                      />
                    </Tooltip>
                    {
                      leaveRequest.status == LeaveRequestStatusType.Pending && 
                      <>
                        <Tooltip 
                          content={t("table.buttons.toolTipAccept")}
                        >
                          <Button 
                            variant="success" 
                            fullWidth={false}
                            size={"sm"} 
                            icon={<Check className="w-full h-full" />} 
                            onClick={() => handleAcceptLeaveRequests(leaveRequest.id)}
                          />
                        </Tooltip>
                        <Tooltip 
                          content={t("table.buttons.toolTipReject")}
                        >
                          <Button
                            variant="danger"
                            fullWidth={false}
                            size={"sm"}
                            icon={<X className="w-full h-full" />}
                            onClick={() => handleRejectLeaveRequests(leaveRequest.id)}
                          />
                        </Tooltip>
                      </>
                    }
                  </div>
                </TableCell>
              </TableRow>
            ))
          )
          }
        </Table>
      )}
    </>
  );
};

export default LeaveRequestsTable;
