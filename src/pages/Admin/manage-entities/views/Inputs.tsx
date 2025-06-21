import { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  Field,
  Input,
  InputErrorMessage,
  InputSkeleton,
  Label,
  LabelSkeleton,
  Textarea,
  TextareaSkeleton
} from "../../../../components/ui";
import { EntityFormValues } from "../../../../validation";
import { useTranslation } from "react-i18next";
import { ENTITY_NS } from "../../../../constants";

interface Props {
  register: UseFormRegister<EntityFormValues>;
  errors: FieldErrors<EntityFormValues>;
  isLoading?: boolean;
}

const Inputs = ({ register, errors, isLoading = false }: Props) => {
  const { t } = useTranslation([ENTITY_NS]);

  if (isLoading) {
    return (
      <>
        {/* Name Skeleton */}
        <Field className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
        {/* Description Skeleton */}
        <Field className="space-y-2">
          <LabelSkeleton />
          <TextareaSkeleton />
        </Field>
      </>
    );
  }

  return (
    <>
      {/* Entity Name */}
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

      {/* Description */}
      <Field className="space-y-2">
        <Label size="lg">
          {t("inputs.description.label")}
        </Label>
        <Textarea
          placeholder={t("inputs.description.placeholder")}
          isError={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <InputErrorMessage>
            {t(`inputs.description.inputValidation.${errors.description?.type}`)}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default Inputs;
