import { NoDataMessage, Table, TableCell, TableRow, TableSkeleton, Button, Tooltip } from "../../../../components/ui";
import { Eye, FilePenLine, Trash2 } from "lucide-react";
import { formatValue, truncateText } from "../../../../utils";
import { Entity } from "../../../../interfaces";
import { HasPermission } from "../../../../components/auth";
import { useTranslation } from "react-i18next";
import { ENTITY_NS } from "../../../../constants";
import { useLanguageStore } from "../../../../store";

interface Props {
  entities: Entity[];
  isLoading: boolean;
  handleShow: (id: number) => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const EntitiesTable = ({ entities, isLoading, handleShow, handleEdit, handleDelete }: Props) => {
  const { t } = useTranslation([ENTITY_NS]);
  const { language } = useLanguageStore();

  const ENTITY_TABLE_COLUMNS = [
    "table.columns.id",
    "table.columns.name",
    "table.columns.description",
    "table.columns.actions",
  ]
  
  const columns = ENTITY_TABLE_COLUMNS.map(key => t(key));

  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {entities.length == 0 ? (
            <NoDataMessage title={t("table.emptyTable.title")} message={t("table.emptyTable.message")} />
          ) : (
            entities.map((entity) => (
              <TableRow key={entity.id} className="border-b">
                <TableCell label={columns[0]}>{formatValue(entity.id, language)}</TableCell>
                <TableCell label={columns[1]}>{entity.name}</TableCell>
                <TableCell label={columns[2]}>{entity.description != null ? truncateText(entity.description, 30) : t("NA")}</TableCell>
                <TableCell label={columns[4]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="View Entities">
                      <Tooltip 
                        content={t("buttons.toolTipShow")}
                      >
                        <Button 
                          variant="primary" 
                          fullWidth={false}
                          size={"sm"}
                          icon={<Eye className="w-full h-full" />} 
                          onClick={() => handleShow(entity.id)}
                        />
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Update Entity">
                      <Tooltip 
                        content={t("buttons.toolTipEdit")}
                      >
                        <Button 
                          variant="info" 
                          fullWidth={false}
                          size={"sm"}
                          icon={<FilePenLine className="w-full h-full" />} 
                          onClick={() => handleEdit(entity.id)}
                        />
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Delete Entity">
                      <Tooltip 
                        content={t("buttons.toolTipDelete")}
                      >
                        <Button
                          variant="danger"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Trash2 className="w-full h-full" />}
                          onClick={() => handleDelete(entity.id)}
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

export default EntitiesTable;
