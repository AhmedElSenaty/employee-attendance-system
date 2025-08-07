import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { useGetEmployeesList } from "../../../../hooks";
import {
  EmployeeSummary,
  IAssignCasualLeaveRequestCredentials,
} from "../../../../interfaces";
import {
  CustomSelect,
  Field,
  Input,
  InputErrorMessage,
  Label,
  SelectBoxSkeleton,
  Textarea,
} from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { CASUAL_REQUESTS_NS } from "../../../../constants";
import { Calendar } from "lucide-react";

interface IInputsProps {
  register: UseFormRegister<IAssignCasualLeaveRequestCredentials>;
  errors: FieldErrors<IAssignCasualLeaveRequestCredentials>;
  control: Control<IAssignCasualLeaveRequestCredentials>;
}
const AssignInputs = ({ register, errors, control }: IInputsProps) => {
  const { t } = useTranslation([CASUAL_REQUESTS_NS]);
  const { employeesList, isLoading: isEmployeesListLoading } =
    useGetEmployeesList();
  const employeeOptions =
    employeesList?.map((employee: EmployeeSummary) => ({
      value: employee.id,
      label: employee.name,
    })) || [];
  return (
    <>
      {/* Employee ID */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.employeeId.label")}</Label>
        {isEmployeesListLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <Controller
            name="employeeId"
            control={control}
            render={({ field }) => (
              <CustomSelect
                className="w-full"
                options={employeeOptions}
                value={
                  employeeOptions.find((opt) => opt.value === field.value) ||
                  null
                }
                onChange={(option) => field.onChange(option?.value)}
                error={!!errors.employeeId}
                isSearchable
                isClearable
              />
            )}
          />
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
  );
};

export default AssignInputs;
