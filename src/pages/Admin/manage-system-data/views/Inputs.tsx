import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Description, DescriptionSkeleton, Field, Input, InputErrorMessage, InputSkeleton, Label, LabelSkeleton } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { SYSTEM_DATA_NS } from "../../../../constants";
import { SystemDataFormValues } from "../../../../validation";

interface InputsProps {
  register: UseFormRegister<SystemDataFormValues>;
  errors: FieldErrors<SystemDataFormValues>;
  isLoading: boolean;
}

const Inputs = ({ register, errors, isLoading }: InputsProps) => {
  const { t } = useTranslation([SYSTEM_DATA_NS]);

  if (isLoading) {
    return (
      <>
        {Array.from({ length: 7 }).map((_, index) => (
          <Field key={index} className="space-y-2">
            <LabelSkeleton />
            <InputSkeleton />
            <DescriptionSkeleton />
          </Field>
        ))}
      </>
    );
  }

  return (
    <>
      {/* max_time_To_attend */}
      <Field className="space-y-2">
        <Label>{t("inputs.max_time_To_attend.label")}</Label>
        <Input
          type="time"
          isError={!!errors.max_time_To_attend}
          {...register("max_time_To_attend")}
        />
        <Description>{t("inputs.max_time_To_attend.description")}</Description>
        {errors.max_time_To_attend && (
          <InputErrorMessage>
            {t(`inputs.max_time_To_attend.inputValidation.${errors.max_time_To_attend.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* min_time_To_Go */}
      <Field className="space-y-2">
        <Label>{t("inputs.min_time_To_Go.label")}</Label>
        <Input
          type="time"
          isError={!!errors.min_time_To_Go}
          {...register("min_time_To_Go")}
        />
        <Description>{t("inputs.min_time_To_Go.description")}</Description>
        {errors.min_time_To_Go && (
          <InputErrorMessage>
            {t(`inputs.min_time_To_Go.inputValidation.${errors.min_time_To_Go.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Number fields */}
      {[
        "annualVacationMax10Years",
        "annualVacationTillAgeIs50Years",
        "annualVacationAfterAgeIs50Years",
        "maxNumberOfLeavesRequestPerMonth",
        "maxDaysInCasulVaccationPerYear",
      ].map((field) => (
        <Field key={field} className="space-y-2">
          <Label>{t(`inputs.${field}.label`)}</Label>
          <Input
            type="number"
            isError={!!errors[field as keyof SystemDataFormValues]}
            {...register(field as keyof SystemDataFormValues)}
          />
          <Description>{t(`inputs.${field}.description`)}</Description>
          {errors[field as keyof SystemDataFormValues] && (
            <InputErrorMessage>
              {t(`inputs.${field}.inputValidation.${errors[field as keyof SystemDataFormValues]?.type}`)}
            </InputErrorMessage>
          )}
        </Field>
      ))}
    </>
  );
};

export default Inputs;
