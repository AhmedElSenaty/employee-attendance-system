import { useMemo } from "react";
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
import { CASUAL_LEAVE_REQUESTS_TABLE_COLUMNS, TRANSLATION_NAMESPACE } from "..";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../../store/language.store";
import { formatValue, getRequestStatusVariant } from "../../../../utils";
import { RequestStatusType } from "../../../../enums";
import { ICasualLeaveRequestData } from "../../../../interfaces";

interface ITableProps {
  casualLeaveRequests: ICasualLeaveRequestData[];
  isLoading: boolean;
  handleShow: (id: number) => void;
  handleAccept: (id: number) => void;
  handleReject: (id: number) => void;
}

const CasualLeaveRequestssTable = ({
  casualLeaveRequests,
  isLoading,
  handleShow,
  handleAccept,
  handleReject,
}: ITableProps) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);
  const { language } = useLanguageStore();

  const columns = useMemo(
    () => CASUAL_LEAVE_REQUESTS_TABLE_COLUMNS.map((key) => t(key)),
    [t]
  );

  return (
    <>
      {isLoading ? (
        <TableSkeleton
          numberOfColumns={columns.length}
          defaultNumberOfRows={5}
        />
      ) : (
        <Table columns={columns}>
          {casualLeaveRequests.length == 0 ? (
            <NoDataMessage
              title={t("table.emptyTable.title")}
              message={t("table.emptyTable.message")}
            />
          ) : (
            casualLeaveRequests.map((casualLeaveRequest) => (
              <TableRow key={casualLeaveRequest.id} className="border-b">
                <TableCell label={columns[0]}>
                  {formatValue(casualLeaveRequest?.id || 0, language)}
                </TableCell>
                <TableCell label={columns[1]}>
                  {casualLeaveRequest.employeeName}
                </TableCell>
                <TableCell label={columns[2]}>
                  {new Date(casualLeaveRequest.startDate || "").toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-CA"
                  )}
                </TableCell>
                <TableCell label={columns[3]}>
                  {new Date(casualLeaveRequest.startDate || "").toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-CA"
                  )}
                </TableCell>
                <TableCell label={columns[4]}>
                  {new Date(casualLeaveRequest.requestedAt || "").toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-CA"
                  )}
                </TableCell>
                <TableCell label={columns[5]}>
                  <StatusBadge
                    variant={getRequestStatusVariant(casualLeaveRequest.status)}
                    size="medium"
                    shape="rounded"
                  >
                    {t(`status.${casualLeaveRequest.status as number}`)}
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
                        onClick={() => handleShow(casualLeaveRequest.id)}
                      />
                    </Tooltip>
                    {casualLeaveRequest.status == RequestStatusType.Pending && (
                      <>
                        <Tooltip content={t("table.buttons.toolTipAccept")}>
                          <Button
                            variant="success"
                            fullWidth={false}
                            size={"sm"}
                            icon={<Check className="w-full h-full" />}
                            onClick={() =>
                              handleAccept(casualLeaveRequest.id)
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
                              handleReject(casualLeaveRequest.id)
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

export default CasualLeaveRequestssTable;
