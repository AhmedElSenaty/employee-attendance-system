import { useTranslation } from "react-i18next";
import { ADMIN_ACCOUNT_PAGE } from "../../../../constants";
import { SubmitHandler, useForm } from "react-hook-form";
import { passwordUpdateSchema, UpdatePasswordFormValues } from "../../../../validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUpdateMyPassword } from "../../../../hooks";
import { Button, Field, Input, InputErrorMessage, Label, SectionHeader } from "../../../../components/ui";

const UpdatePasswordSection = () => {
  const { t } = useTranslation([ADMIN_ACCOUNT_PAGE]);

  const {
    register: updatePasswordRegister,
    handleSubmit: handleSubmitUpdatePassword,
    formState: { errors: updatePasswordErrors },
  } = useForm<UpdatePasswordFormValues>({
    resolver: yupResolver(passwordUpdateSchema(true)),
    mode: "onChange",
  });

  const { mutate: updateMyPassword, isPending: isUpdateMyPasswordLoading } = useUpdateMyPassword();


  const handleConfirmUpdatePassword: SubmitHandler<UpdatePasswordFormValues> = async (request: UpdatePasswordFormValues) => {
    updateMyPassword({
      oldPassword: request.oldPassword || "",
      password: request.password,
    });
  };

  return (
      <form className="bg-white shadow-md space-y-5 p-5 rounded-lg w-full" onSubmit={handleSubmitUpdatePassword(handleConfirmUpdatePassword)}>
        <SectionHeader
          title={t(`updatePassword.title`)}
          description={t(`updatePassword.description`)}
        />

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field className="space-y-2">
            <Label size="lg">{t(`inputs.oldPassword.label`)}</Label>
            <Input
              placeholder={t("inputs.oldPassword.placeholder")}
              type="oldPassword"
              {...updatePasswordRegister("oldPassword")}
              isError={!!updatePasswordErrors["oldPassword"]}
            />
            {updatePasswordErrors["oldPassword"] && (
              <InputErrorMessage>
                {t(`inputs.oldPassword.inputValidation.${updatePasswordErrors["oldPassword"].type === "matches" ? updatePasswordErrors["oldPassword"].message : updatePasswordErrors["oldPassword"].type}`)}
              </InputErrorMessage>
            )}
          </Field>

          <Field className="space-y-2">
            <Label size="lg">{t(`inputs.password.label`)}</Label>
            <Input
              placeholder={t("inputs.password.placeholder")}
              type="password"
              {...updatePasswordRegister("password")}
              isError={!!updatePasswordErrors["password"]}
            />
            {updatePasswordErrors["password"] && (
              <InputErrorMessage>
                {t(`inputs.password.inputValidation.${updatePasswordErrors["password"].type === "matches" ? updatePasswordErrors["password"].message : updatePasswordErrors["password"].type}`)}
              </InputErrorMessage>
            )}
          </Field>

          <Field className="space-y-2">
            <Label size="lg">{t(`inputs.confirmPassword.label`)}</Label>
            <Input
              placeholder={t("inputs.confirmPassword.placeholder")}
              type="password"
              {...updatePasswordRegister("confirmPassword")}
              isError={!!updatePasswordErrors["confirmPassword"]}
            />
            {updatePasswordErrors["confirmPassword"] && (
              <InputErrorMessage>
                {t(`inputs.confirmPassword.inputValidation.${updatePasswordErrors["confirmPassword"].type}`)}
              </InputErrorMessage>
            )}
          </Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            fullWidth={false} 
            isLoading={isUpdateMyPasswordLoading}
          >
            {isUpdateMyPasswordLoading ? t("buttons.loading") : t("buttons.updatePassword")}
          </Button>
        </div>
      </form>
  );
};

export default UpdatePasswordSection;
