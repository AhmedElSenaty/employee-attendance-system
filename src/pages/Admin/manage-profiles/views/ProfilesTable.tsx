import { useMemo } from "react";
import { NoDataMessage, Table, TableCell, TableRow, TableSkeleton } from "../../../../components/ui/Table";
import { Button } from "../../../../components/ui/Button";
import { FilePenLine, Trash2 } from "lucide-react";
import { TFunction } from "i18next";
import { IProfileData } from "../../../../interfaces";
import { NavLink } from "react-router";
import { PROFILE_TABLE_COLUMNS, PROFILE_TRANSLATION_NAMESPACE } from "..";
import { HasPermission } from "../../../../components/auth";
import { useLanguageStore } from "../../../../store/language.store";

interface IProfilesTableProps {
  profiles: IProfileData[];
  isLoading: boolean;
  t: TFunction;
  handleDeleteProfile: (id: string) => void;
}

const ProfilesTable = ({ profiles, t, isLoading, handleDeleteProfile }: IProfilesTableProps) => {
    const { language } = useLanguageStore();

  const columns = useMemo(
    () => PROFILE_TABLE_COLUMNS.map(key => t(key, { ns: PROFILE_TRANSLATION_NAMESPACE })),
    [t]
  );

  return (
    <>
      {isLoading ? (
        <TableSkeleton numberOfColumns={columns.length} defaultNumberOfRows={5} />
      ) : (
        <Table columns={columns}>
          {profiles.length == 0 ? (
            <NoDataMessage title={t("manageProfilesPage.table.emptyTable.title", { ns: PROFILE_TRANSLATION_NAMESPACE })} message={t("manageProfilesPage.table.emptyTable.message", { ns: PROFILE_TRANSLATION_NAMESPACE })} />
          ) : (
            profiles.map((profile) => (
              <TableRow key={profile.id} className="border-b">
                <TableCell label={columns[0]}>{profile.id}</TableCell>
                <TableCell label={columns[1]}>{profile.nameEn}</TableCell>
                <TableCell label={columns[2]}>{profile.nameAr}</TableCell>
                <TableCell label={columns[3]}>{new Date(profile.createdAt).toLocaleDateString(language == "ar" ? "ar-EG" : "en-CA")}</TableCell>
                <TableCell label={columns[4]}>
                  <div className="flex flex-wrap gap-2">
                    <HasPermission permission="View Profiles">
                      <NavLink to={`/admin/edit-profile/${profile.id}`}>
                        <Button 
                          variant="info" 
                          fullWidth={false}
                          size={"sm"} 
                          icon={<FilePenLine className="w-full h-full" />} 
                          aria-label={t("buttons.edit")} 
                        />
                      </NavLink>
                    </HasPermission>
                    <HasPermission permission="Delete Profile">
                      <Button
                        variant="danger"
                        fullWidth={false}
                        size={"sm"}
                        icon={<Trash2 className="w-full h-full" />}
                        aria-label={t("buttons.delete")}
                        onClick={() => handleDeleteProfile(profile.id)}
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

export default ProfilesTable;
