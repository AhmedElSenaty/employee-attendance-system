import { AttendanceWithVacationsData } from "../../../../interfaces";
import { formatValue } from "../../../../utils";
import { useLanguageStore } from "../../../../store";
import { NoDataMessage, Table, TableCell, TableRow, TableSkeleton } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { ATTENDANCE_NS } from "../../../../constants";

interface Props {
  attendance: AttendanceWithVacationsData[];
  isLoading: boolean;
}

const VacationsTable = ({ attendance, isLoading }: Props) => {
  const { t } = useTranslation([ATTENDANCE_NS]);
  const { language } = useLanguageStore();

  const ATTENDANCE_VACATION_TABLE_COLUMNS = [
    "tableVacation.columns.employeeId",
    "tableVacation.columns.employeeName",
    "tableVacation.columns.departmentName",
    "tableVacation.columns.checkIn",
    "tableVacation.columns.checkOut",
    "tableVacation.columns.notes",
  ]

  const columns = ATTENDANCE_VACATION_TABLE_COLUMNS.map(key => t(key))

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
                <TableCell label={columns[0]}>{formatValue(attendance.employeeId, language)}</TableCell>
                <TableCell label={columns[1]}>{attendance.employeeName}</TableCell>
                <TableCell label={columns[2]}>{attendance.departmentName}</TableCell>
                <TableCell label={columns[3]}>{attendance.checkIn || t("NA")}</TableCell>
                <TableCell label={columns[4]}>{attendance.checkOut || t("NA")}</TableCell>
                <TableCell label={columns[5]}>{attendance.notes}</TableCell>
              </TableRow>
            ))
          )}
        </Table>
      )}
    </>
  )
}

export default VacationsTable
