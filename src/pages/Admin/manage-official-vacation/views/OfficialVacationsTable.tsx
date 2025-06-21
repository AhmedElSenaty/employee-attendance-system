import { Button, NoDataMessage, Table, TableCell, TableRow, TableSkeleton, Tooltip } from "../../../../components/ui";
import { Eye, FilePenLine, Trash2 } from "lucide-react";
import { HasPermission } from "../../../../components/auth";
import { useLanguageStore } from "../../../../store/";
import { OfficialVacation } from "../../../../interfaces";
import { useTranslation } from "react-i18next";
import { OFFICIAL_VACATION_NS } from "../../../../constants";
import { formatValue } from "../../../../utils";

interface Props {
  officialVacations: OfficialVacation[];
  isLoading: boolean;
  handleShow: (id: number) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const DevicesTable = ({ officialVacations, isLoading, handleShow, handleEdit, handleDelete }: Props) => {
    const { language } = useLanguageStore();
    const { t } = useTranslation([OFFICIAL_VACATION_NS]);

    const OFFICIAL_VACATIONS_TABLE_COLUMNS = [
      "table.columns.id",
      "table.columns.name",
      "table.columns.startDate",
      "table.columns.endDate",
      "table.columns.actions",
    ]

    const columns = OFFICIAL_VACATIONS_TABLE_COLUMNS.map(key => t(key));

  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {officialVacations.length == 0 ? (
            <NoDataMessage title={t("table.emptyTable.title")} message={t("table.emptyTable.message")} />
          ) : (
            officialVacations.map(({ id, name, startDate, endDate }: OfficialVacation) => (
              <TableRow key={id} className="border-b">
                <TableCell label={columns[0]}>{formatValue(id, language)}</TableCell>
                <TableCell label={columns[1]}>{name}</TableCell>
                <TableCell label={columns[2]}>{new Date(startDate).toLocaleDateString(language == "ar" ? "ar-EG" : "en-CA")}</TableCell>
                <TableCell label={columns[3]}>{new Date(endDate).toLocaleDateString(language == "ar" ? "ar-EG" : "en-CA")}</TableCell>
                <TableCell label={columns[4]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="View Official Vacations">
                      <Tooltip 
                        content={t("buttons.toolTipShow")}
                      >
                        <Button 
                          variant="primary" 
                          fullWidth={false}
                          size={"sm"}
                          icon={<Eye className="w-full h-full" />} 
                          onClick={() => handleShow(id)}
                        />
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Update Official Vacation">
                      <Tooltip 
                        content={t("buttons.toolTipEdit")}
                      >
                        <Button 
                          variant="info" 
                          fullWidth={false}
                          size={"sm"} 
                          icon={<FilePenLine className="w-full h-full" />} 
                          onClick={() => handleEdit(id)}
                        />
                      </Tooltip>
                    </HasPermission>

                    <HasPermission permission="Delete Official Vacation">
                      <Tooltip 
                        content={t("buttons.toolTipDelete")}
                      >
                        <Button
                          variant="danger"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Trash2 className="w-full h-full" />}
                          onClick={() => handleDelete(id)}
                        />
                      </Tooltip>
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
