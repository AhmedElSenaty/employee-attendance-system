import { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  Field,
  Input,
  InputErrorMessage,
  InputSkeleton,
  Label,
  LabelSkeleton
} from "../../../../components/ui/Forms";
import { TFunction } from "i18next";
import { IOfficialVacationCredentials } from "../../../../interfaces";
import { Calendar } from "lucide-react";
import { OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE } from "..";

interface IOfficialVacationInputsProps {
  register: UseFormRegister<IOfficialVacationCredentials>;
  errors: FieldErrors<IOfficialVacationCredentials>;
  t: TFunction;
  isLoading?: boolean;
}

const RenderOfficialVacationInputs = ({
  register,
  errors,
  t,
  isLoading
}: IOfficialVacationInputsProps) => {
  if (isLoading) {
    return (
      <>
        <Field className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
        <Field className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
        <Field className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
      </>
    );
  }

  return (
    <>
      {/* Name Field */}
      <Field className="space-y-2">
        <Label size="lg">
          {t("form.name.label", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
        </Label>
        <Input
          type="text"
          placeholder={t("form.name.placeholder", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
          isError={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <InputErrorMessage>
            {t(`form.name.inputValidation.${errors.name?.type}`, {
              ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE
            })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Start Date Field */}
      <Field className="space-y-2">
        <Label size="lg">
          {t("form.startDate.label", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
        </Label>
        <Input
          type="date"
          placeholder={t("form.startDate.placeholder", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
          isError={!!errors.startDate}
          icon={<Calendar />}
          {...register("startDate")}
        />
        {errors.startDate && (
          <InputErrorMessage>
            {t(`form.startDate.inputValidation.${errors.startDate?.type}`, {
              ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE
            })}
          </InputErrorMessage>
        )}
      </Field>

      {/* End Date Field */}
      <Field className="space-y-2">
        <Label size="lg">
          {t("form.endDate.label", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
        </Label>
        <Input
          type="date"
          placeholder={t("form.endDate.placeholder", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
          isError={!!errors.endDate}
          icon={<Calendar />}
          {...register("endDate")}
        />
        {errors.endDate && (
          <InputErrorMessage>
            {t(`form.endDate.inputValidation.${errors.endDate?.type}`, {
              ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE
            })}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default RenderOfficialVacationInputs;
