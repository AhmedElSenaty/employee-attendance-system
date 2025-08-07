import {
  NoDataMessage,
  Table,
  TableCell,
  TableRow,
  TableSkeleton,
  Button,
  Tooltip,
} from "../../../../components/ui";
import { Check, Eye, FilePenLine, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ChangeVacationCountsRequestDto } from "../../../../interfaces/changeVacationCountRequests";
import { RequestStatusType } from "../../../../enums";

interface Props {
  requests: ChangeVacationCountsRequestDto[];
  isLoading: boolean;
  handleShow: (id: number) => void;
  handleEdit: (id: number) => void;
  handleAccept: (id: number) => void;
  handleReject: (id: number) => void;
}

const ChangeVacationTable = ({
  requests,
  isLoading,
  handleShow,
  handleEdit,
  handleAccept,
  handleReject,
}: Props) => {
  const { t } = useTranslation("changeVacationsRequests");

  const ENTITY_TABLE_COLUMNS = [
    "table.columns.managerName",
    "table.columns.emplyeeName",
    "table.columns.totalCasual",
    "table.columns.availableCasual",
    "table.columns.totalOrdinary",
    "table.columns.availableOrdinary",
    "table.columns.totalLeaveRequest",
    "table.columns.availableLeaveRequest",
    "table.columns.status",
    "table.columns.actions",
  ];

  const columns = ENTITY_TABLE_COLUMNS.map((key) => t(key));

  return (
    <>
      {isLoading ? (
        <TableSkeleton
          numberOfColumns={columns.length}
          defaultNumberOfRows={5}
        />
      ) : (
        <div dir="rtl">
          <Table columns={columns}>
            {requests.length == 0 ? (
              <NoDataMessage
                title={t("table.emptyTable.title")}
                message={t("table.emptyTable.message")}
              />
            ) : (
              requests.map((request) => (
                <TableRow key={request.id} className="border-b">
                  <TableCell className="text-right" label={columns[0]}>
                    {request.managerName}
                  </TableCell>
                  <TableCell className="text-right" label={columns[1]}>
                    {request.emplyeeName}
                  </TableCell>
                  <TableCell className="text-right" label={columns[2]}>
                    {request.totalCasual}
                  </TableCell>
                  <TableCell className="text-right" label={columns[3]}>
                    {request.availableCasual}
                  </TableCell>
                  <TableCell className="text-right" label={columns[4]}>
                    {request.totalOrdinary}
                  </TableCell>
                  <TableCell className="text-right" label={columns[5]}>
                    {request.availableOrdinary}
                  </TableCell>
                  <TableCell className="text-right" label={columns[6]}>
                    {request.totalLeaveRequest}
                  </TableCell>
                  <TableCell className="text-right" label={columns[7]}>
                    {request.availableLeaveRequest}
                  </TableCell>

                  <TableCell className="text-right" label={columns[8]}>
                    {t(`status.${RequestStatusType[request.status]}`)}
                  </TableCell>

                  <TableCell className="text-right" label={columns[9]}>
                    <div className="flex flex-wrap gap-2">
                      <Tooltip content={t("buttons.toolTipShow")}>
                        <Button
                          variant="primary"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Eye className="w-full h-full" />}
                          onClick={() => handleShow(request.id)}
                        />
                      </Tooltip>
                      <Tooltip content={t("buttons.toolTipEdit")}>
                        <Button
                          variant="info"
                          fullWidth={false}
                          size={"sm"}
                          icon={<FilePenLine className="w-full h-full" />}
                          onClick={() => handleEdit(request.id)}
                        />
                      </Tooltip>
                      {request.status === RequestStatusType.Pending && (
                        <Tooltip content={t("buttons.toolTipAccept")}>
                          <Button
                            variant="success"
                            fullWidth={false}
                            size="sm"
                            icon={<Check className="w-full h-full" />}
                            onClick={() => handleAccept(request.id)}
                          />
                        </Tooltip>
                      )}

                      {request.status === RequestStatusType.Pending && (
                        <Tooltip content={t("buttons.toolTipReject")}>
                          <Button
                            variant="danger"
                            fullWidth={false}
                            size="sm"
                            icon={<X className="w-full h-full" />}
                            onClick={() => handleReject(request.id)}
                          />
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </Table>
        </div>
      )}
    </>
  );
};

export default ChangeVacationTable;
