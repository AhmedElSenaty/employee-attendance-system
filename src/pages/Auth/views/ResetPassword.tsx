import {
  Button,
  Field,
  Header,
  Input,
  InputErrorMessage,
  Label,
} from "../../../components/ui";
import { useTranslation } from "react-i18next";
import { useConfirmChangePassword } from "../../../hooks/auth.hooks";
import { Logo } from "../../../components/ui/Logo";
import { useState } from "react";
import { useSearchParams } from "react-router";

const ResetPasswordPage = () => {
  const { t } = useTranslation(["common", "login"]);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [Errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    Confirm: "",
  });

  const validateField = (name, value) => {
    let error = "";

    if (!value) {
      error = "required";
    } else {
      if (name === "Confirm" && value !== formData.newPassword) {
        error = "Not_match";
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
    setFormData({ ...formData, [name]: value });
  };

  const hasErrors = () => {
    return Object.values(Errors).some((error) => error);
  };

  const { isLoadingConfirm, onSubmitConfirm } = useConfirmChangePassword();

  return (
    <div className="flex justify-center items-start sm:px-4 px-8">
      <div className="max-w-[650px] space-y-10 drop-shadow-xl">
        <Logo src="/logos/images.png" />
        <Header
          heading={t("Reset.header.heading", { ns: "login" })}
          subtitle={t("Reset.header.subtitle", { ns: "login" })}
        />

        <form className="space-y-5">
          {/* OTP Input */}
          <Field className="space-y-2">
            <Label size="lg">{t("Reset.form.otp", { ns: "login" })}</Label>
            <Input
              type="text"
              placeholder={t("Reset.form.label.otp", { ns: "login" })}
              name="otp"
              onChange={handleChange}
              value={formData.otp}
            />
            {Errors.otp && (
              <InputErrorMessage>
                {t(`Reset.form.validation.otp.${Errors.otp}`, { ns: "login" })}
              </InputErrorMessage>
            )}
          </Field>

          {/* New Password Input */}
          <Field className="space-y-2">
            <Label size="lg">{t("Reset.form.password", { ns: "login" })}</Label>
            <Input
              type="password"
              placeholder={t("Reset.form.label.Password", { ns: "login" })}
              name="newPassword"
              onChange={handleChange}
              value={formData.newPassword}
            />
            {Errors.newPassword && (
              <InputErrorMessage>
                {t(`Reset.form.validation.newPassword.${Errors.newPassword}`, {
                  ns: "login",
                })}
              </InputErrorMessage>
            )}
          </Field>

          {/* Confirm Password Input */}
          <Field className="space-y-2">
            <Label size="lg">
              {t("Reset.form.Confirm_Pass", { ns: "login" })}
            </Label>
            <Input
              type="password"
              placeholder={t("Reset.form.label.Confirm", { ns: "login" })}
              name="Confirm"
              onChange={handleChange}
              value={formData.Confirm}
            />
            {Errors.Confirm && (
              <InputErrorMessage>
                {t(`Reset.form.validation.Confirm.${Errors.Confirm}`, {
                  ns: "login",
                })}
              </InputErrorMessage>
            )}
          </Field>

          {/* Submit Button */}
          <Button
            size="lg"
            variant="secondary"
            fullWidth={true}
            isLoading={isLoadingConfirm}
            type="button"
            disabled={hasErrors()}
            onClick={() =>
              onSubmitConfirm(
                formData.newPassword,
                formData.Confirm,
                email,
                formData.otp
              )
            }
          >
            {isLoadingConfirm
              ? t("buttons.loading")
              : t("Submit", { ns: "login" })}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
