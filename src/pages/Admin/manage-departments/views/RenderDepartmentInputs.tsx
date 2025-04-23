import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Field, Input, InputErrorMessage, Label, Textarea } from "../../../../components/ui/Forms";
import { TFunction } from "i18next";
import { IDepartmentCredentials } from "../../../../interfaces";
import { DEPARTMENT_TRANSLATION_NAMESPACE } from "..";

interface IDepartmentInputsProps {
  register: UseFormRegister<IDepartmentCredentials>;
  errors: FieldErrors<IDepartmentCredentials>;
  t: TFunction;
  watch?: UseFormWatch<IDepartmentCredentials>;
}

const RenderDepartmentInputs = ({ register, errors, t, watch }: IDepartmentInputsProps) => {
  const idValue = watch ? watch("id") : undefined;

  return (
    <>
      {/* Conditionally render the ID field if it has no value */}
      {!idValue && (
        <Field className="space-y-2">
          <Label size="lg">{t(`form.id.label`, { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}</Label>
          <Input
            type="number"
            placeholder={t(`form.id.placeholder`, { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}
            isError={!!errors.id}
            {...register("id")}
          />
          {errors.id && (
            <InputErrorMessage>
              {t(`form.id.inputValidation.${errors.id.type}`, { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}
            </InputErrorMessage>
          )}
        </Field>
      )}

      {/* Department Name */}
      <Field className="space-y-2">
        <Label size="lg">{t(`form.name.label`, { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}</Label>
        <Input
          type="text"
          placeholder={t(`form.name.placeholder`, { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}
          isError={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <InputErrorMessage>
            {t(`form.name.inputValidation.${errors.name.type}`, { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Description */}
      <Field className="space-y-2">
        <Label size="lg">{t(`form.description.label`, { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}</Label>
        <Textarea
          placeholder={t(`form.description.placeholder`, { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}
          isError={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <InputErrorMessage>
            {t(`form.description.inputValidation.${errors.description.type}`, { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default RenderDepartmentInputs;
