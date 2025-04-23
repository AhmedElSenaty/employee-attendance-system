import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IEmployeeCredentials } from "../../../../interfaces";
import { TFunction } from "i18next";
import {
  Field,
  InputErrorMessage,
  Label,
  SelectBox,
  SelectBoxSkeleton,
} from "../../../../components/ui/Forms";
import { useDepartmentSubDepartmentsList } from "../../../../hooks/useSubDepartmentHook";
import { useGetDepartmentsList } from "../../../../hooks/useDepartmentHook";
import { useEffect, useState } from "react";
import { EMPLOYEE_TRANSLATION_NAMESPACE } from "..";

interface IRenderEmployeeDepartmentInputsProps {
  register: UseFormRegister<IEmployeeCredentials>;
  errors: FieldErrors<IEmployeeCredentials>;
  t: TFunction;
  isLoading?: boolean;
  selectedDepartmentID?: number
}

const RenderEmployeeDepartmentInputs = ({
  register,
  errors,
  isLoading,
  t,
  selectedDepartmentID = 0
}: IRenderEmployeeDepartmentInputsProps) => {
  const [ selectDepartmentID, setSelectDepartmentID ] = useState(selectedDepartmentID)
  const { departmentsList, isDepartmentsLoading } = useGetDepartmentsList();
  const { subDepartmentsList, isSubDepartmentsLoading } = useDepartmentSubDepartmentsList(Number(selectDepartmentID || ''));

  useEffect(() => {
    setSelectDepartmentID(selectedDepartmentID);
  }, [selectedDepartmentID]);
  
  
  return (
    <>
      <Field className="space-y-3 w-full sm:w-auto flex flex-col">
        <Label size="lg">{t("form.departmentId.label", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</Label>
        {
          isDepartmentsLoading || isLoading ? (
            <SelectBoxSkeleton />
          ) : (
            <SelectBox
              onChange={(e) => setSelectDepartmentID(Number(e.target.value || ''))}
              value={selectDepartmentID || ''}
            >
              <option value="">{t("form.departmentId.defaultValue", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</option>
              {departmentsList?.map((department, idx) => (
                <option key={idx} value={department.id}>
                  {department.name}
                </option>
              ))}
            </SelectBox>
          )
        }
      </Field>

      {/* Delegate */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.delegateId.label", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</Label>
        {
          isSubDepartmentsLoading || isLoading ? (
            <SelectBoxSkeleton />
          ) : (
          <SelectBox
            isError={!!errors["delegateId"]}
            {...register("delegateId")}
          >
            <option value="">{t("form.delegateId.defaultValue", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</option>
            {subDepartmentsList?.map((subDepartment, idx) => (
              <option key={idx} value={subDepartment.id}>
                {subDepartment.name}
              </option>
            ))}
          </SelectBox>
          )
        }
        {errors["delegateId"] && (
          <InputErrorMessage>
            {t(`form.delegateId.inputValidation.${errors["delegateId"].type}`, { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default RenderEmployeeDepartmentInputs;
