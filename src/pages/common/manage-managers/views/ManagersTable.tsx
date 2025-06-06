import { useMemo } from "react";
import { NoDataMessage, Table, TableCell, TableRow, TableSkeleton } from "../../../../components/ui/Table";
import { Button } from "../../../../components/ui/Button";
import { AlertTriangle, Ban, CheckCircle, FilePenLine, Trash2 } from "lucide-react";
import { TFunction } from "i18next";
import { IManagerData } from "../../../../interfaces";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import { StatusBadge } from "../../../../components/ui/StatusBadge";
import { truncateText } from "../../../../utils";
import { MANAGER_TABLE_COLUMNS, MANAGER_TRANSLATION_NAMESPACE } from "..";
import { HasPermission } from "../../../../components/auth";
import { selectRole } from "../../../../context/slices/userSlice";
import { useLanguageStore } from "../../../../store/language.store";

interface IManagersTableProps {
  managers: IManagerData[];
  isLoading: boolean;
  t: TFunction;
  handleDeleteManager: (id: string) => void;
  handleUnblockManager: (id: string) => void;
}

const ManagersTable = ({ managers, t, isLoading, handleDeleteManager, handleUnblockManager }: IManagersTableProps) => {
  const { language } = useLanguageStore();
  const userRole = useSelector(selectRole());

  const columns = useMemo(
    () => MANAGER_TABLE_COLUMNS.map(key => t(key, { ns: MANAGER_TRANSLATION_NAMESPACE })),
    [t]
  );
  
  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {managers.length == 0 ? (
            <NoDataMessage title={t("manageManagersPage.table.emptyTable.title", { ns: MANAGER_TRANSLATION_NAMESPACE })} message={t("manageManagersPage.table.emptyTable.message", { ns: MANAGER_TRANSLATION_NAMESPACE })} />
          ) : (
            managers.map(({ id, username, email, department, isBlocked, createdAt }: IManagerData) => (
              <TableRow key={id} className="border-b">
                <TableCell label={columns[0]}>{truncateText(username, 20)}</TableCell>
                <TableCell label={columns[1]}>
                  {truncateText(email, 20)}
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
                        t("manageManagersPage.table.isBlocked.blocked", { ns: MANAGER_TRANSLATION_NAMESPACE })
                        : t("manageManagersPage.table.isBlocked.notBlocked", { ns: MANAGER_TRANSLATION_NAMESPACE })
                    }
                  </StatusBadge>
                </TableCell>
                <TableCell label={columns[4]}>
                  {new Date(createdAt).toLocaleDateString(language == "ar" ? "ar-EG" : "en-CA")}
                </TableCell>
                <TableCell label={columns[5]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="Update Manager">
                      <NavLink to={`/${userRole}/edit-manager/${id}`}>
                        <Button 
                          variant="info" 
                          fullWidth={false}
                          size={"sm"} 
                          icon={<FilePenLine className="w-full h-full" />} 
                          aria-label={t("buttons.edit")} 
                        />
                      </NavLink>
                    </HasPermission>
                    <HasPermission permission="Delete Manager">
                      <Button
                        variant="danger"
                        fullWidth={false}
                        size={"sm"}
                        icon={<Trash2 className="w-full h-full" />}
                        aria-label={t("buttons.delete")}
                        onClick={() => handleDeleteManager(id)}
                      />
                    </HasPermission>
                    <HasPermission permission="Unlock Account">
                      {
                        isBlocked &&
                          <Button
                            variant="black"
                            fullWidth={false}
                            size={"sm"}
                            icon={<Ban className="w-full h-full" />}
                            aria-label={t("buttons.delete")}
                            onClick={() => handleUnblockManager(id)}
                          />
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
