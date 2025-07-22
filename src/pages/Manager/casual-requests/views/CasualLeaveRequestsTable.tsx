import { Eye, X, Check, Trash, FilePenLine } from "lucide-react";
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
import { getRequestStatusVariant } from "../../../../utils";
import { RequestStatusType } from "../../../../enums";
import { ICasualLeaveRequestData } from "../../../../interfaces";
import { CASUAL_REQUESTS_NS } from "../../../../constants";
import { HasPermission } from "../../../../components/auth";

interface ITableProps {
  casualLeaveRequests: ICasualLeaveRequestData[];
  isLoading: boolean;
  handleShow: (id: number) => void;
  handleAccept: (id: number) => void;
  handleReject: (id: number) => void;
  handleDelete: (id: number) => void;
  handleEdit: (id: number) => void;
}

const CasualLeaveRequestssTable = ({
  casualLeaveRequests,
  isLoading,
  handleShow,
  handleAccept,
  handleReject,
  handleDelete,
  handleEdit,
}: ITableProps) => {
  const { t } = useTranslation(CASUAL_REQUESTS_NS);
  const { language } = useLanguageStore();

  const CASUAL_LEAVE_REQUESTS_TABLE_COLUMNS = [
    "table.columns.employeeName",
    "table.columns.startDate",
    "table.columns.endDate",
    "table.columns.requestedAt",
    "table.columns.status",
    "table.columns.actions",
  ];

  const columns = CASUAL_LEAVE_REQUESTS_TABLE_COLUMNS.map((key) => t(key));

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
                  {casualLeaveRequest.employeeName}
                </TableCell>
                <TableCell label={columns[1]}>
                  {new Date(
                    casualLeaveRequest.startDate || ""
                  ).toLocaleDateString(language === "ar" ? "ar-EG" : "en-CA")}
                </TableCell>
                <TableCell label={columns[2]}>
                  {new Date(
                    casualLeaveRequest.endDate || ""
                  ).toLocaleDateString(language === "ar" ? "ar-EG" : "en-CA")}
                </TableCell>
                <TableCell label={columns[3]}>
                  {new Date(
                    casualLeaveRequest?.requestedAt || ""
                  ).toLocaleString(language === "ar" ? "ar-EG" : "en-CA", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell label={columns[4]}>
                  <StatusBadge
                    variant={getRequestStatusVariant(casualLeaveRequest.status)}
                    size="medium"
                    shape="rounded"
                  >
                    {t(`status.${casualLeaveRequest.status as number}`)}
                  </StatusBadge>
                </TableCell>
                <TableCell label={columns[5]}>
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
                    <HasPermission permission="Accept/Reject Requests">
                      {casualLeaveRequest.status ==
                        RequestStatusType.Pending && (
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
                    </HasPermission>
                    {(casualLeaveRequest.status == RequestStatusType.Accepted ||
                      casualLeaveRequest.status == RequestStatusType.Edited ||
                      casualLeaveRequest.status ==
                        RequestStatusType.AssignedManually) && (
                      <>
                        <Tooltip content={t("table.buttons.toolTipDelete")}>
                          <Button
                            variant="error"
                            fullWidth={false}
                            size={"sm"}
                            icon={<Trash className="w-full h-full" />}
                            onClick={() => handleDelete(casualLeaveRequest.id)}
                          />
                        </Tooltip>
                        <Button
                          variant="info"
                          fullWidth={false}
                          size={"sm"}
                          icon={<FilePenLine className="w-full h-full" />}
                          onClick={() => handleEdit(casualLeaveRequest.id)}
                        />
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
