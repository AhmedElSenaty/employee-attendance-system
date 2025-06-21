import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Field, Input, InputErrorMessage, InputSkeleton, Label, LabelSkeleton, Textarea, TextareaSkeleton } from "../../../../components/ui";
import { DepartmentFormValues } from "../../../../validation";
import { useTranslation } from "react-i18next";
import { DEPARTMENT_NS } from "../../../../constants";

interface Props {
  register: UseFormRegister<DepartmentFormValues>;
  errors: FieldErrors<DepartmentFormValues>;
  watch?: UseFormWatch<DepartmentFormValues>;
  isLoading?: boolean;
}

const Inputs = ({ register, errors, watch, isLoading }: Props) => {
  const { t } = useTranslation([DEPARTMENT_NS]);

  const idValue = watch ? watch("id") : undefined;

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
          <TextareaSkeleton />
        </Field>
      </>
    );
  }

  return (
    <>
      {/* Conditionally render the ID field if it has no value */}
      {!idValue && (
        <Field className="space-y-2">
          <Label size="lg">{t(`inputs.id.label`)}</Label>
          <Input
            type="number"
            placeholder={t(`inputs.id.placeholder`)}
            isError={!!errors.id}
            {...register("id")}
          />
          {errors.id && (
            <InputErrorMessage>
              {t(`inputs.id.inputValidation.${errors.id.type}`)}
            </InputErrorMessage>
          )}
        </Field>
      )}

      {/* Department Name */}
      <Field className="space-y-2">
        <Label size="lg">{t(`inputs.name.label`)}</Label>
        <Input
          type="text"
          placeholder={t(`inputs.name.placeholder`)}
          isError={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <InputErrorMessage>
            {t(`inputs.name.inputValidation.${errors.name.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Description */}
      <Field className="space-y-2">
        <Label size="lg">{t(`inputs.description.label`)}</Label>
        <Textarea
          placeholder={t(`inputs.description.placeholder`)}
          isError={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <InputErrorMessage>
            {t(`inputs.description.inputValidation.${errors.description.type}`)}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default Inputs;
