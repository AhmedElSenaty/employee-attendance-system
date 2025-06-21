import { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  Field,
  Input,
  InputErrorMessage,
  InputSkeleton,
  Label,
  LabelSkeleton
} from "../../../../components/ui";
import { ProfileFormValues } from "../../../../validation";
import { PROFILE_NS } from "../../../../constants";
import { useTranslation } from "react-i18next";

interface Props {
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  isLoading?: boolean;
}

const Inputs = ({ register, errors, isLoading }: Props) => {
  const { t } = useTranslation([PROFILE_NS]);

  if (isLoading) {
    return (
      <>
        {[...Array(2)].map((_, i) => (
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
      <Field className="space-y-2">
        <Label size="lg">
          {t(`inputs.nameAr.label`)}
        </Label>
        <Input
          type="text"
          placeholder={t(`inputs.nameAr.placeholder`)}
          isError={!!errors.nameAr}
          {...register("nameAr")}
        />
        {errors.nameAr && (
          <InputErrorMessage>
            {t(`inputs.nameAr.inputValidation.${errors.nameAr.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      <Field className="space-y-2">
        <Label size="lg">
          {t(`inputs.nameEn.label`)}
        </Label>
        <Input
          type="text"
          placeholder={t(`inputs.nameEn.placeholder`)}
          isError={!!errors.nameEn}
          {...register("nameEn")}
        />
        {errors.nameEn && (
          <InputErrorMessage>
            {t(`inputs.nameEn.inputValidation.${errors.nameEn.type}`)}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default Inputs;
