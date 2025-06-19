import { yupResolver } from "@hookform/resolvers/yup";
import { passwordUpdateSchema } from "../../../../validation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { EMPLOYEE_PROFILE_NS } from "../../../../constants";
import { useUpdateMyPassword } from "../../../../hooks";
import { Button, Field, Input, InputErrorMessage, Label, SectionHeader } from "../../../../components/ui";

const UpdatePasswordSection = () => {
  const { t } = useTranslation([EMPLOYEE_PROFILE_NS]);


  const {
    register: updatePasswordRegister,
    handleSubmit: handleSubmitUpdatePassword,
    formState: { errors: updatePasswordErrors },
  } = useForm<{ oldPassword?: string, password: string, confirmPassword: string }>({
    resolver: yupResolver(passwordUpdateSchema(true)),
    mode: "onChange",
  });

  const { mutate: updateMyPassword, isPending: isUpdateMyPasswordLoading } = useUpdateMyPassword();

  const handleConfirmUpdatePassword: SubmitHandler<{password: string, oldPassword?: string}> = async (request: { password: string, oldPassword?: string }) => {
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
          <Label size="lg">{t(`form.oldPassword.label`)}</Label>
          <Input
            placeholder={t("form.oldPassword.placeholder")}
            type="password"
            {...updatePasswordRegister("oldPassword")}
            isError={!!updatePasswordErrors["oldPassword"]}
          />
          {updatePasswordErrors["oldPassword"] && (
            <InputErrorMessage>
              {t(`form.oldPassword.inputValidation.${updatePasswordErrors["oldPassword"].type === "matches" ? updatePasswordErrors["oldPassword"].message : updatePasswordErrors["oldPassword"].type}`)}
            </InputErrorMessage>
          )}
        </Field>

        <Field className="space-y-2">
          <Label size="lg">{t(`form.password.label`)}</Label>
          <Input
            placeholder={t("form.password.placeholder")}
            type="password"
            {...updatePasswordRegister("password")}
            isError={!!updatePasswordErrors["password"]}
          />
          {updatePasswordErrors["password"] && (
            <InputErrorMessage>
              {t(`form.password.inputValidation.${updatePasswordErrors["password"].type === "matches" ? updatePasswordErrors["password"].message : updatePasswordErrors["password"].type}`)}
            </InputErrorMessage>
          )}
        </Field>

        <Field className="space-y-2">
          <Label size="lg">{t(`form.confirmPassword.label`)}</Label>
          <Input
            placeholder={t("form.confirmPassword.placeholder")}
            type="password"
            {...updatePasswordRegister("confirmPassword")}
            isError={!!updatePasswordErrors["confirmPassword"]}
          />
          {updatePasswordErrors["confirmPassword"] && (
            <InputErrorMessage>
              {t(`form.confirmPassword.inputValidation.${updatePasswordErrors["confirmPassword"].type}`)}
            </InputErrorMessage>
          )}
        </Field>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button 
          fullWidth={false} 
          isLoading={isUpdateMyPasswordLoading}
        >
          {isUpdateMyPasswordLoading ? 
            t("updatePassword.buttons.loading")
            : t("updatePassword.buttons.update")}
        </Button>
      </div>
    </form>
  )
}

export default UpdatePasswordSection
