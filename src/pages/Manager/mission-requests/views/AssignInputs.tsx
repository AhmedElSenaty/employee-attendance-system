import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useGetEmployeesList } from "../../../../hooks";
import { IAssignMissionRequestCredentials } from "../../../../interfaces";
import { Field, Input, InputErrorMessage, Label, SelectBox, SelectBoxSkeleton, Textarea } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { MISSION_REQUESTS_NS } from "../../../../constants";
import { Calendar, Timer } from "lucide-react";

interface IInputsProps {
  register: UseFormRegister<IAssignMissionRequestCredentials>;
  errors: FieldErrors<IAssignMissionRequestCredentials>;
}
const AssignInputs = ({
  register,
  errors,
}: IInputsProps) => {
  const { t } = useTranslation([MISSION_REQUESTS_NS]);

  const { employeesList, isEmployeesListLoading } = useGetEmployeesList();

  return (
    <>
      {/* Employee ID */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.employeeId.label")}</Label>
        {isEmployeesListLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <SelectBox isError={!!errors.employeeId} {...register("employeeId")}>
            <option value="">{t("inputs.employeeId.defaultValue")}</option>
            {employeesList?.map((employee, idx) => (
              <option key={idx} value={employee.id}>
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

      {/* Attendance Date */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.date.label")}</Label>
        <Input
          type="date"
          placeholder={t("inputs.date.placeholder")}
          isError={!!errors.date}
          icon={<Calendar />}
          {...register("date")}
        />
        {errors.date && (
          <InputErrorMessage>
            {t(`inputs.date.inputValidation.${errors.date?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Attendance Time */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.startTime.label")}</Label>
        <Input
          type="time"
          placeholder={t("inputs.startTime.placeholder")}
          isError={!!errors.startTime}
          icon={<Timer />}
          {...register("startTime")}
        />
        {errors.startTime && (
          <InputErrorMessage>
            {t(`inputs.startTime.inputValidation.${errors.startTime?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Attendance Time */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.endTime.label")}</Label>
        <Input
          type="time"
          placeholder={t("inputs.endTime.placeholder")}
          isError={!!errors.endTime}
          icon={<Timer />}
          {...register("endTime")}
        />
        {errors.endTime && (
          <InputErrorMessage>
            {t(`inputs.endTime.inputValidation.${errors.endTime?.type}`)}
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
