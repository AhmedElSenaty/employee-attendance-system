import { useSelector } from "react-redux";
import { Header } from "../../../components/ui/Header";
import useFetchMe, { useManageMe } from "../../../hooks/useMeHook";
import { IManagerCredentials, IPermissionsData } from "../../../interfaces";
import { RootState } from "../../../context/store";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { Field, Input, InputErrorMessage, Label } from "../../../components/ui/Forms";
import { Button } from "../../../components/ui/Button";
import { getManagerSchema, passwordUpdateSchema } from "../../../validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useManageManagers } from "../../../hooks/useManagerHook";

const TRANSLATION_NAMESPACE = "managerAccount";

const ManagerAccountPage = () => {
  const { me } = useFetchMe();
  const { t } = useTranslation(["common", TRANSLATION_NAMESPACE]);
  const { language } = useSelector((state: RootState) => state.language);

  // Form setup with React Hook Form and Yup schema validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IManagerCredentials>({
    resolver: yupResolver(getManagerSchema(true)),
    mode: "onChange",
  });

  const {
    register: updatePasswordRegister,
    handleSubmit: handleSubmitUpdatePassword,
    formState: { errors: updatePasswordErrors },
  } = useForm<{ oldPassword?: string, password: string, confirmPassword: string }>({
    resolver: yupResolver(passwordUpdateSchema(true)),
    mode: "onChange",
  });

  // Reset form when `me` data is available
  useEffect(() => {
    if (me) {
      reset({ email: me.email, username: me.username });
    }
  }, [me, reset]);

  const {
    updateManager,
    isupdateing,
  } = useManageManagers();

  // Handler for confirming the edit action for the admin
  const handleConfirmEdit: SubmitHandler<IManagerCredentials> = async (request) => {
    if (me) {
      request.id = me.id;
      updateManager(request);
    }
  };

  const { 
    updateMyPassword, 
    isUpdateMyPasswordLoading 
  } = useManageMe();

  const handleConfirmUpdatePassword: SubmitHandler<{password: string, oldPassword?: string}> = async (request: { password: string, oldPassword?: string }) => {
    console.log(request);
    updateMyPassword({
      oldPassword: request.oldPassword || "",
      password: request.password,
    });
  };

  // Render permissions dynamically
  const renderPermissions = me?.permissions?.map(({ id, nameAr, nameEn }: IPermissionsData) => (
    <div
      key={id}
      className="p-3 bg-green-600 text-white shadow-md rounded-lg flex gap-4 justify-between items-center"
    >
      <div className="flex-1">
        <h3 className="text-base font-semibold">{language === "en" ? nameEn : nameAr}</h3>
      </div>
    </div>
  ));


  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header
        heading={t(`profile.header.heading`, { ns: TRANSLATION_NAMESPACE })}
        subtitle={t(`profile.header.subtitle`, { ns: TRANSLATION_NAMESPACE })}
      />

      {/* Admin Information Section */}
      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader
          title={t(`profile.updateSection.title`, { ns: TRANSLATION_NAMESPACE })}
          description={t(`profile.updateSection.description`, { ns: TRANSLATION_NAMESPACE })}
        />

        <form className="space-y-5" onSubmit={handleSubmit(handleConfirmEdit)}>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field className="space-y-2">
              <Label size="lg">{t(`form.username.label`, { ns: TRANSLATION_NAMESPACE })}</Label>
              <Input
                placeholder={t("form.username.placeholder", { ns: TRANSLATION_NAMESPACE })}
                {...register("username")}
                isError={!!errors["username"]}
              />
              {errors["username"] && (
                <InputErrorMessage>
                  {t(`form.username.inputValidation.${errors["username"].type}`, { ns: TRANSLATION_NAMESPACE })}
                </InputErrorMessage>
              )}
            </Field>

            <Field className="space-y-2">
              <Label size="lg">{t(`form.email.label`, { ns: TRANSLATION_NAMESPACE })}</Label>
              <Input
                placeholder={t("form.email.placeholder", { ns: TRANSLATION_NAMESPACE })}
                {...register("email")}
                isError={!!errors["email"]}
              />
              {errors["email"] && (
                <InputErrorMessage>
                  {t(`form.email.inputValidation.${errors["email"].type}`, { ns: TRANSLATION_NAMESPACE })}
                </InputErrorMessage>
              )}
            </Field>
          </div>

          <Button fullWidth={false} isLoading={isupdateing} type="submit">
            {t("buttons.update")}
          </Button>
        </form>
      </div>

      <form className="bg-white shadow-md space-y-5 p-5 rounded-lg w-full" onSubmit={handleSubmitUpdatePassword(handleConfirmUpdatePassword)}>
        <SectionHeader
          title="Update Your Information"
          description="Keep your personal details up to date to ensure accurate records and communication."
        />

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field className="space-y-2">
            <Label size="lg">{t(`form.oldPassword.label`, { ns: TRANSLATION_NAMESPACE })}</Label>
            <Input
              placeholder={t("form.oldPassword.placeholder", { ns: TRANSLATION_NAMESPACE })}
              type="oldPassword"
              {...updatePasswordRegister("oldPassword")}
              isError={!!updatePasswordErrors["oldPassword"]}
            />
            {updatePasswordErrors["oldPassword"] && (
              <InputErrorMessage>
                {t(`form.oldPassword.inputValidation.${updatePasswordErrors["oldPassword"].type === "matches" ? updatePasswordErrors["oldPassword"].message : updatePasswordErrors["oldPassword"].type}`, {
                  ns: TRANSLATION_NAMESPACE,
                })}
              </InputErrorMessage>
            )}
          </Field>

          <Field className="space-y-2">
            <Label size="lg">{t(`form.password.label`, { ns: TRANSLATION_NAMESPACE })}</Label>
            <Input
              placeholder={t("form.password.placeholder", { ns: TRANSLATION_NAMESPACE })}
              type="password"
              {...updatePasswordRegister("password")}
              isError={!!updatePasswordErrors["password"]}
            />
            {updatePasswordErrors["password"] && (
              <InputErrorMessage>
                {t(`form.password.inputValidation.${updatePasswordErrors["password"].type === "matches" ? updatePasswordErrors["password"].message : updatePasswordErrors["password"].type}`, {
                  ns: TRANSLATION_NAMESPACE,
                })}
              </InputErrorMessage>
            )}
          </Field>

          <Field className="space-y-2">
            <Label size="lg">{t(`form.confirmPassword.label`, { ns: TRANSLATION_NAMESPACE })}</Label>
            <Input
              placeholder={t("form.confirmPassword.placeholder", { ns: TRANSLATION_NAMESPACE })}
              type="password"
              {...updatePasswordRegister("confirmPassword")}
              isError={!!updatePasswordErrors["confirmPassword"]}
            />
            {updatePasswordErrors["confirmPassword"] && (
              <InputErrorMessage>
                {t(`form.confirmPassword.inputValidation.${updatePasswordErrors["confirmPassword"].type}`, { ns: TRANSLATION_NAMESPACE })}
              </InputErrorMessage>
            )}
          </Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            fullWidth={false} 
            isLoading={isUpdateMyPasswordLoading}
          >
            {t("profile.updatePasswordButton", { ns: TRANSLATION_NAMESPACE })}
          </Button>
        </div>
      </form>

      {/* Departments Section */}
      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg w-full">
        <SectionHeader
          title={t(`profile.departmentsSection.title`, { ns: TRANSLATION_NAMESPACE })}
          description={t(`profile.departmentsSection.description`, { ns: TRANSLATION_NAMESPACE })}
        />
        <div className="flex flex-wrap gap-5 mt-4 w-fit">
          <div
            className="p-3 bg-primary text-white shadow-md rounded-lg flex gap-4 justify-between items-center"
          >
            <div className="flex-1">
              <h3 className="text-base font-semibold">{me?.department?.name}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Section */}
      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg w-full">
        <SectionHeader
          title={t(`profile.permissionsSection.title`, { ns: TRANSLATION_NAMESPACE })}
          description={t(`profile.permissionsSection.description`, { ns: TRANSLATION_NAMESPACE })}
        />
        <div className="flex flex-wrap gap-5 mt-4 w-fit">{renderPermissions}</div>
      </div>
    </div>
  );
};

export default ManagerAccountPage;
