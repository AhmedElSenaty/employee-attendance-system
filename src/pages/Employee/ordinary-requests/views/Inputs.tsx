import { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  Field,
  Input,
  InputErrorMessage,
  InputSkeleton,
  Label,
  LabelSkeleton,
  Textarea,
  TextareaSkeleton,
} from "../../../../components/ui";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getTodayDateISO } from "../../../../utils";
import { IOrdinaryRequestCredentials } from "../../../../interfaces";
import { ORDINARY_REQUESTS_NS } from "../../../../constants";

interface IOrdinaryRequestInputsProps {
  register: UseFormRegister<IOrdinaryRequestCredentials>;
  errors: FieldErrors<IOrdinaryRequestCredentials>;
  isLoading?: boolean;
}

const Inputs = ({ register, errors, isLoading }: IOrdinaryRequestInputsProps) => {
  const { t } = useTranslation(ORDINARY_REQUESTS_NS);

  return (
    <>
      {/* Date */}
      <Field className="space-y-2">
        {isLoading ? (
          <>
            <LabelSkeleton />
            <InputSkeleton />
          </>
        ) : (
          <>
            <Label size="lg">{t("inputs.startDate.label")}</Label>
            <Input
              type="date"
              placeholder="YYYY-MM-DD"
              isError={!!errors.startDate}
              icon={<Calendar />}
              {...register("startDate")}
              min={getTodayDateISO()}
            />
            {errors.startDate && (
              <InputErrorMessage>
                {t(`inputs.startDate.validation.${errors.startDate.type}`)}
              </InputErrorMessage>
            )}
          </>
        )}
      </Field>

      {/* Date */}
      <Field className="space-y-2">
        {isLoading ? (
          <>
            <LabelSkeleton />
            <InputSkeleton />
          </>
        ) : (
          <>
            <Label size="lg">{t("inputs.endDate.label")}</Label>
            <Input
              type="date"
              placeholder="YYYY-MM-DD"
              isError={!!errors.endDate}
              icon={<Calendar />}
              {...register("endDate")}
              min={getTodayDateISO()}
            />
            {errors.endDate && (
              <InputErrorMessage>
                {t(`inputs.endDate.validation.${errors.endDate.type}`)}
              </InputErrorMessage>
            )}
          </>
        )}
      </Field>

      {/* Description */}
      <Field className="space-y-2">
        {isLoading ? (
          <>
            <LabelSkeleton />
            <TextareaSkeleton />
          </>
        ) : (
          <>
            <Label size="lg">{t("inputs.description.label")}</Label>
            <Textarea
              placeholder={t("inputs.description.placeholder")}
              isError={!!errors.description}
              {...register("description")}
            />
            {errors.description && (
              <InputErrorMessage>
                {t(`inputs.description.validation.${errors.description.type}`)}
              </InputErrorMessage>
            )}
          </>
        )}
      </Field>
    </>
  );
};

export default Inputs;
