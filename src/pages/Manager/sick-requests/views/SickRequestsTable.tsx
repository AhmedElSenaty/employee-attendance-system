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
import { formatValue, getRequestStatusVariant } from "../../../../utils";
import { RequestStatusType } from "../../../../enums";
import { SICK_REQUESTS_NS } from "../../../../constants";
import { ISickRequestData } from "../../../../interfaces";
import { HasPermission } from "../../../../components/auth";

interface ITableProps {
  sickRequests: ISickRequestData[];
  isLoading: boolean;
  handleShow: (id: number) => void;
  handleAccept: (id: number) => void;
  handleReject: (id: number) => void;
  handleDelete: (id: number) => void;
}

const SickRequestsTable = ({
  sickRequests,
  isLoading,
  handleShow,
  handleAccept,
  handleReject,
  handleDelete,
}: ITableProps) => {
  const { t } = useTranslation(SICK_REQUESTS_NS);
  const { language } = useLanguageStore();

  const SICK_REQUESTS_TABLE_COLUMNS = [
    "table.columns.id",
    "table.columns.employeeName",
    "table.columns.startDate",
    "table.columns.endDate",
    "table.columns.numberOfDays",
    "table.columns.requestedAt",
    "table.columns.status",
    "table.columns.actions",
  ];

  const columns = SICK_REQUESTS_TABLE_COLUMNS.map((key) => t(key));

  // const handleOpenFile = (fileUrl: string) => {
  //   window.open(fileUrl, '_blank');
  // };

  return (
    <>
      {isLoading ? (
        <TableSkeleton
          numberOfColumns={columns.length}
          defaultNumberOfRows={5}
        />
      ) : (
        <Table columns={columns}>
          {sickRequests.length == 0 ? (
            <NoDataMessage
              title={t("table.emptyTable.title")}
              message={t("table.emptyTable.message")}
            />
          ) : (
            sickRequests.map((sickRequest) => (
              <TableRow key={sickRequest.requestId} className="border-b">
                <TableCell label={columns[0]}>
                  {formatValue(sickRequest?.requestId || 0, language)}
                </TableCell>
                <TableCell label={columns[1]}>
                  {sickRequest.employeeName}
                </TableCell>
                <TableCell label={columns[2]}>
                  {new Date(sickRequest.startDate || "").toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-CA"
                  )}
                </TableCell>
                <TableCell label={columns[3]}>
                  {new Date(sickRequest.endDate || "").toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-CA"
                  )}
                </TableCell>
                <TableCell label={columns[4]}>
                  {formatValue(sickRequest?.numberOfDays || 0, language)}
                </TableCell>
                <TableCell label={columns[5]}>
                  {new Date(sickRequest.requestedAt || "").toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-CA"
                  )}
                </TableCell>
                <TableCell label={columns[6]}>
                  <StatusBadge
                    variant={getRequestStatusVariant(sickRequest.status)}
                    size="medium"
                    shape="rounded"
                  >
                    {t(`status.${sickRequest.status as number}`)}
                  </StatusBadge>
                </TableCell>
                <TableCell label={columns[7]}>
                  <div className="flex flex-wrap gap-2">
                    {/* <Tooltip content={t("table.buttons.toolOpenReport")}>
                      <Button
                        variant="info"
                        fullWidth={false}
                        size={"sm"}
                        icon={<ExternalLink className="w-full h-full" />}
                        onClick={() => handleOpenFile(sickRequest?.file || "")}
                      />
                    </Tooltip> */}
                    <Tooltip content={t("table.buttons.toolTipShow")}>
                      <Button
                        variant="primary"
                        fullWidth={false}
                        size={"sm"}
                        icon={<Eye className="w-full h-full" />}
                        onClick={() => handleShow(sickRequest?.requestId)}
                      />
                    </Tooltip>
                    <HasPermission permission="Accept/Reject Requests">
                      {sickRequest.status == RequestStatusType.Pending && (
                        <>
                          <Tooltip content={t("table.buttons.toolTipAccept")}>
                            <Button
                              variant="success"
                              fullWidth={false}
                              size={"sm"}
                              icon={<Check className="w-full h-full" />}
                              onClick={() =>
                                handleAccept(sickRequest?.requestId)
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
                                handleReject(sickRequest?.requestId)
                              }
                            />
                          </Tooltip>
                        </>
                      )}
                    </HasPermission>
                    {sickRequest.status == RequestStatusType.Accepted && (
                      <Tooltip content={t("table.buttons.toolTipDelete")}>
                        <Button
                          variant="error"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Trash className="w-full h-full" />}
                          onClick={() => handleDelete(sickRequest.requestId)}
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

export default SickRequestsTable;
