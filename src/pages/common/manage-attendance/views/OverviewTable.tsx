import { formatValue } from "../../../../utils";
import { useLanguageStore } from "../../../../store/";
import { NoDataMessage, Table, TableCell, TableRow, TableSkeleton } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { ATTENDANCE_NS } from "../../../../constants";
import { AttendanceSummaryData } from "../../../../interfaces";

interface Props {
  attendance: AttendanceSummaryData[];
  isLoading: boolean;
}

const OverviewTable = ({ attendance, isLoading }: Props) => {
  const { t } = useTranslation([ATTENDANCE_NS]);
  const { language } = useLanguageStore();

  const ATTENDANCE_SUMMARY_TABLE_COLUMNS = [
    "tableSummary.columns.employeeName",
    "tableSummary.columns.department",
    "tableSummary.columns.subdepartment",
    "tableSummary.columns.checkedInOnlyDays",
    "tableSummary.columns.checkedOutOnlyDays",
    "tableSummary.columns.attendanceDays",
    "tableSummary.columns.absenceDays",
    "tableSummary.columns.totalWorkingHours",
    // "tableSummary.columns.actions",
  ]

  const columns = ATTENDANCE_SUMMARY_TABLE_COLUMNS.map(key => t(key))

  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {attendance.length == 0 ? (
            <NoDataMessage title={t("table.emptyTable.title")} message={t("table.emptyTable.message")} />
          ) : (
            attendance.map((attendance) => (
              <TableRow key={attendance.employeeId} className="border-b">
                <TableCell label={columns[0]}>{attendance.employeeName}</TableCell>
                <TableCell label={columns[1]}>{attendance.department}</TableCell>
                <TableCell label={columns[2]}>{formatValue(attendance.subDepartment, language)}</TableCell>
                <TableCell label={columns[3]}>{formatValue(attendance.checkedInOnlyDays, language)}</TableCell>
                <TableCell label={columns[4]}>{formatValue(attendance.checkedOutOnlyDays, language)}</TableCell>
                <TableCell label={columns[5]}>{formatValue(attendance.attendanceDays, language)}</TableCell>
                <TableCell label={columns[6]}>{formatValue(attendance.absenceDays, language)}</TableCell>
                <TableCell label={columns[7]}>{formatValue(attendance.totalWorkingHours, language)}</TableCell>
              </TableRow>
            ))
          )}
        </Table>
      )}
    </>
  )
}

export default OverviewTable
