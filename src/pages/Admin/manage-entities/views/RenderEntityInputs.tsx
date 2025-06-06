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
import { TFunction } from "i18next";
import { IEntityCredentials } from "../../../../interfaces";
import { ENTITY_TRANSLATION_NAMESPACE } from "..";

interface IEntityInputsProps {
  register: UseFormRegister<IEntityCredentials>;
  errors: FieldErrors<IEntityCredentials>;
  t: TFunction;
  isLoading?: boolean;
}

const RenderEntityInputs = ({ register, errors, t, isLoading = false }: IEntityInputsProps) => {
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
          {t("form.name.label", { ns: ENTITY_TRANSLATION_NAMESPACE })}
        </Label>
        <Input
          type="text"
          placeholder={t("form.name.placeholder", { ns: ENTITY_TRANSLATION_NAMESPACE })}
          isError={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <InputErrorMessage>
            {t(`form.name.inputValidation.${errors.name?.type}`, { ns: ENTITY_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Description */}
      <Field className="space-y-2">
        <Label size="lg">
          {t("form.description.label", { ns: ENTITY_TRANSLATION_NAMESPACE })}
        </Label>
        <Textarea
          placeholder={t("form.description.placeholder", { ns: ENTITY_TRANSLATION_NAMESPACE })}
          isError={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <InputErrorMessage>
            {t(`form.description.inputValidation.${errors.description?.type}`, { ns: ENTITY_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default RenderEntityInputs;
