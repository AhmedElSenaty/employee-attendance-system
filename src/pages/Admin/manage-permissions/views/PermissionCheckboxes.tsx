// import { Checkbox, CheckboxSkeleton, Field, Label, LabelSkeleton, Button, ButtonSkeleton } from '../../../../components/ui';
// import { Dispatch, SetStateAction } from 'react';
// import { PermissionsData } from '../../../../interfaces';
// import { ListChecks } from 'lucide-react';
// import { useTranslation } from 'react-i18next';
// import { useGetPermissions } from '../../../../hooks/';
// import { useLanguageStore } from '../../../../store/';
// import { PERMISSION_NS } from '../../../../constants';

// interface Props {
//   checked: string[];
//   setChecked: Dispatch<SetStateAction<string[]>>;
//   isLoading?: boolean
// }

// const PermissionCheckboxes = ({ checked, setChecked, isLoading }: Props) => {
//   const { t } = useTranslation([PERMISSION_NS]);
//   const { language } = useLanguageStore();
//   const { permissions, isLoading: isPermissionsDataLoading } = useGetPermissions();

//   const allPermissionIDs = permissions.map((permission: PermissionsData) => permission.id);

//   // Select All / Deselect All handler
//   const toggleSelectAll = () => {
//     if (checked.length === allPermissionIDs.length) {
//       setChecked([]); // Deselect all
//     } else {
//       setChecked(allPermissionIDs); // Select all
//     }
//   };

//   const handleCheckboxChange = (permissionKey: string) => {
//     setChecked((prev) =>
//       prev.includes(permissionKey)
//         ? prev.filter((key) => key !== permissionKey)
//         : [...prev, permissionKey]
//     );
//   };

//   const renderCheckboxes = permissions.map(({ id, nameEn, nameAr }: PermissionsData) => (
//     <Field key={id} className="flex items-center space-x-2">
//       <Checkbox
//         checked={checked.includes(id)}
//         onChange={() => handleCheckboxChange(id)}
//       />
//       <Label>
//         {language == "en" ? nameEn : nameAr }
//       </Label>
//     </Field>
//   ))

//   return (
//     <>
//       <div className="w-full flex flex-col gap-5">
//         <div className="flex-grow">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {isPermissionsDataLoading || isLoading ? (
//               <>
//                 {[...Array(4)].map((_, i) => (
//                   <Field key={i} className="flex items-center space-x-2">
//                     <CheckboxSkeleton />
//                     <LabelSkeleton />
//                   </Field>
//                 ))}
//               </>
//             ) : (
//               renderCheckboxes
//             )}
//           </div>
//         </div>
//         <div className="mt-auto flex justify-end">
//         {
//             isLoading ? (
//               <>
//                 <div className="w-36">
//                   <ButtonSkeleton fullWidth={false} />
//                 </div>
//               </>
//             ) : (
//               <>
//                 <Button
//                   onClick={toggleSelectAll}
//                   type="button"
//                   variant="secondary"
//                   fullWidth={false}
//                   size={'md'}
//                   icon={<ListChecks className="w-full h-full" />}
//                 >
//                   {checked.length === allPermissionIDs.length
//                     ? t("deselectAll")
//                     : t("selectAll")}
//                 </Button>
//               </>
//             )
//           }
//         </div>
//       </div>
//     </>
//   );
// }

// export default PermissionCheckboxes;

import {
  Checkbox,
  CheckboxSkeleton,
  Field,
  Label,
  LabelSkeleton,
  Button,
  ButtonSkeleton,
} from "../../../../components/ui";
import { Dispatch, SetStateAction, useMemo } from "react";
import { PermissionsData } from "../../../../interfaces";
import { ListChecks } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetPermissions } from "../../../../hooks/";
import { useLanguageStore } from "../../../../store/";
import { PERMISSION_NS } from "../../../../constants";

interface Props {
  checked: string[];
  setChecked: Dispatch<SetStateAction<string[]>>;
  isLoading?: boolean;
}

type PermissionGroupView = {
  groupId: number; // ← int
  groupNameEn: string;
  groupNameAr: string;
  items: PermissionsData[];
};
 
const UNGROUPED_ID = -1;

