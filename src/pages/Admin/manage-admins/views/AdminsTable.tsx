import {
  Button,
  NoDataMessage,
  Table,
  TableCell,
  TableRow,
  TableSkeleton,
  StatusBadge,
  Tooltip,
} from "../../../../components/ui";
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  FilePenLine,
  Trash2,
} from "lucide-react";
import { AdminData } from "../../../../interfaces";
import { NavLink } from "react-router";
import { truncateText } from "../../../../utils";
import { HasPermission } from "../../../../components/auth";
import { useTranslation } from "react-i18next";
import { ADMIN_NS } from "../../../../constants";
import { useLanguageStore } from "../../../../store";

interface Props {
  admins: AdminData[];
  isLoading: boolean;
  handleDelete: (id: string) => void;
  handleUnblock: (id: string) => void;
}

const AdminsTable = ({
  admins,
  isLoading,
  handleDelete,
  handleUnblock,
}: Props) => {
  const { t } = useTranslation([ADMIN_NS]);
  const { language } = useLanguageStore();

  const ADMIN_TABLE_COLUMNS = [
    "table.columns.username",
    "table.columns.title",
    "table.columns.email",
    "table.columns.isBlocked",
    "table.columns.createdAt",
    "table.columns.actions",
  ];

  const columns = ADMIN_TABLE_COLUMNS.map((key) => t(key));

  return (
    <>
      {/* Show a skeleton loader while data is loading */}
      {isLoading ? (
        <TableSkeleton
          numberOfColumns={columns.length}
          defaultNumberOfRows={5}
        />
      ) : (
        // Render the table with actual data once loading is complete
        <Table columns={columns}>
          {/* If no admins, show a no data message */}
          {admins.length == 0 ? (
            <NoDataMessage
              title={t("table.emptyTable.title")}
              message={t("table.emptyTable.message")}
            />
          ) : (
            // Map through admins and display rows
            admins.map(
              ({
                id,
                username,
                title,
                email,
                isBlocked,
                createdAt,
              }: AdminData) => (
                <TableRow key={id} className="border-b">
                  <TableCell label={columns[0]}>{username}</TableCell>{" "}
                  {/* Display username */}
                  <TableCell label={columns[1]}>{title}</TableCell>{" "}
                  {/* Display title */}
                  <TableCell label={columns[2]}>
                    {truncateText(email, 20)}
                  </TableCell>{" "}
                  {/* Truncate long email */}
                  <TableCell label={columns[3]}>
                    {/* Show the status badge indicating whether admin is blocked */}
                    <StatusBadge
                      variant={isBlocked ? "neutral" : "info"}
                      size={"medium"}
                      icon={
                        isBlocked ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )
                      }
                    >
                      {isBlocked
                        ? t("table.isBlocked.blocked")
                        : t("table.isBlocked.notBlocked")}
                    </StatusBadge>
                  </TableCell>
                  <TableCell label={columns[4]}>
                    {/* Format and display the creation date based on the selected language */}
                    {new Date(createdAt).toLocaleDateString(
                      language == "ar" ? "ar-EG" : "en-CA"
                    )}
                  </TableCell>
                  <TableCell label={columns[5]}>
                    {/* Render buttons for each row: Edit, Delete, Unblock (if blocked) */}
                    <div className="flex flex-wrap gap-2">
                      <HasPermission permission="Update Admin">
                        <Tooltip content={t("buttons.editToolTip")}>
                          <NavLink to={`/admin/edit-admin/${id}`}>
                            <Button
                              variant="info"
                              fullWidth={false}
                              size={"sm"}
                              icon={<FilePenLine className="w-full h-full" />}
                            />
                          </NavLink>
                        </Tooltip>
                      </HasPermission>
                      <HasPermission permission="Delete Admin">
                        <Tooltip content={t("buttons.deleteToolTip")}>
                          <Button
                            variant="danger"
                            fullWidth={false}
                            size={"sm"}
                            icon={<Trash2 className="w-full h-full" />}
                            onClick={() => handleDelete(id)} // Handle delete action
                          />
                        </Tooltip>
                      </HasPermission>
                      {/* Show Unblock button only if the admin is blocked */}
                      <HasPermission permission="Unlock Account">
                        {isBlocked && (
                          <Tooltip content={t("buttons.unblockToolTip")}>
                            <Button
                              variant="black"
                              fullWidth={false}
                              size={"sm"}
                              icon={<Ban className="w-full h-full" />}
                              onClick={() => handleUnblock(id)} // Handle unblock action
                            />
                          </Tooltip>
                        )}
                      </HasPermission>
                    </div>
                  </TableCell>
                </TableRow>
              )
            )
          )}
        </Table>
      )}
    </>
  );
};

export default AdminsTable;
