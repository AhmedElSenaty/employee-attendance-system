import { useMemo } from "react";
import { NoDataMessage, Table, TableCell, TableRow, TableSkeleton, Button, Tooltip } from "../../../../components/ui";
import { Eye, FilePenLine, Trash2 } from "lucide-react";
import { TFunction } from "i18next";
import { truncateText } from "../../../../utils";
import { IEntityData } from "../../../../interfaces";
import { ENTITY_TABLE_COLUMNS, ENTITY_TRANSLATION_NAMESPACE } from "..";
import { HasPermission } from "../../../../components/auth";

interface IEntitiesTableProps {
  entities: IEntityData[];
  isLoading: boolean;
  t: TFunction;
  handleShowEntity: (id: number) => void;
  handleEditEntity: (id: number) => void;
  handleDeleteEntity: (id: number) => void;
}

const EntitiesTable = ({ entities, t, isLoading, handleShowEntity, handleEditEntity, handleDeleteEntity }: IEntitiesTableProps) => {

  const columns = useMemo(
    () => ENTITY_TABLE_COLUMNS.map(key => t(key, { ns: ENTITY_TRANSLATION_NAMESPACE })),
    [t]
  );

  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {entities.length == 0 ? (
            <NoDataMessage title={t("table.emptyTable.title", { ns: ENTITY_TRANSLATION_NAMESPACE })} message={t("table.emptyTable.message", { ns: ENTITY_TRANSLATION_NAMESPACE })} />
          ) : (
            entities.map((entity) => (
              <TableRow key={entity.id} className="border-b">
                <TableCell label={columns[0]}>{entity.id}</TableCell>
                <TableCell label={columns[1]}>{entity.name}</TableCell>
                <TableCell label={columns[2]}>{entity.description != null ? truncateText(entity.description, 30) : t("table.NA")}</TableCell>
                <TableCell label={columns[4]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="View Entities">
                      <Tooltip content="View Entities">
                        <Button 
                          variant="primary" 
                          fullWidth={false}
                          size={"sm"}
                          icon={<Eye className="w-full h-full" />} 
                          aria-label={t("buttons.view")}
                          onClick={() => handleShowEntity(entity.id)}
                        />
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Update Entity">
                      <Tooltip content="Update Entity">
                        <Button 
                          variant="info" 
                          fullWidth={false}
                          size={"sm"}
                          icon={<FilePenLine className="w-full h-full" />} 
                          aria-label={t("buttons.edit")} 
                          onClick={() => handleEditEntity(entity.id)}
                        />
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Delete Entity">
                      <Tooltip content="Delete Entity">
                        <Button
                          variant="danger"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Trash2 className="w-full h-full" />}
                          aria-label={t("buttons.delete")}
                          onClick={() => handleDeleteEntity(entity.id)}
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
