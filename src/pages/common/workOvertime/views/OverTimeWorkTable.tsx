import {
  NoDataMessage,
  Table,
  TableCell,
  TableRow,
  TableSkeleton,
  Button,
  Tooltip,
} from "../../../../components/ui";
import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  requests: any;
  isLoading: boolean;
}

const OverTimeWorkTable = ({ requests, isLoading }: Props) => {
  const { t } = useTranslation("workOvertime");

  const ENTITY_TABLE_COLUMNS = [
    "table.columns.employeeName", // amir khaled employeeTest
    "table.columns.depart", // مركز الاتصالات وتكنولوجيا المعلومات
    "table.columns.subDeptName", // برمجة
    "table.columns.date", // 10/08/2025
    "table.columns.day", // الأحد
    "table.columns.in", // 10:29
    "table.columns.out", // 23:34
    "table.columns.totalHours", // 21
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
              requests.map((row) => (
                <TableRow key={row.id} className="border-b">
                  <TableCell className="text-right" label={columns[0]}>
                    {row.employeeName}
                  </TableCell>
                  <TableCell className="text-right" label={columns[1]}>
                    {row.depart}
                  </TableCell>
                  <TableCell className="text-right" label={columns[2]}>
                    {row.subDeptName}
                  </TableCell>
                  <TableCell className="text-right" label={columns[3]}>
                    {row.date}
                  </TableCell>
                  <TableCell className="text-right" label={columns[4]}>
                    {row.day}
                  </TableCell>
                  <TableCell className="text-right" label={columns[5]}>
                    {row.in}
                  </TableCell>
                  <TableCell className="text-right" label={columns[6]}>
                    {row.out}
                  </TableCell>
                  <TableCell className="text-right" label={columns[7]}>
                    {row.totalHours}
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

export default OverTimeWorkTable;
