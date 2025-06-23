import { yupResolver } from "@hookform/resolvers/yup";
import { EmployeeProfileCredentials } from "../../../../interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useUpdateEmployeeProfile } from "../../../../hooks";
import { Button, Field, Input, InputErrorMessage, Label } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { EMPLOYEE_PROFILE_NS } from "../../../../constants";
import { updateEmployeeAccountSchema } from "../../../../validation";

interface IProps {
  employeeData :EmployeeProfileCredentials
}

const UpdateInformationSection = ({ employeeData }: IProps) => {
  const { t } = useTranslation([EMPLOYEE_PROFILE_NS]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeProfileCredentials>({
    resolver: yupResolver(updateEmployeeAccountSchema),
    mode: "onChange",
  });

    // Reset form when `me` data is available
    useEffect(() => {
      if (employeeData) {
        reset({ 
          email: employeeData.email, 
          username: employeeData.username, 
          fullName: employeeData.fullName, 
          phoneNumber: employeeData.phoneNumber,
          ssn: employeeData.ssn 
        });
      }
    }, [employeeData, reset]);

    const { mutate: updateEmployeeProfile, isPending: isUpdateEmployeeProfileLoading } = useUpdateEmployeeProfile();
      
  const handleConfirmEdit: SubmitHandler<EmployeeProfileCredentials> = async (request) => {
    if (employeeData) {
      request.id = employeeData.id;
      updateEmployeeProfile(request);
    }
  };


  return (
    <form className="space-y-5" onSubmit={handleSubmit(handleConfirmEdit)}>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <Field className="space-y-2">
          <Label size="lg">{t(`form.username.label`)}</Label>
          <Input
            placeholder={t("form.username.placeholder")}
            {...register("username")}
            isError={!!errors["username"]}
          />
          {errors["username"] && (
            <InputErrorMessage>
              {t(`form.username.inputValidation.${errors["username"].type}`)}
            </InputErrorMessage>
          )}
        </Field>

        <Field className="space-y-2">
          <Label size="lg">{t(`form.email.label`)}</Label>
          <Input
            placeholder={t("form.email.placeholder")}
            {...register("email")}
            isError={!!errors["email"]}
          />
          {errors["email"] && (
            <InputErrorMessage>
              {t(`form.email.inputValidation.${errors["email"].type}`)}
            </InputErrorMessage>
          )}
        </Field>

        {/* Full Name */}
        <Field className="space-y-2">
          <Label size="lg">{t("form.fullName.label")}</Label>
          <Input
            placeholder={t("form.fullName.placeholder")}
            {...register("fullName")}
            isError={!!errors["fullName"]}
          />
          {errors["fullName"] && (
            <InputErrorMessage>
              {t(`form.fullName.inputValidation.${errors["fullName"].type}`)}
            </InputErrorMessage>
          )}
        </Field>

        {/* SSN */}
        <Field className="space-y-2">
          <Label size="lg">{t("form.ssn.label")}</Label>
          <Input
            placeholder={t("form.ssn.placeholder")}
            {...register("ssn")}
            isError={!!errors["ssn"]}
          />
          {errors["ssn"] && (
            <InputErrorMessage>
              {t(`form.ssn.inputValidation.${errors["ssn"].type}`)}
            </InputErrorMessage>
          )}
        </Field>

        {/* Phone Number */}
        <Field className="space-y-2">
          <Label size="lg">{t("form.phoneNumber.label")}</Label>
          <Input
            placeholder={t("form.phoneNumber.placeholder")}
            {...register("phoneNumber")}
            isError={!!errors["phoneNumber"]}
          />
          {errors["phoneNumber"] && (
            <InputErrorMessage>
              {t(`form.phoneNumber.inputValidation.${errors["phoneNumber"].type}`)}
            </InputErrorMessage>
          )}
        </Field>
      </div>

      <Button fullWidth={false} isLoading={isUpdateEmployeeProfileLoading}>
        {isUpdateEmployeeProfileLoading ? 
            t("updateSection.buttons.loading")
            : t("updateSection.buttons.update")}
      </Button>
    </form>
  )
}

export default UpdateInformationSection
