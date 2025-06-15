import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ISystemDataCredentials } from "../../../../interfaces";
import { Description, DescriptionSkeleton, Field, Input, InputErrorMessage, InputSkeleton, Label, LabelSkeleton } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { SYSTEM_DATA_NS } from "../../../../constants";

interface InputsProps {
  register: UseFormRegister<ISystemDataCredentials>;
  errors: FieldErrors<ISystemDataCredentials>;
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
        <Label>{t("form.max_time_To_attend.label")}</Label>
        <Input
          type="time"
          isError={!!errors.max_time_To_attend}
          {...register("max_time_To_attend")}
        />
        <Description>{t("form.max_time_To_attend.description")}</Description>
        {errors.max_time_To_attend && (
          <InputErrorMessage>
            {t(`form.max_time_To_attend.inputValidation.${errors.max_time_To_attend.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* min_time_To_Go */}
      <Field className="space-y-2">
        <Label>{t("form.min_time_To_Go.label")}</Label>
        <Input
          type="time"
          isError={!!errors.min_time_To_Go}
          {...register("min_time_To_Go")}
        />
        <Description>{t("form.min_time_To_Go.description")}</Description>
        {errors.min_time_To_Go && (
          <InputErrorMessage>
            {t(`form.min_time_To_Go.inputValidation.${errors.min_time_To_Go.type}`)}
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
          <Label>{t(`form.${field}.label`)}</Label>
          <Input
            type="number"
            isError={!!errors[field as keyof ISystemDataCredentials]}
            {...register(field as keyof ISystemDataCredentials)}
          />
          <Description>{t(`form.${field}.description`)}</Description>
          {errors[field as keyof ISystemDataCredentials] && (
            <InputErrorMessage>
              {t(`form.${field}.inputValidation.${errors[field as keyof ISystemDataCredentials]?.type}`)}
            </InputErrorMessage>
          )}
        </Field>
      ))}
    </>
  );
};

export default Inputs;
