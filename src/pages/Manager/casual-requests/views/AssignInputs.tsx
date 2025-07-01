import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useGetEmployeesList } from "../../../../hooks";
import { EmployeeSummary, IAssignCasualLeaveRequestCredentials } from "../../../../interfaces";
import { Field, Input, InputErrorMessage, Label, SelectBox, SelectBoxSkeleton, Textarea } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { CASUAL_REQUESTS_NS } from "../../../../constants";
import { Calendar } from "lucide-react";

interface IInputsProps {
  register: UseFormRegister<IAssignCasualLeaveRequestCredentials>;
  errors: FieldErrors<IAssignCasualLeaveRequestCredentials>;
}
const AssignInputs = ({
  register,
  errors,
}: IInputsProps) => {
  const { t } = useTranslation([CASUAL_REQUESTS_NS]);

  const { employeesList, isLoading: isEmployeesListLoading } = useGetEmployeesList();

  return (
    <>
      {/* Employee ID */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.employeeId.label")}</Label>
        {isEmployeesListLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <SelectBox isError={!!errors.employeeId} {...register("employeeId")}>
            <option value="
            
            
            ">{t("inputs.employeeId.defaultValue")}</option>
            {employeesList?.map((employee: EmployeeSummary) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </SelectBox>
        )}
        {errors.employeeId && (
          <InputErrorMessage>
            {t(`inputs.employeeId.inputValidation.${errors.employeeId?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      <Field className="space-y-2">
        <Label size="lg">{t("inputs.startDate.label")}</Label>
        <Input
          type="date"
          placeholder="YYYY-MM-DD"
          isError={!!errors.startDate}
          icon={<Calendar />}
          {...register("startDate")}
        />
        {errors.startDate && (
          <InputErrorMessage>
            {t(`inputs.startDate.validation.${errors.startDate.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      <Field className="space-y-2">
        <Label size="lg">{t("inputs.endDate.label")}</Label>
        <Input
          type="date"
          placeholder="YYYY-MM-DD"
          isError={!!errors.endDate}
          icon={<Calendar />}
          {...register("endDate")}
        />
        {errors.endDate && (
          <InputErrorMessage>
            {t(`inputs.endDate.validation.${errors.endDate.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      <Field className="space-y-2">
        <Label size="lg">{t("inputs.description.label")}</Label>
        <Textarea
          placeholder={t("inputs.description.placeholder")}
          isError={!!errors.description}
          {...register("description")}
        />
      </Field>
    </>
  )
}

export default AssignInputs
