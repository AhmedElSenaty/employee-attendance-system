import { Eye, X, Check, Trash } from "lucide-react";
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
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../../store/";
import { getRequestStatusVariant } from "../../../../utils";
import { RequestStatusType } from "../../../../enums";
import { IOrdinaryRequestData } from "../../../../interfaces";
import { ORDINARY_REQUESTS_NS } from "../../../../constants";
import { HasPermission } from "../../../../components/auth";

interface ITableProps {
  ordinaryRequests: IOrdinaryRequestData[];
  isLoading: boolean;
  handleShow: (id: number) => void;
  handleAccept: (id: number) => void;
  handleReject: (id: number) => void;
  handleDelete: (id: number) => void;
}

const OrdinaryRequestsTable = ({
  ordinaryRequests,
  isLoading,
  handleShow,
  handleAccept,
  handleReject,
  handleDelete,
}: ITableProps) => {
  const { t } = useTranslation(ORDINARY_REQUESTS_NS);
  const { language } = useLanguageStore();

  const ORDINARY_REQUESTS_TABLE_COLUMNS = [
    // "table.columns.id",
    "table.columns.employeeName",
    "table.columns.startDate",
    "table.columns.endDate",
    "table.columns.requestedAt",
    "table.columns.status",
    "table.columns.actions",
  ];

  const columns = ORDINARY_REQUESTS_TABLE_COLUMNS.map((key) => t(key));

  return (
    <>
      {isLoading ? (
        <TableSkeleton
          numberOfColumns={columns.length}
          defaultNumberOfRows={5}
        />
      ) : (
        <Table columns={columns}>
          {ordinaryRequests.length == 0 ? (
            <NoDataMessage
              title={t("table.emptyTable.title")}
              message={t("table.emptyTable.message")}
            />
          ) : (
            ordinaryRequests.map((ordinaryRequest) => (
              <TableRow key={ordinaryRequest.id} className="border-b">
                {/* <TableCell label={columns[0]}>
                  {formatValue(ordinaryRequest?.id || 0, language)}
                </TableCell> */}
                <TableCell label={columns[1]}>
                  {ordinaryRequest.employeeName}
                </TableCell>
                <TableCell label={columns[2]}>
                  {new Date(ordinaryRequest.startDate || "").toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-CA"
                  )}
                </TableCell>
                <TableCell label={columns[3]}>
                  {new Date(ordinaryRequest.endDate || "").toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-CA"
                  )}
                </TableCell>
                <TableCell label={columns[4]}>
                  {new Date(ordinaryRequest?.requestedAt || "").toLocaleString(
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
                <TableCell label={columns[5]}>
                  <StatusBadge
                    variant={getRequestStatusVariant(ordinaryRequest.status)}
                    size="medium"
                    shape="rounded"
                  >
                    {t(`status.${ordinaryRequest.status as number}`)}
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
                        onClick={() => handleShow(ordinaryRequest.id)}
                      />
                    </Tooltip>
                    <HasPermission permission="Accept/Reject Requests">
                      {ordinaryRequest.status == RequestStatusType.Pending && (
                        <>
                          <Tooltip content={t("table.buttons.toolTipAccept")}>
                            <Button
                              variant="success"
                              fullWidth={false}
                              size={"sm"}
                              icon={<Check className="w-full h-full" />}
                              onClick={() => handleAccept(ordinaryRequest.id)}
                            />
                          </Tooltip>
                          <Tooltip content={t("table.buttons.toolTipReject")}>
                            <Button
                              variant="danger"
                              fullWidth={false}
                              size={"sm"}
                              icon={<X className="w-full h-full" />}
                              onClick={() => handleReject(ordinaryRequest.id)}
                            />
                          </Tooltip>
                        </>
                      )}
                    </HasPermission>
                    {ordinaryRequest.status == RequestStatusType.Accepted && (
                      <Tooltip content={t("table.buttons.toolTipDelete")}>
                        <Button
                          variant="error"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Trash className="w-full h-full" />}
                          onClick={() => handleDelete(ordinaryRequest.id)}
                        />
                      </Tooltip>
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

export default OrdinaryRequestsTable;
