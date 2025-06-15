import { AlertTriangle, CheckCircle, Eye, FilePenLine, Trash2 } from "lucide-react";
import { IAttendanceData } from "../../../../interfaces";
import { HasPermission } from "../../../../components/auth";
import { Button, NoDataMessage, StatusBadge, Table, TableCell, TableRow, TableSkeleton, Tooltip } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { ATTENDANCE_NS } from "../../../../constants";

interface IAttendanceTableProps {
  attendances: IAttendanceData[];
  isLoading: boolean;
  handleShow: (id: number) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const AttendanceTable = ({ attendances, isLoading, handleShow, handleEdit, handleDelete }: IAttendanceTableProps) => {
  const { t } = useTranslation([ATTENDANCE_NS]);

  const ATTENDANCE_TABLE_COLUMNS = [
    "table.columns.id",
    "table.columns.attendanceDate",
    "table.columns.attendanceTime",
    "table.columns.empName",
    "table.columns.status",
    "table.columns.department",
    "table.columns.subdepartment",
    "table.columns.actions",
  ]

  const columns = ATTENDANCE_TABLE_COLUMNS.map(key => t(key))

  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {attendances.length == 0 ? (
            <NoDataMessage title={t("table.emptyTable.title")} message={t("table.emptyTable.message")} />
          ) : (
            attendances.map((attendance) => (
              <TableRow key={attendance.id} className="border-b">
                <TableCell label={columns[0]}>{attendance.id}</TableCell>
                <TableCell label={columns[1]}>{attendance.attendanceDate}</TableCell>
                <TableCell label={columns[2]}>{attendance.attendanceTime}</TableCell>
                <TableCell label={columns[3]}>{attendance.empName}</TableCell>
                <TableCell label={columns[4]}>
                  <StatusBadge
                    variant={attendance.status == "حضور" ? "success" : "warning"}
                    size={"medium"}
                    icon={attendance.status ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    >
                    {attendance.status}
                  </StatusBadge>
                </TableCell>
                <TableCell label={columns[5]}>{attendance.department}</TableCell>
                <TableCell label={columns[6]}>{attendance.subdepartment}</TableCell>
                <TableCell label={columns[7]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="View Attendances">
                      <Tooltip content={t("buttons.toolTipShow")}>
                        <Button 
                          variant="primary" 
                          fullWidth={false}
                          size={"sm"}
                          icon={<Eye className="w-full h-full" />} 
                          aria-label={t("buttons.view")}
                          onClick={() => handleShow(attendance.id)}
                        />
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Update Attendance">
                      <Tooltip content={t("buttons.toolTipEdit")}>
                        <Button 
                          variant="info" 
                          fullWidth={false}
                          size={"sm"}
                          icon={<FilePenLine className="w-full h-full" />} 
                          aria-label={t("buttons.edit")} 
                          onClick={() => handleEdit(attendance.id)}
                        />
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Delete Attendance">
                      <Tooltip content={t("buttons.toolTipDelete")}>
                        <Button
                          variant="danger"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Trash2 className="w-full h-full" />}
                          aria-label={t("buttons.delete")}
                          onClick={() => handleDelete(attendance.id)}
                        />
                      </Tooltip>
                    </HasPermission>
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

export default AttendanceTable;
