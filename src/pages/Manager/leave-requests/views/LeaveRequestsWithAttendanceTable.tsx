import {
  NoDataMessage,
  StatusBadge,
  Table,
  TableCell,
  TableRow,
  TableSkeleton,
} from "../../../../components/ui";
import { ILeaveRequestsWithAttendance } from "../../../../interfaces/";
import { useTranslation } from "react-i18next";
import { LEAVE_REQUESTS_NS } from "../../../../constants";
import { getLeaveRequestTypeVariant } from "../../../../utils";

interface ITableProps {
  leaveRequests: ILeaveRequestsWithAttendance[];
  isLoading: boolean;
}

const LeaveRequestsWithAttendanceTable = ({
  leaveRequests,
  isLoading,
}: ITableProps) => {
  const { t } = useTranslation(LEAVE_REQUESTS_NS);
  const LEAVE_REQUESTS_TABLE_COLUMNS = [
    "table.columns.employeeName",
    "table.columns.leaveType",
    "table.columns.checkIn",
    "table.columns.checkOut",
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
            leaveRequests.map((leaveRequest, idx) => (
              <TableRow key={idx} className="border-b">
                <TableCell label={columns[0]}>
                  {leaveRequest.employeeName}
                </TableCell>
                <TableCell label={columns[1]}>
                  <StatusBadge
                    variant={getLeaveRequestTypeVariant(leaveRequest.leaveType)}
                    size="medium"
                    shape="rounded"
                  >
                    {t(`timeType.${leaveRequest.leaveType as number}`)}
                  </StatusBadge>
                </TableCell>
                <TableCell label={columns[2]}>
                  {leaveRequest.checkIn}
                </TableCell>
                <TableCell label={columns[3]}>
                  {leaveRequest.checkOut}
                </TableCell>
              </TableRow>
            ))
          )}
        </Table>
      )}
    </>
  );
};

export default LeaveRequestsWithAttendanceTable;
