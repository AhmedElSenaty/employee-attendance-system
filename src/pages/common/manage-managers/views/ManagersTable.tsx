import { StatusBadge, Button, NoDataMessage, Table, TableCell, TableRow, TableSkeleton, Tooltip } from "../../../../components/ui/";
import { AlertTriangle, Ban, CheckCircle, FilePenLine, Trash2 } from "lucide-react";
import { NavLink } from "react-router";
import { truncateText } from "../../../../utils";
import { HasPermission } from "../../../../components/auth";
import { useLanguageStore, useUserStore } from "../../../../store/";
import { ManagerData } from "../../../../interfaces";
import { MANAGER_NS } from "../../../../constants";
import { useTranslation } from "react-i18next";

interface Props {
  managers: ManagerData[];
  isLoading: boolean;
  handleDeleteManager: (id: string) => void;
  handleUnblockManager: (id: string) => void;
}

const ManagersTable = ({ managers, isLoading, handleDeleteManager, handleUnblockManager }: Props) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation([MANAGER_NS]);

  const userRole = useUserStore((state) => state.role);

  const MANAGER_TABLE_COLUMNS = [
    "table.columns.username",
    "table.columns.email",
    "table.columns.department",
    "table.columns.status",
    "table.columns.createdAt",
    "table.columns.actions",
  ]

  const columns = MANAGER_TABLE_COLUMNS.map(key => t(key))


  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {managers.length == 0 ? (
            <NoDataMessage title={t("table.emptyTable.title")} message={t("table.emptyTable.message")} />
          ) : (
            managers.map(({ id, username, email, department, isBlocked, createdAt }: ManagerData) => (
              <TableRow key={id} className="border-b">
                <TableCell label={columns[0]}>{truncateText(username, 20)}</TableCell>
                <TableCell label={columns[1]}>
                  {truncateText(email, 15)}
                </TableCell>
                <TableCell label={columns[2]}>{department.name}</TableCell>
                <TableCell label={columns[3]}>
                  <StatusBadge
                    variant={isBlocked ? "neutral" : "info"}
                    size={"medium"}
                    icon={isBlocked ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" /> }
                    >
                    {
                      isBlocked ? 
                        t("table.isBlocked.blocked")
                        : t("table.isBlocked.notBlocked")
                    }
                  </StatusBadge>
                </TableCell>
                <TableCell label={columns[4]}>
                  {new Date(createdAt).toLocaleDateString(language == "ar" ? "ar-EG" : "en-CA")}
                </TableCell>
                <TableCell label={columns[5]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="Update Manager">
                      <Tooltip content={t("buttons.editToolTip")}>
                        <NavLink to={`/${userRole}/edit-manager/${id}`}>
                          <Button 
                            variant="info" 
                            fullWidth={false}
                            size={"sm"} 
                            icon={<FilePenLine className="w-full h-full" />} 
                            aria-label={t("buttons.edit")} 
                          />
                        </NavLink>
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Delete Manager">
                      <Tooltip content={t("buttons.deleteToolTip")}>
                        <Button
                          variant="danger"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Trash2 className="w-full h-full" />}
                          aria-label={t("buttons.delete")}
                          onClick={() => handleDeleteManager(id)}
                        />
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Unlock Account">
                      {
                        isBlocked &&
                        <Tooltip content={t("buttons.unlockToolTip")}>
                          <Button
                            variant="black"
                            fullWidth={false}
                            size={"sm"}
                            icon={<Ban className="w-full h-full" />}
                            aria-label={t("buttons.delete")}
                            onClick={() => handleUnblockManager(id)}
                          />
                        </Tooltip>
                      }
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

export default ManagersTable;
