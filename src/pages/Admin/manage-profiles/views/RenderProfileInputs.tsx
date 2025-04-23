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
import { IProfileCredentials } from "../../../../interfaces";
import { PROFILE_TRANSLATION_NAMESPACE } from "..";

interface IProfileInputsProps {
  register: UseFormRegister<IProfileCredentials>;
  errors: FieldErrors<IProfileCredentials>;
  isLoading?: boolean;
  t: TFunction;
}

const RenderProfileInputs = ({ register, errors, isLoading, t }: IProfileInputsProps) => {
  return (
    <>
      {isLoading ? (
        <Field className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
      ) : (
        <Field className="space-y-2">
          <Label size="lg">
            {t(`form.nameAr.label`, { ns: PROFILE_TRANSLATION_NAMESPACE })}
          </Label>
          <Input
            type="text"
            placeholder={t(`form.nameAr.placeholder`, { ns: PROFILE_TRANSLATION_NAMESPACE })}
            isError={!!errors.nameAr}
            {...register("nameAr")}
          />
          {errors.nameAr && (
            <InputErrorMessage>
              {t(`form.nameAr.inputValidation.${errors.nameAr.type}`, {
                ns: PROFILE_TRANSLATION_NAMESPACE
              })}
            </InputErrorMessage>
          )}
        </Field>
      )}

      {isLoading ? (
        <Field className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
      ) : (
        <Field className="space-y-2">
          <Label size="lg">
            {t(`form.nameEn.label`, { ns: PROFILE_TRANSLATION_NAMESPACE })}
          </Label>
          <Input
            type="text"
            placeholder={t(`form.nameEn.placeholder`, { ns: PROFILE_TRANSLATION_NAMESPACE })}
            isError={!!errors.nameEn}
            {...register("nameEn")}
          />
          {errors.nameEn && (
            <InputErrorMessage>
              {t(`form.nameEn.inputValidation.${errors.nameEn.type}`, {
                ns: PROFILE_TRANSLATION_NAMESPACE
              })}
            </InputErrorMessage>
          )}
        </Field>
      )}
    </>
  );
};

export default RenderProfileInputs;
