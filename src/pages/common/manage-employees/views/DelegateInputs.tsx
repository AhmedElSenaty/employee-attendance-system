import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import {
  CustomSelect,
  Field,
  InputErrorMessage,
  Label,
  SelectBoxSkeleton,
} from "../../../../components/ui";
import { useGetDepartmentsList, useGetDepartmentSubDepartments } from "../../../../hooks/";
import { useEffect, useMemo, useState } from "react";
import { EmployeeFormValues } from "../../../../validation";
import { useTranslation } from "react-i18next";
import { EMPLOYEE_NS } from "../../../../constants";
import { DepartmentSummary, SubDepartmentSummary } from "../../../../interfaces";

interface Props {
  register: UseFormRegister<EmployeeFormValues>;
  errors: FieldErrors<EmployeeFormValues>;
  isLoading?: boolean;
  selectedDepartmentID?: number
  control: Control<EmployeeFormValues>
}

const RenderEmployeeDepartmentInputs = ({
  errors,
  isLoading,
  selectedDepartmentID = 0,
  control
}: Props) => {
  const { t } = useTranslation([EMPLOYEE_NS]);

  const [selectDepartmentID, setSelectDepartmentID] = useState<number | null>(
    selectedDepartmentID || null
  );

  const { departmentsList, isLoading: isDepartmentsLoading } = useGetDepartmentsList();
  const { subDepartmentsList, isLoading: isSubDepartmentsLoading } =
    useGetDepartmentSubDepartments(Number(selectDepartmentID || ""));

  useEffect(() => {
    setSelectDepartmentID(selectedDepartmentID || null);
  }, [selectedDepartmentID]);

  const departmentOptions = useMemo(
    () =>
      departmentsList?.map((department: DepartmentSummary) => ({
        value: department.id,
        label: department.name,
      })) || [],
    [departmentsList]
  );

  const selectedDepartment = departmentOptions.find(
    (opt: { value: number }) => opt.value === selectDepartmentID
  ) || null;

  const subDepartmentOptions = useMemo(
    () =>
      subDepartmentsList?.map((sub: SubDepartmentSummary) => ({
        value: sub.id,
        label: sub.name,
      })) || [],
    [subDepartmentsList]
  );

  
  return (
    <>
      {/* Department Select */}
      <Field className="space-y-3 w-full sm:w-auto flex flex-col">
        <Label size="lg">{t("inputs.departmentId.label")}</Label>
        {isDepartmentsLoading || isLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <CustomSelect
            options={departmentOptions}
            value={selectedDepartment}
            onChange={(option) => setSelectDepartmentID(option?.value as number)}
            className="w-full"
          />
        )}
      </Field>

      {/* SubDepartment Select */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.delegateId.label")}</Label>
        {isSubDepartmentsLoading || isLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <>
            <Controller
              name="delegateId"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  className="w-full"
                  options={subDepartmentOptions}
                  value={subDepartmentOptions.find((opt: {value: number, label: string}) => String(opt.value) === String(field.value)) || null}
                  onChange={(option) => field.onChange(option?.value)}
                  error={!!errors.delegateId}
                />
              )}
            />
            {errors["delegateId"] && (
              <InputErrorMessage>
                {t(
                  `inputs.delegateId.inputValidation.${errors["delegateId"].type}`
                )}
              </InputErrorMessage>
            )}
          </>
        )}
      </Field>
    </>
  );
};

export default RenderEmployeeDepartmentInputs;
