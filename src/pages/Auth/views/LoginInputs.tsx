import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Field, Checkbox, Input, InputErrorMessage, Label } from "../../../components/ui";
import { TFunction } from "i18next";
import { ILoginCredentials } from "../../../interfaces";

interface LoginInputsProps {
  register: UseFormRegister<ILoginCredentials>;
  errors: FieldErrors<ILoginCredentials>;
  t: TFunction;
}

const LoginInputs = ({ register, errors, t }: LoginInputsProps) => {
  /* ____________ RENDER LOGIN INPUTS ____________ */
  return (
    <>
      {/* Email Input */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.email.label", { ns: "login" })}</Label>
        <Input
          type="text"
          placeholder={t("form.email.placeholder", { ns: "login" })}
          isError={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <InputErrorMessage>{t(`form.email.inputValidation.${errors.email.type}`, { ns: "login" })}</InputErrorMessage>
        )}
      </Field>

      {/* Password Input */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.password.label", { ns: "login" })}</Label>
        <Input
          type="password"
          placeholder={t("form.password.placeholder", { ns: "login" })}
          isError={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          
          <InputErrorMessage>{t(`form.password.inputValidation.${errors.password.type}`, { ns: "login" })}</InputErrorMessage>
        )}
      </Field>

      {/* Remember Me Checkbox */}
      <Field className="flex gap-3">
        <Checkbox {...register("rememberMe")} onChange={(e) => e.target.checked} />
        <Label>{t("form.rememberMe.label", { ns: "login" })}</Label>
      </Field>
    </>
  );
};

export default LoginInputs;
