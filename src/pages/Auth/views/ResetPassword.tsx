// import { InputErrorMessage } from "../../components/ui/Forms"
import { Button, Field, Header, Input, InputErrorMessage, Label } from "../../../components/ui"
import { useTranslation } from "react-i18next"
import { useChnagePassword } from "../../../hooks/auth.hooks"
import { Logo } from "../../../components/ui/Logo";
import { useState } from "react";
import { useSearchParams } from "react-router";

const ResetPasswordPage = () => {
    const { t } = useTranslation(["common", "login"]);
    const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
    const [Errors,setErrors]=useState({})
    const [formData, setFormData] = useState({
        newPassword: "",
        Confirm:""
      });

  const validateField = (name, value) => {
        let error = "";

  if (!value) {
    error = `required`;
  } else {
    if (name === "Confirm" && value !== formData.newPassword) {
      error = "Not_match";
    }
  }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
        console.log(Errors);
      };
      const handleChange = (e) => {
        const { name, value } = e.target;
        validateField(name,value)
        setFormData({ ...formData, [name]: value })
        
      }
      const hasErrors = () => {
  return Object.values(Errors).some((error) => error); // returns true if any error exists
};

  const { isLoadingConfirm, onSubmitConfirm } = useChnagePassword();
  return (
    <div className="flex justify-center items-start sm:px-4 px-8">
      <div className="max-w-[650px] space-y-10 drop-shadow-xl">
        <Logo src="/logos/images.png"  />
        <Header
          heading={t("Reset.header.heading", { ns: "login" })}
          subtitle={t("Reset.header.subtitle", { ns: "login" })}
        />
        {/* <LoginAlerts responseData={responseData} t={t} /> */}
        <form className="space-y-5">
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
          <InputErrorMessage>{t(`Reset.form.validation.newPassword.${Errors.newPassword}`, { ns: "login" })}</InputErrorMessage>
        )}
      </Field>

      {/* Password Input */}
      <Field className="space-y-2">
        <Label size="lg">{t("Reset.form.Confirm_Pass", { ns: "login" })}</Label>
        <Input
          type="password"
          placeholder={t("Reset.form.label.Confirm", { ns: "login" })}
          name="Confirm"
          onChange={handleChange}
          value={formData.Confirm}
        />
        {Errors.Confirm && (
          
          <InputErrorMessage>{t(`Reset.form.validation.Confirm.${Errors.Confirm}`, { ns: "login" })}</InputErrorMessage>
        )}
      </Field>

          <Button size={"lg"} variant={"secondary"} fullWidth={true} isLoading={isLoadingConfirm} type="button" disabled={hasErrors()} onClick={()=>onSubmitConfirm(formData.newPassword,formData.Confirm,email)}>
            {isLoadingConfirm ? t("buttons.loading") : t("Submit", { ns: "login" }) }
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage