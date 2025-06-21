import { Button, NoDataMessage, Table, TableCell, TableRow, TableSkeleton, Tooltip } from "../../../../components/ui";
import { FilePenLine, Trash2 } from "lucide-react";
import { ProfileData } from "../../../../interfaces";
import { NavLink } from "react-router";
import { HasPermission } from "../../../../components/auth";
import { useLanguageStore } from "../../../../store/";
import { PROFILE_NS } from "../../../../constants";
import { useTranslation } from "react-i18next";
import { formatValue } from "../../../../utils";

interface IProfilesTableProps {
  profiles: ProfileData[];
  isLoading: boolean;
  handleDelete: (id: string) => void;
}

const ProfilesTable = ({ profiles, isLoading, handleDelete }: IProfilesTableProps) => {
  const { t } = useTranslation([PROFILE_NS]);

  const { language } = useLanguageStore();

  const PROFILE_TABLE_COLUMNS = [
    "table.columns.id",
    "table.columns.nameEn",
    "table.columns.nameAr",
    "table.columns.createdAt",
    "table.columns.actions",
  ]

  const columns = PROFILE_TABLE_COLUMNS.map(key => t(key));

  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {profiles.length == 0 ? (
            <NoDataMessage title={t("table.emptyTable.title")} message={t("table.emptyTable.message")} />
          ) : (
            profiles.map((profile) => (
              <TableRow key={profile.id} className="border-b">
                <TableCell label={columns[0]}>{formatValue(profile.id, language)}</TableCell>
                <TableCell label={columns[1]}>{profile.nameEn || t("NA")}</TableCell>
                <TableCell label={columns[2]}>{profile.nameAr || t("NA")}</TableCell>
                <TableCell label={columns[3]}>{new Date(profile.createdAt).toLocaleDateString(language == "ar" ? "ar-EG" : "en-CA")}</TableCell>
                <TableCell label={columns[4]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="View Profiles">
                      <Tooltip 
                        content={t("buttons.toolTipEdit")}
                      >
                        <NavLink to={`/admin/edit-profile/${profile.id}`}>
                          <Button 
                            variant="info" 
                            fullWidth={false}
                            size={"sm"} 
                            icon={<FilePenLine className="w-full h-full" />} 
                          />
                        </NavLink>
                      </Tooltip>
                    </HasPermission>
                    <HasPermission permission="Delete Profile">
                      <Tooltip 
                        content={t("buttons.toolTipDelete")}
                      >
                        <Button
                          variant="danger"
                          fullWidth={false}
                          size={"sm"}
                          icon={<Trash2 className="w-full h-full" />}
                          onClick={() => handleDelete(profile.id)}
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

export default ProfilesTable;
