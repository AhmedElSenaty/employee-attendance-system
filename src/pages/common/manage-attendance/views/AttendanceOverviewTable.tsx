import { TFunction } from "i18next";
import { IAttendanceSummaryData } from "../../../../interfaces";
import { useMemo } from "react";
import { NoDataMessage, Table, TableCell, TableRow, TableSkeleton } from "../../../../components/ui/Table";
import { NavLink } from "react-router";
import { Button } from "../../../../components/ui/Button";
import { Calendar } from "lucide-react";
import { ATTENDANCE_SUMMARY_TABLE_COLUMNS, ATTENDANCE_TRANSLATION_NAMESPACE } from "..";
import { formatValue } from "../../../../utils";
import { useSelector } from "react-redux";
import { RootState } from "../../../../context/store";
import { HasPermission } from "../../../../components/auth";
import { selectRole } from "../../../../context/slices/userSlice";

interface IAttendanceOverviewTableProps {
  attendanceSummary: IAttendanceSummaryData[];
  isLoading: boolean;
  t: TFunction;
}

const AttendanceOverviewTable = ({ attendanceSummary, isLoading, t }: IAttendanceOverviewTableProps) => {
  const userRole = useSelector(selectRole());

  const columns = useMemo(
    () => ATTENDANCE_SUMMARY_TABLE_COLUMNS.map(key => t(key, { ns: ATTENDANCE_TRANSLATION_NAMESPACE })),
    [t]
  )
  const { language } = useSelector((state: RootState) => state.language);

  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {attendanceSummary.length == 0 ? (
            <NoDataMessage />
          ) : (
            attendanceSummary.map((attendance) => (
              <TableRow key={attendance.employeeId} className="border-b">
                <TableCell label={columns[0]}>{attendance.employeeName}</TableCell>
                <TableCell label={columns[1]}>{attendance.department}</TableCell>
                <TableCell label={columns[2]}>{formatValue(attendance.subDepartment, language)}</TableCell>
                <TableCell label={columns[3]}>{formatValue(attendance.checkedInOnlyDays, language)}</TableCell>
                <TableCell label={columns[4]}>{formatValue(attendance.checkedOutOnlyDays, language)}</TableCell>
                <TableCell label={columns[5]}>{formatValue(attendance.attendanceDays, language)}</TableCell>
                <TableCell label={columns[6]}>{formatValue(attendance.absenceDays, language)}</TableCell>
                <TableCell label={columns[7]}>{formatValue(attendance.totalWorkingHours, language)}</TableCell>
                <TableCell label={columns[8]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="View Attendances">
                      <NavLink to={`/${userRole}/manage-employee/${attendance.employeeId}/calender`}>
                        <Button
                          variant="success"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Calendar className="w-full h-full" />}
                        />
                      </NavLink>
                    </HasPermission>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </Table>
      )}
    </>
  )
}

export default AttendanceOverviewTable
