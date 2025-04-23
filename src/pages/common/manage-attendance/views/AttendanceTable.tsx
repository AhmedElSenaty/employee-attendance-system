import { useMemo } from "react";
import { NoDataMessage, Table, TableCell, TableRow, TableSkeleton } from "../../../../components/ui/Table";
import { Button } from "../../../../components/ui/Button";
import { AlertTriangle, CheckCircle, Eye, FilePenLine, Trash2 } from "lucide-react";
import { TFunction } from "i18next";
import { IAttendanceData } from "../../../../interfaces";
import { StatusBadge } from "../../../../components/ui/StatusBadge";
import { ATTENDANCE_TABLE_COLUMNS, ATTENDANCE_TRANSLATION_NAMESPACE } from "..";
import { HasPermission } from "../../../../components/auth";

interface IAttendanceTableProps {
  attendances: IAttendanceData[];
  isLoading: boolean;
  t: TFunction;
  handleShowAttendance: (id: number) => void;
  handleEditAttendance: (id: number) => void;
  handleDeleteAttendance: (id: number) => void;
}

const AttendanceTable = ({ attendances, t, isLoading, handleShowAttendance, handleEditAttendance, handleDeleteAttendance }: IAttendanceTableProps) => {

  const columns = useMemo(
    () => ATTENDANCE_TABLE_COLUMNS.map(key => t(key, { ns: ATTENDANCE_TRANSLATION_NAMESPACE })),
    [t]
  )
  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {attendances.length == 0 ? (
            <NoDataMessage title={t("table.emptyTable.title", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })} message={t("table.emptyTable.message", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })} />
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
                      <Button 
                        variant="primary" 
                        fullWidth={false}
                        size={"sm"}
                        icon={<Eye className="w-full h-full" />} 
                        aria-label={t("buttons.view")}
                        onClick={() => handleShowAttendance(attendance.id)}
                      />
                    </HasPermission>
                    <HasPermission permission="Update Attendance">
                      <Button 
                        variant="info" 
                        fullWidth={false}
                        size={"sm"}
                        icon={<FilePenLine className="w-full h-full" />} 
                        aria-label={t("buttons.edit")} 
                        onClick={() => handleEditAttendance(attendance.id)}
                      />
                    </HasPermission>
                    <HasPermission permission="Delete Attendance">
                      <Button
                        variant="danger"
                        fullWidth={false}
                        size={"sm"}
                        icon={<Trash2 className="w-full h-full" />}
                        aria-label={t("buttons.delete")}
                        onClick={() => handleDeleteAttendance(attendance.id)}
                      />
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
