import { useMemo } from "react";
import { NoDataMessage, Table, TableCell, TableRow, TableSkeleton } from "../../../../components/ui/Table";
import { Button } from "../../../../components/ui/Button";
import { Eye, FilePenLine, Trash2 } from "lucide-react";
import { TFunction } from "i18next";
import { IOfficialVacationData } from "../../../../interfaces";
import { OFFICIAL_VACATIONS_TABLE_COLUMNS, OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE } from "..";
import { HasPermission } from "../../../../components/auth";
import { useLanguageStore } from "../../../../store/language.store";

interface IOfficialVacationsTableProps {
  officialVacations: IOfficialVacationData[];
  isLoading: boolean;
  t: TFunction;
  handleShow: (id: number) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const DevicesTable = ({ officialVacations, t, isLoading, handleShow, handleEdit, handleDelete }: IOfficialVacationsTableProps) => {
    const { language } = useLanguageStore();

  const columns = useMemo(
    () => OFFICIAL_VACATIONS_TABLE_COLUMNS.map(key => t(key, { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })),
    [t]
  );

  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {officialVacations.length == 0 ? (
            <NoDataMessage title={t("table.emptyTable.title", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })} message={t("table.emptyTable.message", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })} />
          ) : (
            officialVacations.map(({ id, name, startDate, endDate }: IOfficialVacationData) => (
              <TableRow key={id} className="border-b">
                <TableCell label={columns[0]}>{id}</TableCell>
                <TableCell label={columns[1]}>{name}</TableCell>
                <TableCell label={columns[2]}>{new Date(startDate).toLocaleDateString(language == "ar" ? "ar-EG" : "en-CA")}</TableCell>
                <TableCell label={columns[3]}>{new Date(endDate).toLocaleDateString(language == "ar" ? "ar-EG" : "en-CA")}</TableCell>
                <TableCell label={columns[4]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="View Official Vacations">
                      <Button 
                        variant="primary" 
                        fullWidth={false}
                        size={"sm"}
                        icon={<Eye className="w-full h-full" />} 
                        aria-label={t("buttons.view")}
                        onClick={() => handleShow(id)}
                      />
                    </HasPermission>
                    <HasPermission permission="Update Official Vacation">
                      <Button 
                        variant="info" 
                        fullWidth={false}
                        size={"sm"} 
                        icon={<FilePenLine className="w-full h-full" />} 
                        aria-label={t("buttons.edit")} 
                        onClick={() => handleEdit(id)}
                      />
                    </HasPermission>

                    <HasPermission permission="Delete Official Vacation">
                      <Button
                        variant="danger"
                        fullWidth={false}
                        size={"sm"}
                        icon={<Trash2 className="w-full h-full" />}
                        aria-label={t("buttons.delete")}
                        onClick={() => handleDelete(id)}
                      />
                    </HasPermission>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )
          }
        </Table>
      )}
    </>
  );
};

export default DevicesTable;
