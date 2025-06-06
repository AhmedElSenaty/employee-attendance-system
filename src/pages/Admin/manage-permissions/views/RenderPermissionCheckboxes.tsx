import { Checkbox, CheckboxSkeleton, Field, Label, LabelSkeleton, Button, ButtonSkeleton } from '../../../../components/ui';
import { Dispatch, SetStateAction } from 'react';
import { IPermissionsData } from '../../../../interfaces/';
import { ListChecks } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGetAllPermissions } from '../../../../hooks/usePermissionHook';
import { useLanguageStore } from '../../../../store/language.store';

interface RenderPermissionCheckboxesProps {
  checkedPermissions: string[];
  setCheckedPermissions: Dispatch<SetStateAction<string[]>>;
  isLoading?: boolean
}

const RenderPermissionCheckboxes = ({ checkedPermissions, setCheckedPermissions, isLoading }: RenderPermissionCheckboxesProps) => {
  const { t } = useTranslation();
    const { language } = useLanguageStore();
  const { permissions, isPermissionsDataLoading } = useGetAllPermissions();

  const allPermissionIDs = permissions.map((permission) => permission.id);

  // Select All / Deselect All handler
  const toggleSelectAll = () => {
    if (checkedPermissions.length === allPermissionIDs.length) {
      setCheckedPermissions([]); // Deselect all
    } else {
      setCheckedPermissions(allPermissionIDs); // Select all
    }
  };


  const handleCheckboxChange = (permissionKey: string) => {
    setCheckedPermissions((prev) =>
      prev.includes(permissionKey)
        ? prev.filter((key) => key !== permissionKey)
        : [...prev, permissionKey]
    );
  };

  const renderCheckboxes = permissions.map(({ id, nameEn, nameAr }: IPermissionsData) => (
    <Field key={id} className="flex items-center space-x-2">
      <Checkbox
        checked={checkedPermissions.includes(id)}
        onChange={() => handleCheckboxChange(id)}
      />
      <Label>
        {language == "en" ? nameEn : nameAr }
      </Label>
    </Field>
  ))

  return (
    <>
      <div className="w-full flex flex-col gap-5">
        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isPermissionsDataLoading || isLoading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <Field key={i} className="flex items-center space-x-2">
                    <CheckboxSkeleton />
                    <LabelSkeleton />
                  </Field>
                ))}
              </>
            ) : (
              renderCheckboxes
            )}
          </div>
        </div>
        <div className="mt-auto flex justify-end">
        {
            isLoading ? (
              <>
                <div className="w-36">
                  <ButtonSkeleton fullWidth={false} />
                </div>
              </>
            ) : (
              <>
                <Button
                  onClick={toggleSelectAll}
                  type="button"
                  variant="secondary"
                  fullWidth={false}
                  size={'md'}
                  icon={<ListChecks className="w-full h-full" />}
                >
                  {checkedPermissions.length === allPermissionIDs.length
                    ? t("deselectAll")
                    : t("selectAll")}
                </Button>
              </>
            )
          }
        </div>
      </div>
    </>
  );
}

export default RenderPermissionCheckboxes;
