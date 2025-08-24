import {
  NoDataMessage,
  Table,
  TableCell,
  TableRow,
  TableSkeleton,
} from "../../../../components/ui";
import { useTranslation } from "react-i18next";

interface Props {
  requests: any;
  isLoading: boolean;
}

const DeductionTable = ({ requests, isLoading }: Props) => {
  const { t } = useTranslation("ordinaryDeduction");

  const DEDUCTION_TABLE_COLUMNS = [
    "table.columns.numOfDays",
    "table.columns.deductionDay",
    "table.columns.deductionDate",
    "table.columns.description",
  ];

  const columns = DEDUCTION_TABLE_COLUMNS.map((key) => t(key));

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
                    {row.numOfDays}
                  </TableCell>
                  <TableCell className="text-right" label={columns[1]}>
                    {row.deductionDay}
                  </TableCell>
                  <TableCell className="text-right" label={columns[2]}>
                    {row.deductionDate}
                  </TableCell>
                  <TableCell className="text-right" label={columns[3]}>
                    {row.description}
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

export default DeductionTable;
