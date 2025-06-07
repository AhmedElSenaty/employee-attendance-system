import { useGetDepartmentsList } from '../../../../hooks/department.hooks';
import { Checkbox, CheckboxSkeleton, Field, Label, LabelSkeleton, Radio, RadioSkeleton, Button, ButtonSkeleton } from '../../../../components/ui';
import { Dispatch, SetStateAction } from 'react';
import { IDepartment } from '../../../../interfaces';
import { ListChecks } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RenderDepartmentCheckboxesProps {
  checkedDepartments: number[];
  setCheckedDepartments: Dispatch<SetStateAction<number[]>>;
  isLoading?: boolean
  needSelectOne?: boolean
}

const RenderDepartmentCheckboxes = ({ checkedDepartments, setCheckedDepartments, isLoading, needSelectOne = false }: RenderDepartmentCheckboxesProps) => {
  const { t } = useTranslation();
  const { departmentsList, isDepartmentsLoading } = useGetDepartmentsList();

  const alldepartmentIDs = departmentsList.map((department) => department.id);

  // Select All / Deselect All handler
  const toggleSelectAll = () => {
    if (checkedDepartments.length === alldepartmentIDs.length) {
      setCheckedDepartments([]); // Deselect all
    } else {
      setCheckedDepartments(alldepartmentIDs); // Select all
    }
  };

  const handleDepartmentSelect = (departmentID: number) => {
    if (needSelectOne) {
      setCheckedDepartments([departmentID]);
    } else {
      setCheckedDepartments((prev) =>
        prev.includes(departmentID)
          ? prev.filter((key) => key !== departmentID)
          : [...prev, departmentID]
      );
    }
  };

  const renderDepartmentFields = departmentsList.map(({ id, name }: IDepartment) => (
    <Field key={id} className="flex items-center space-x-2">
      {needSelectOne ? (
        <Radio
          checked={checkedDepartments.includes(id)}
          onChange={() => handleDepartmentSelect(id)}
          name="departmentRadio"
        />
      ) : (
        <Checkbox
          checked={checkedDepartments.includes(id)}
          onChange={() => handleDepartmentSelect(id)}
        />
      )}
      <Label>{name}</Label>
    </Field>
  ));
  

  return (
    <>
      <div className="w-full flex flex-col gap-5">
        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isDepartmentsLoading || isLoading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <Field key={i} className="flex items-center space-x-2">
                    {
                      needSelectOne ? (
                        <RadioSkeleton />
                      ) : (
                        <CheckboxSkeleton />
                      )
                    }
                    <LabelSkeleton />
                  </Field>
                ))}
              </>
            ) : (
              renderDepartmentFields
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
                {!needSelectOne && (
                  <Button
                    onClick={toggleSelectAll}
                    type="button"
                    variant="secondary"
                    fullWidth={false}
                    size={'md'}
                    icon={<ListChecks className="w-full h-full" />}
                  >
                    {checkedDepartments.length === alldepartmentIDs.length
                      ? t("deselectAll")
                      : t("selectAll")}
                  </Button>
                )}
              </>
            )
          }
        </div>
      </div>
    </>
  );
}

export default RenderDepartmentCheckboxes;