const PermissionCheckboxes = ({ checked, setChecked, isLoading }: Props) => {
  const { t } = useTranslation([PERMISSION_NS]);
  const { language } = useLanguageStore();
  const { permissions, isLoading: isPermissionsDataLoading } =
    useGetPermissions();

  const allPermissionIDs = useMemo(
    () => permissions.map((p: PermissionsData) => p.id),
    [permissions]
  );

  // ---- GROUPING (groupId is number) ----
  const groups: PermissionGroupView[] = useMemo(() => {
    const map = new Map<number, PermissionGroupView>();

    for (const p of permissions as any[]) {
      const rawGroupId = p.groupId ?? p.group?.id;
      const groupId: number =
        typeof rawGroupId === "number"
          ? rawGroupId
          : Number.isFinite(Number(rawGroupId))
          ? Number(rawGroupId)
          : UNGROUPED_ID;

      const groupNameEn = p.groupNameEn ?? p.group?.nameEn ?? "Ungrouped";
      const groupNameAr = p.groupNameAr ?? p.group?.nameAr ?? "غير مُصنَّف";

      if (!map.has(groupId)) {
        map.set(groupId, {
          groupId,
          groupNameEn,
          groupNameAr,
          items: [],
        });
      }
      map.get(groupId)!.items.push(p as PermissionsData);
    }

    return Array.from(map.values()).sort((a, b) =>
      (a.groupNameEn ?? "").localeCompare(b.groupNameEn ?? "")
    );
  }, [permissions]);

  // ---- Global Select/Deselect All ----
  const toggleSelectAll = () => {
    if (checked.length === allPermissionIDs.length) setChecked([]);
    else setChecked(allPermissionIDs);
  };

  // ---- Group Select/Deselect (by numeric id) ----
  const toggleGroup = (groupId: number) => {
    const group = groups.find((g) => g.groupId === groupId);
    if (!group) return;

    const ids = group.items.map((p) => p.id);
    const all = ids.every((id) => checked.includes(id));
    setChecked((prev) =>
      all
        ? prev.filter((id) => !ids.includes(id))
        : Array.from(new Set([...prev, ...ids]))
    );
  };

  const handleCheckboxChange = (permissionId: string) => {
    setChecked((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const busy = isPermissionsDataLoading || isLoading;

  return (
    <div className="w-full flex flex-col gap-6">
      {busy ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border p-4">
              <div className="mb-3 font-semibold text-lg">
                <LabelSkeleton />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...Array(4)].map((_, j) => (
                  <Field key={j} className="flex items-center gap-2">
                    <CheckboxSkeleton />
                    <LabelSkeleton />
                  </Field>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {groups.map((g) => {
            const ids = g.items.map((p) => p.id);
            const all = ids.every((id) => checked.includes(id));
            const some = !all && ids.some((id) => checked.includes(id));

            return (
              <section key={g.groupId} className="rounded-2xl border p-4">
                <header className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {language === "en" ? g.groupNameEn : g.groupNameAr}
                  </h3>
                  <Button
                    type="button"
                    variant={all ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => toggleGroup(g.groupId)}
                  >
                    {all
                      ? t("deselectGroup", { defaultValue: "Deselect group" })
                      : some
                      ? t("completeGroup", { defaultValue: "Select remaining" })
                      : t("selectGroup", { defaultValue: "Select group" })}
                  </Button>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {g.items.map(({ id, nameEn, nameAr }) => (
                    <Field key={id} className="flex items-center gap-2">
                      <Checkbox
                        checked={checked.includes(id)}
                        onChange={() => handleCheckboxChange(id)}
                      />
                      <Label>{language === "en" ? nameEn : nameAr}</Label>
                    </Field>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div className="mt-auto flex justify-end">
        {busy ? (
          <div className="w-36">
            <ButtonSkeleton fullWidth={false} />
          </div>
        ) : (
          <Button
            onClick={toggleSelectAll}
            type="button"
            variant="secondary"
            fullWidth={false}
            size="md"
            icon={<ListChecks className="w-full h-full" />}
          >
            {checked.length === allPermissionIDs.length
              ? t("deselectAll")
              : t("selectAll")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PermissionCheckboxes;
