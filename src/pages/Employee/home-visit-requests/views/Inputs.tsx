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
import { HOME_VISIT_REQUESTS_NS } from "../../../../constants";
import { HomeVisitFormValues } from "../../../../validation/homeVisit.schema";

interface Props {
  register: UseFormRegister<HomeVisitFormValues>;
  errors: FieldErrors<HomeVisitFormValues>;
  isLoading?: boolean;
}

const Inputs = ({ register, errors, isLoading }: Props) => {
  const { t } = useTranslation(HOME_VISIT_REQUESTS_NS);

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

      <Field className="space-y-2">
        <Label size="lg">{t("inputs.numberOfDays.label")}</Label>
        <Input
          type="number"
          placeholder={t("inputs.numberOfDays.placeholder")}
          isError={!!errors.numberOfDays}
          {...register("numberOfDays")}
        />
        {errors.numberOfDays && (
          <InputErrorMessage>
            {t(`inputs.numberOfDays.inputValidation.${errors.numberOfDays?.type}`)}
          </InputErrorMessage>
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
