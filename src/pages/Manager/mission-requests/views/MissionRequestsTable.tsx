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
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../../store/language.store";
import { formatValue, getRequestStatusVariant } from "../../../../utils";
import { RequestStatusType } from "../../../../enums";
import { IMissionRequestData } from "../../../../interfaces";
import { MISSION_REQUESTS_NS } from "../../../../constants";

interface ITableProps {
  missionRequests: IMissionRequestData[];
  isLoading: boolean;
  handleShow: (id: number) => void;
  handleAccept: (id: number) => void;
  handleReject: (id: number) => void;
}

const MissionRequestsTable = ({
  missionRequests,
  isLoading,
  handleShow,
  handleAccept,
  handleReject,
}: ITableProps) => {
  const { t } = useTranslation(MISSION_REQUESTS_NS);
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
          {missionRequests.length == 0 ? (
            <NoDataMessage
              title={t("table.emptyTable.title")}
              message={t("table.emptyTable.message")}
            />
          ) : (
            missionRequests.map((missionRequest) => (
              <TableRow key={missionRequest.id} className="border-b">
                <TableCell label={columns[0]}>
                  {formatValue(missionRequest?.id || 0, language)}
                </TableCell>
                <TableCell label={columns[1]}>
                  {missionRequest.employeeName}
                </TableCell>
                <TableCell label={columns[2]}>
                  {new Date(missionRequest.date || "").toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-CA"
                  )}
                </TableCell>
                <TableCell label={columns[3]}>
                  {new Date(missionRequest.requestedAt || "").toLocaleDateString(
                    language === "ar" ? "ar-EG" : "en-CA"
                  )}
                </TableCell>
                <TableCell label={columns[4]}>
                  {t(`dayType.${missionRequest?.type as number}`)}
                </TableCell>
                <TableCell label={columns[5]}>
                  <StatusBadge
                    variant={getRequestStatusVariant(missionRequest.status)}
                    size="medium"
                    shape="rounded"
                  >
                    {t(`status.${missionRequest.status as number}`)}
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
                        onClick={() => handleShow(missionRequest.id)}
                      />
                    </Tooltip>
                    {missionRequest.status == RequestStatusType.Pending && (
                      <>
                        <Tooltip content={t("table.buttons.toolTipAccept")}>
                          <Button
                            variant="success"
                            fullWidth={false}
                            size={"sm"}
                            icon={<Check className="w-full h-full" />}
                            onClick={() =>
                              handleAccept(missionRequest.id)
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
                              handleReject(missionRequest.id)
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

export default MissionRequestsTable;
