import { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  Field,
  Input,
  InputErrorMessage,
  InputSkeleton,
  Label,
  LabelSkeleton,
  SelectBox,
  Textarea,
  TextareaSkeleton,
} from "../../../../components/ui";
import { MissionRequestType } from "../../../../enums";
import { Calendar } from "lucide-react";
import { TRANSLATION_NAMESPACE } from "..";
import { useTranslation } from "react-i18next";
import { getTodayDateISO } from "../../../../utils";
import { IMissionRequestCredentials } from "../../../../interfaces";

interface IMissionRequestInputsProps {
  register: UseFormRegister<IMissionRequestCredentials>;
  errors: FieldErrors<IMissionRequestCredentials>;
  isLoading?: boolean;
}

const Inputs = ({ register, errors, isLoading }: IMissionRequestInputsProps) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);

  return (
    <>
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
            <SelectBox {...register("type")} isError={!!errors.type}>
              <option value="" selected>
                {t("inputs.type.defaultOption")}
              </option>
              {Object.values(MissionRequestType)
                .filter((v) => typeof v === "number")
                .map((type) => (
                  <option key={type} value={type}>
                    {t(`dayType.${type as number}`)}
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

      {/* Date */}
      <Field className="space-y-2">
        {isLoading ? (
          <>
            <LabelSkeleton />
            <InputSkeleton />
          </>
        ) : (
          <>
            <Label size="lg">{t("inputs.date.label")}</Label>
            <Input
              type="date"
              placeholder="YYYY-MM-DD"
              isError={!!errors.date}
              icon={<Calendar />}
              {...register("date")}
              min={getTodayDateISO()}
            />
            {errors.date && (
              <InputErrorMessage>
                {t(`inputs.date.validation.${errors.date.type}`)}
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
