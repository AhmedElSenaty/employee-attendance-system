import { SubmitHandler, useForm } from "react-hook-form";
import { Header } from "../../../components/ui/Header";
import { passwordUpdateSchema, updateEmployeeSchema } from "../../../validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Field, Input, InputErrorMessage, Label } from "../../../components/ui/Form";
import { ADMIN_TRANSLATION_NAMESPACE } from "../../Admin/manage-admins";
import { Button } from "../../../components/ui/Button";
import { useTranslation } from "react-i18next";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { EmployeeProfileCredentials } from "../../../interfaces";
import { useEffect } from "react";
import UserImageUpload from "./UserImageUpload";
import { useFetchMe, useUpdateEmployeeProfile } from "../../../hooks/me.hooks";
import { useUpdateMyPassword } from "../../../hooks/account.hook";

const TRANSLATION_NAMESPACE = "empolyeeAccount";
const EmpolyeeAccountPage = () => {
  const { me } = useFetchMe();
  const { t } = useTranslation(["common", ADMIN_TRANSLATION_NAMESPACE]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeProfileCredentials>({
    resolver: yupResolver(updateEmployeeSchema()), // Validation schema for admin form
    mode: "onChange", // Trigger validation on input change
  });

  // Reset form when `me` data is available
  useEffect(() => {
    if (me) {
      reset({ 
        email: me.email, 
        username: me.username, 
        fullName: me.fullName, 
        phoneNumber: me.phoneNumber,
        ssn: me.ssn 
      });
    }
  }, [me, reset]);
  
  // Handler for confirming the edit action for the admin
  const handleConfirmEdit: SubmitHandler<EmployeeProfileCredentials> = async (request) => {
    if (me) {
      request.id = me.id;
      // Call API to update admin profile
      updateEmployeeProfile(request);
    }
  };

  const {
    register: updatePasswordRegister,
    handleSubmit: handleSubmitUpdatePassword,
    formState: { errors: updatePasswordErrors },
  } = useForm<{ oldPassword?: string, password: string, confirmPassword: string }>({
    resolver: yupResolver(passwordUpdateSchema(true)),
    mode: "onChange",
  });

  const { mutate: updateEmployeeProfile, isPending: isUpdateEmployeeProfileLoading } = useUpdateEmployeeProfile();
  const { mutate: updateMyPassword, isPending: isUpdateMyPasswordLoading } = useUpdateMyPassword();

  const handleConfirmUpdatePassword: SubmitHandler<{password: string, oldPassword?: string}> = async (request: { password: string, oldPassword?: string }) => {
    updateMyPassword({
      oldPassword: request.oldPassword || "",
      password: request.password,
    });
  };

  return (
    <div className="sm:p-6 p-4 space-y-5">
      <Header
        heading={t(`profile.header.heading`, { ns: TRANSLATION_NAMESPACE })}
        subtitle={t(`profile.header.subtitle`, { ns: TRANSLATION_NAMESPACE })}
      />

      <div className="w-full max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-6 sm:p-8 transition-all duration-300 ease-in-out hover:shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
            <img
              src={me?.profileImage ?? "/images/default-user-image.webp"}
              alt="User Avatar"
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">{me?.fullName}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
              <p><span className="font-medium">{t("columns.hiringDate", { ns: TRANSLATION_NAMESPACE })}:</span> {me?.hiringDate}</p>
              <p><span className="font-medium">{t("columns.dateOfBirth", { ns: TRANSLATION_NAMESPACE })}:</span> {me?.dateOfBirth}</p>
              <p><span className="font-medium">{t("columns.phoneNumber", { ns: TRANSLATION_NAMESPACE })}:</span> {me?.phoneNumber == null ? t("table.NA"): me.phoneNumber}</p>
              <p><span className="font-medium">{t("columns.department", { ns: TRANSLATION_NAMESPACE })}:</span> {me?.departmentName}, {me?.subDepartmentName}</p>
              <p><span className="font-medium">{t("columns.delegate", { ns: TRANSLATION_NAMESPACE })}:</span> {me?.delegeteName}, {me?.delegeteSubDepartmentName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Information Section */}
      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader
          title={t(`profile.updateSection.title`, { ns: TRANSLATION_NAMESPACE })}
          description={t(`profile.updateSection.description`, { ns: TRANSLATION_NAMESPACE })}
        />

        <UserImageUpload />
        <form className="space-y-5" onSubmit={handleSubmit(handleConfirmEdit)}>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Full Name */}
            <Field className="space-y-2">
              <Label size="lg">{t("form.fullName.label", { ns: TRANSLATION_NAMESPACE })}</Label>
              <Input
                placeholder={t("form.fullName.placeholder", { ns: TRANSLATION_NAMESPACE })}
                {...register("fullName")}
                isError={!!errors["fullName"]}
              />
              {errors["fullName"] && (
                <InputErrorMessage>
                  {t(`form.fullName.inputValidation.${errors["fullName"].type}`, { ns: TRANSLATION_NAMESPACE })}
                </InputErrorMessage>
              )}
            </Field>

            {/* SSN */}
            <Field className="space-y-2">
              <Label size="lg">{t("form.ssn.label", { ns: TRANSLATION_NAMESPACE })}</Label>
              <Input
                placeholder={t("form.ssn.placeholder", { ns: TRANSLATION_NAMESPACE })}
                {...register("ssn")}
                isError={!!errors["ssn"]}
              />
              {errors["ssn"] && (
                <InputErrorMessage>
                  {t(`form.ssn.inputValidation.${errors["ssn"].type}`, { ns: TRANSLATION_NAMESPACE })}
                </InputErrorMessage>
              )}
            </Field>

            {/* Phone Number */}
            <Field className="space-y-2">
              <Label size="lg">{t("form.phoneNumber.label", { ns: TRANSLATION_NAMESPACE })}</Label>
              <Input
                placeholder={t("form.phoneNumber.placeholder", { ns: TRANSLATION_NAMESPACE })}
                {...register("phoneNumber")}
                isError={!!errors["phoneNumber"]}
              />
              {errors["phoneNumber"] && (
                <InputErrorMessage>
                  {t(`form.phoneNumber.inputValidation.${errors["phoneNumber"].type}`, { ns: TRANSLATION_NAMESPACE })}
                </InputErrorMessage>
              )}
            </Field>
          </div>

          <Button fullWidth={false} isLoading={isUpdateEmployeeProfileLoading}>
            {t("buttons.update")}
          </Button>
        </form>
      </div>

      {/* Update Password Form */}
      <form className="bg-white shadow-md space-y-5 p-5 rounded-lg w-full" onSubmit={handleSubmitUpdatePassword(handleConfirmUpdatePassword)}>
        <SectionHeader
          title={t(`profile.updatePassword.title`, { ns: TRANSLATION_NAMESPACE })}
          description={t(`profile.updatePassword.description`, { ns: TRANSLATION_NAMESPACE })}
        />

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field className="space-y-2">
            <Label size="lg">{t(`form.oldPassword.label`, { ns: TRANSLATION_NAMESPACE })}</Label>
            <Input
              placeholder={t("form.oldPassword.placeholder", { ns: TRANSLATION_NAMESPACE })}
              type="password"
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

    </div>
  );
};

export default EmpolyeeAccountPage;
