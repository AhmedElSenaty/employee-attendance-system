import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useGetEmployeesList } from "../../../../hooks";
import { IAssignMissionRequestCredentials } from "../../../../interfaces";
import {
  Field,
  Input,
  InputErrorMessage,
  InputSkeleton,
  Label,
  LabelSkeleton,
  SelectBox,
  SelectBoxSkeleton,
  Textarea,
} from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { MISSION_REQUESTS_NS } from "../../../../constants";
import { Calendar } from "lucide-react";
import { MissionRequestType } from "../../../../enums";

interface IInputsProps {
  register: UseFormRegister<IAssignMissionRequestCredentials>;
  errors: FieldErrors<IAssignMissionRequestCredentials>;
  isLoading?: boolean;
}
const AssignInputs = ({ register, errors, isLoading }: IInputsProps) => {
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

      {/* Mission Type */}
      <Field className="space-y-2">
        {isLoading ? (
          <>
            <LabelSkeleton />
            <InputSkeleton />
          </>
        ) : (
          <>
            <Label size="lg">{t("inputs.type.label")}</Label>
            <SelectBox
              {...register("type", { valueAsNumber: true })}
              isError={!!errors.type}
            >
              <option value={-1}>{t("inputs.type.defaultOption")}</option>
              {Object.values(MissionRequestType)
                .filter((v) => typeof v === "number")
                .map((type) => (
                  <option key={type} value={type}>
                    {t(`dayType.${type}`)}
                  </option>
                ))}
            </SelectBox>

            {errors.type && (
              <InputErrorMessage>
                {t(`inputs.type.validation.${errors.type.type}`)}
              </InputErrorMessage>
            )}
          </>
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
