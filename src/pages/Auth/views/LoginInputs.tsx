import { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  Field,
  Checkbox,
  Input,
  InputErrorMessage,
  Label,
  Button,
  Popup,
} from "../../../components/ui";
import { TFunction } from "i18next";
import { ILoginCredentials } from "../../../interfaces";
import { useState } from "react";
import { useRestPassword } from "../../../hooks";

interface LoginInputsProps {
  register: UseFormRegister<ILoginCredentials>;
  errors: FieldErrors<ILoginCredentials>;
  t: TFunction;
}

const LoginInputs = ({ register, errors, t }: LoginInputsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [Errors, setErrors] = useState({});
  const { isLoadingReset, onSubmitReset } = useRestPassword();
  const Open = () => {
    setIsOpen(true);
  };

  const Close = () => {
    setIsOpen(false);
  };
  const [formData, setFormData] = useState({
    Email: "",
  });

  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
    setFormData({ ...formData, [name]: value });
  };

  /* ____________ RENDER LOGIN INPUTS ____________ */
  return (
    <>
      {/* Email Input */}
      <Popup
        closeModal={Close}
        isOpen={isOpen}
        title={t("Forget", { ns: "login" })}
      >
        <Field className="flex-col space-y-3">
          <Label>{t("form.email.label", { ns: "login" })}</Label>
          <Input
            type="Text"
            placeholder={t("form.email.placeholder", { ns: "login" })}
            value={formData.Email}
            onChange={handleChange}
            name="Email"
          />
          {Errors.Email && (
            <InputErrorMessage>
              {t(`form.email.inputValidation.required`, { ns: "login" })}
            </InputErrorMessage>
          )}

          <Field className="flex justify-center space-x-3 mt-5 ">
            <Button
              size={"lg"}
              variant={"secondary"}
              fullWidth={true}
              type="button"
              onClick={Close}
            >
              {t("Cancel", { ns: "login" })}
            </Button>
            <Button
              size={"lg"}
              variant={"secondary"}
              isLoading={isLoadingReset}
              fullWidth={true}
              type="button"
              onClick={() => onSubmitReset(formData.Email)}
            >
              {isLoadingReset
                ? t("buttons.loading")
                : t("Submit", { ns: "login" })}
            </Button>
          </Field>
        </Field>
      </Popup>
      <Field className="space-y-2">
        <Label size="lg">{t("form.email.label", { ns: "login" })}</Label>
        <Input
          type="text"
          placeholder={t("form.email.placeholder", { ns: "login" })}
          isError={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <InputErrorMessage>
            {t(`form.email.inputValidation.${errors.email.type}`, {
              ns: "login",
            })}
          </InputErrorMessage>
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
          <InputErrorMessage>
            {t(`form.password.inputValidation.${errors.password.type}`, {
              ns: "login",
            })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Remember Me Checkbox */}
      <Field className="flex justify-between">
        <Field className="flex gap-3">
          <Checkbox
            {...register("rememberMe")}
            onChange={(e) => e.target.checked}
          />
          <Label>{t("form.rememberMe.label", { ns: "login" })}</Label>
        </Field>
        <Button
          className="text-[#19355a] cursor-pointer "
          onClick={Open}
          type="button"
        >
          {t("Forget", { ns: "login" })}
        </Button>
      </Field>
    </>
  );
};

export default LoginInputs;
