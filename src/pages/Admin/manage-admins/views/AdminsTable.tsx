import { useMemo } from "react";
import { NoDataMessage, Table, TableCell, TableRow, TableSkeleton } from "../../../../components/ui/Table";
import { Button } from "../../../../components/ui/Button";
import { AlertTriangle, Ban, CheckCircle, FilePenLine, Trash2 } from "lucide-react";
import { TFunction } from "i18next";
import { IAdminData } from "../../../../interfaces";
import { NavLink } from "react-router";
import { StatusBadge } from "../../../../components/ui/StatusBadge";
import { truncateText } from "../../../../utils";
import { ADMIN_TABLE_COLUMNS, ADMIN_TRANSLATION_NAMESPACE } from "..";
import { HasPermission } from "../../../../components/auth";
import { useLanguageStore } from "../../../../store/language.store";
import { Tooltip } from "../../../../components/ui";

interface IAdminsTableProps {
  admins: IAdminData[]; // Array of admin data to display in the table
  isLoading: boolean; // Boolean indicating if the table data is loading
  t: TFunction; // Translation function for internationalization
  handleDeleteAdmin: (id: string) => void; // Function to handle admin deletion
  handleUnblockAdmin: (id: string) => void; // Function to handle unblocking an admin
}

const AdminsTable = ({ admins, t, isLoading, handleDeleteAdmin, handleUnblockAdmin }: IAdminsTableProps) => {

    const { language } = useLanguageStore(); // Get current language from Redux store

  const columns = useMemo(
    () => ADMIN_TABLE_COLUMNS.map(key => t(key, { ns: ADMIN_TRANSLATION_NAMESPACE })),
    [t]
  );

  return (
    <>
      {/* Show a skeleton loader while data is loading */}
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        // Render the table with actual data once loading is complete
        <Table columns={columns}>
          {/* If no admins, show a no data message */}
          {admins.length == 0 ? (
            <NoDataMessage 
              title={t("manageAdminsPage.table.emptyTable.title", { ns: ADMIN_TRANSLATION_NAMESPACE })}
              message={t("manageAdminsPage.table.emptyTable.message", { ns: ADMIN_TRANSLATION_NAMESPACE })}
            />
          ) : (
            // Map through admins and display rows
            admins.map(({ id, username, title, email, isBlocked, createdAt }: IAdminData) => (
              <TableRow key={id} className="border-b">
                <TableCell label={columns[0]}>{username}</TableCell> {/* Display username */}
                <TableCell label={columns[1]}>{title}</TableCell> {/* Display title */}
                <TableCell label={columns[2]}>{truncateText(email, 20)}</TableCell> {/* Truncate long email */}
                <TableCell label={columns[3]}>
                  {/* Show the status badge indicating whether admin is blocked */}
                  <StatusBadge
                    variant={isBlocked ? "neutral" : "info"}
                    size={"medium"}
                    icon={isBlocked ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  >
                    {isBlocked ? 
                      t("manageAdminsPage.table.isBlocked.blocked", { ns: ADMIN_TRANSLATION_NAMESPACE }) : 
                      t("manageAdminsPage.table.isBlocked.notBlocked", { ns: ADMIN_TRANSLATION_NAMESPACE })}
                  </StatusBadge>
                </TableCell>
                <TableCell label={columns[4]}>
                  {/* Format and display the creation date based on the selected language */}
                  {new Date(createdAt).toLocaleDateString(language == "ar" ? "ar-EG" : "en-CA")}
                </TableCell>
                <TableCell label={columns[5]}>
                  {/* Render buttons for each row: Edit, Delete, Unblock (if blocked) */}
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="Update Admin">
                      <Tooltip content="Edit Admin">
                        <NavLink to={`/admin/edit-admin/${id}`}>
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
                    <HasPermission permission="Delete Admin">
                      <Tooltip content="Delete Admin">
                        <Button
                          variant="danger"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Trash2 className="w-full h-full" />}
                          aria-label={t("buttons.delete")}
                          onClick={() => handleDeleteAdmin(id)} // Handle delete action
                        />
                      </Tooltip>
                    </HasPermission>
                    {/* Show Unblock button only if the admin is blocked */}
                    <HasPermission permission="Unlock Account">
                      {isBlocked && (
                        <Tooltip content="Unblock Admin">
                          <Button
                            variant="black"
                            fullWidth={false}
                            size={"sm"}
                            icon={<Ban className="w-full h-full" />}
                            onClick={() => handleUnblockAdmin(id)} // Handle unblock action
                          />
                        </Tooltip>
                      )}
                    </HasPermission>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </Table>
      )}
    </>
  );
};

export default AdminsTable;
