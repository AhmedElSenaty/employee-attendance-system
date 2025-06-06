import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Field, Input, InputErrorMessage, Label } from "../../../components/ui";
import { TFunction } from "i18next";
import { IResetAccountCredentials } from "../../../interfaces";

interface ResetAccountInputsProps {
  register: UseFormRegister<IResetAccountCredentials>;
  errors: FieldErrors<IResetAccountCredentials>;
  t: TFunction;
}

const ResetAccountInputs = ({ register, errors, t }: ResetAccountInputsProps) => {
  return (
    <>
      {/* Email Input */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.email.label", { ns: "resetAccount" })}</Label>
        <Input
          type="email"
          placeholder={t("form.email.placeholder", { ns: "resetAccount" })}
          isError={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <InputErrorMessage>
            {t(`form.email.inputValidation.${errors.email.type}`, { ns: "resetAccount" })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Old Password Input */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.oldPassword.label", { ns: "resetAccount" })}</Label>
        <Input
          type="password"
          placeholder={t("form.oldPassword.placeholder", { ns: "resetAccount" })}
          isError={!!errors.oldPassword}
          {...register("oldPassword")}
        />
        {errors.oldPassword && (
          <InputErrorMessage>
            {t(`form.oldPassword.inputValidation.${errors.oldPassword.type}`, { ns: "resetAccount" })}
          </InputErrorMessage>
        )}
      </Field>

      {/* New Password Input */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.password.label", { ns: "resetAccount" })}</Label>
        <Input
          type="password"
          placeholder={t("form.password.placeholder", { ns: "resetAccount" })}
          isError={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <InputErrorMessage>
            {t(`form.password.inputValidation.${errors["password"].message}`, { ns: "resetAccount" })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Confirm Password Input */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.confirmPassword.label", { ns: "resetAccount" })}</Label>
        <Input
          type="password"
          placeholder={t("form.confirmPassword.placeholder", { ns: "resetAccount" })}
          isError={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <InputErrorMessage>
            {t(`form.confirmPassword.inputValidation.${errors.confirmPassword.type}`, { ns: "resetAccount" })}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default ResetAccountInputs;
