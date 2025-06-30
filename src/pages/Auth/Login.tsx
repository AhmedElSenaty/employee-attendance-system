// import { InputErrorMessage } from "../../components/ui/Forms"
import { Button, Header } from "../../components/ui"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import { ILoginCredentials } from "../../interfaces"
import { loginSchema } from "../../validation"
import { LoginAlerts, LoginInputs } from "./views"
import { useLogin } from "../../hooks/auth.hooks"
import { Logo } from "../../components/ui/Logo";

const LoginPage = () => {
  const { t } = useTranslation(["common", "login"]);

  const { register, handleSubmit, formState: { errors } } = useForm<ILoginCredentials>({
    resolver: yupResolver(loginSchema),
    mode: "onChange"
  });

  const { isLoading, responseData, onSubmit } = useLogin();

  return (
    <div className="flex justify-center items-start sm:px-4 px-8">
      <div className="max-w-[650px] space-y-10 drop-shadow-xl">
        <Logo src="/logos/images.png"  />
        <Header
          heading={t("header.heading", { ns: "login" })}
          subtitle={t("header.subtitle", { ns: "login" })}
        />
        <LoginAlerts responseData={responseData} t={t} />
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <LoginInputs register={register} errors={errors} t={t} />
          <Button size={"lg"} variant={"secondary"} fullWidth={true} isLoading={isLoading} type="submit">
            {isLoading ? t("buttons.loading") : t("buttons.login")}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage