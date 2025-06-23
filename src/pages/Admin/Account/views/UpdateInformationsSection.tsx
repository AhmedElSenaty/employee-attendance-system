import { useTranslation } from "react-i18next";
import { ADMIN_ACCOUNT_PAGE } from "../../../../constants";
import { SubmitHandler, useForm } from "react-hook-form";
import { AdminAccountFormValues, updateAdminAccountSchema } from "../../../../validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { AdminProfileCredentials } from "../../../../interfaces";
import { useUpdateAdminProfile } from "../../../../hooks";
import { Button, Field, Input, InputErrorMessage, Label, SectionHeader } from "../../../../components/ui";

interface Props {
    informations: {
        id: string;
        username: string;
        email: string;
        title: string
    }
}

const UpdateInformationsSection = ({ informations }: Props) => {
  const { t } = useTranslation([ADMIN_ACCOUNT_PAGE]);

  // Form setup with React Hook Form and Yup schema validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminAccountFormValues>({
    resolver: yupResolver(updateAdminAccountSchema), 
    mode: "onChange",
  });

  // Reset form when `me` data is available
  useEffect(() => {
    if (informations) {
      reset({ email: informations.email, username: informations.username });
    }
  }, [informations, reset]);

  const { mutate: updateAdminProfile, isPending: isUpdateAdminProfileLoading } = useUpdateAdminProfile();

  // Handler for confirming the edit action for the admin
  const handleConfirmEdit: SubmitHandler<AdminProfileCredentials> = async (request) => {
    if (informations) {
      request.id = informations.id;
      // Call API to update admin profile
      updateAdminProfile(request);
    }
  };


  return (
        <form className="bg-white shadow-md space-y-5 p-5 rounded-lg" onSubmit={handleSubmit(handleConfirmEdit)}>
            <SectionHeader
                title={t(`updateSection.title`)}
                description={t(`updateSection.description`)}
            />
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field className="space-y-2">
              <Label size="lg">{t(`inputs.username.label`)}</Label>
              <Input
                placeholder={t("inputs.username.placeholder")}
                {...register("username")}
                isError={!!errors["username"]}
              />
              {errors["username"] && (
                <InputErrorMessage>
                  {t(`inputs.username.inputValidation.${errors["username"].type}`)}
                </InputErrorMessage>
              )}
            </Field>

            <Field className="space-y-2">
              <Label size="lg">{t(`inputs.email.label`)}</Label>
              <Input
                placeholder={t("inputs.email.placeholder")}
                {...register("email")}
                isError={!!errors["email"]}
              />
              {errors["email"] && (
                <InputErrorMessage>
                  {t(`inputs.email.inputValidation.${errors["email"].type}`)}
                </InputErrorMessage>
              )}
            </Field>

            <Field className="space-y-2">
              <Label size="lg">{t(`inputs.title.label`)}</Label>
              <Input
                disabled={true}
                value={informations?.title || ""}
                placeholder={t("inputs.title.placeholder")}
              />
            </Field>
          </div>

          <Button fullWidth={false} isLoading={isUpdateAdminProfileLoading}>
            {isUpdateAdminProfileLoading ? t("buttons.loading") : t("buttons.updateInformations")}
          </Button>
        </form>

  );
};

export default UpdateInformationsSection;
