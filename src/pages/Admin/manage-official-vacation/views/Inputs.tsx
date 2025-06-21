import { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  Field,
  Input,
  InputErrorMessage,
  InputSkeleton,
  Label,
  LabelSkeleton
} from "../../../../components/ui";
import { OfficialVacationFormValues } from "../../../../validation";
import { useTranslation } from "react-i18next";
import { OFFICIAL_VACATION_NS } from "../../../../constants";
import { Calendar } from "lucide-react";

interface Props {
  register: UseFormRegister<OfficialVacationFormValues>;
  errors: FieldErrors<OfficialVacationFormValues>;
  isLoading?: boolean;
}

const RenderOfficialVacationInputs = ({
  register,
  errors,
  isLoading
}: Props) => {
  const { t } = useTranslation([OFFICIAL_VACATION_NS]);

  if (isLoading) {
    return (
      <>
        {[...Array(3)].map((_, i) => (
          <Field key={i} className="space-y-2">
            <LabelSkeleton />
            <InputSkeleton />
          </Field>
        ))}
      </>
    );
  }

  return (
    <>
      {/* Name Field */}
      <Field className="space-y-2">
        <Label size="lg">
          {t("inputs.name.label")}
        </Label>
        <Input
          type="text"
          placeholder={t("inputs.name.placeholder")}
          isError={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <InputErrorMessage>
            {t(`inputs.name.inputValidation.${errors.name?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Start Date Field */}
      <Field className="space-y-2">
        <Label size="lg">
          {t("inputs.startDate.label")}
        </Label>
        <Input
          type="date"
          placeholder={t("inputs.startDate.placeholder")}
          isError={!!errors.startDate}
          icon={<Calendar />}
          {...register("startDate")}
        />
        {errors.startDate && (
          <InputErrorMessage>
            {t(`inputs.startDate.inputValidation.${errors.startDate?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* End Date Field */}
      <Field className="space-y-2">
        <Label size="lg">
          {t("inputs.endDate.label")}
        </Label>
        <Input
          type="date"
          placeholder={t("inputs.endDate.placeholder")}
          isError={!!errors.endDate}
          icon={<Calendar />}
          {...register("endDate")}
        />
        {errors.endDate && (
          <InputErrorMessage>
            {t(`inputs.endDate.inputValidation.${errors.endDate?.type}`)}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default RenderOfficialVacationInputs;
