import { Header, Button } from "../../components/ui";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetAccountSchema } from "../../validation";
import { IResetAccountCredentials } from "../../interfaces";
import { ResetAccountInputs } from "./views";
import { useResetAccount } from "../../hooks/auth.hooks";

const ResetAccountPage = () => {
  const { t } = useTranslation(["common", "resetAccount"]);

  const { register, handleSubmit, formState: { errors } } = useForm<IResetAccountCredentials>({
    resolver: yupResolver(resetAccountSchema),
    mode: "onChange"
  });

  const { isLoading, onSubmit } = useResetAccount();

  return (
    <div className="flex justify-center items-center py-32 sm:px-4 px-8">
      <div className="max-w-[650px] space-y-10 drop-shadow-xl">
        <Header heading={t("header.heading", { ns: "resetAccount" })} subtitle={t("header.subtitle", { ns: "resetAccount" })} />
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <ResetAccountInputs register={register} errors={errors} t={t} />
          <Button variant="secondary" fullWidth isLoading={isLoading}>
            {isLoading ? t("buttons.loading") : t("buttons.resetPassword")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetAccountPage;
