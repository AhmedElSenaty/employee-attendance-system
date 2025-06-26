import { FieldErrors, UseFormRegister, useWatch, UseFormSetValue, Control } from "react-hook-form";
import { CustomSelect, Field, Input, InputErrorMessage, InputSkeleton, Label, LabelSkeleton, SelectBoxSkeleton } from "../../../../components/ui";
import { useEffect, useState } from "react";
import { AdminFormValues } from "../../../../validation";
import { useTranslation } from "react-i18next";
import { ADMIN_NS } from "../../../../constants";
import { useLanguageStore } from "../../../../store";
import { useGetProfilePermissions, useGetProfilesList } from "../../../../hooks";
import { ProfileSummary } from "../../../../interfaces";

interface Props {
  register: UseFormRegister<AdminFormValues>;
  errors: FieldErrors<AdminFormValues>;
  isUpdateAdmin?: boolean;
  control: Control<AdminFormValues>; // required for useWatch
  setValue: UseFormSetValue<AdminFormValues>; // to programmatically set password
  checkedPermissionsHandler: (profilePermissions: string[]) => void
  isLoading?: boolean
}

const Inputs = ({ 
  register, 
  errors, 
  isUpdateAdmin = false, 
  control, 
  setValue, 
  checkedPermissionsHandler, 
  isLoading 
}: Props) => {
  const { t } = useTranslation([ADMIN_NS]);
  const { language } = useLanguageStore();

  const { profilesList, isLoading: profilesListIsLoading } = useGetProfilesList();

  const profileOptions = profilesList?.map((profile: ProfileSummary) => ({
    value: profile.id,
    label: language == "ar" ? profile.nameAr : profile.nameEn,
  })) || [];

  const [selectedProfile, setSelectedProfile] = useState<number>(0)
  const username = useWatch({ control, name: "username" });
  
  const { permissions: profilePermissions, isLoading: profilePermissionsIsLoading } = useGetProfilePermissions(selectedProfile)

  useEffect(() => {
    if (selectedProfile != 0 && !profilePermissionsIsLoading) {
      checkedPermissionsHandler(profilePermissions)
    }
  }, [selectedProfile, profilePermissions, profilePermissionsIsLoading, checkedPermissionsHandler]);

  useEffect(() => {
    if (!isUpdateAdmin && username) {
      setValue("password", username + "@123#");
    }
  }, [username, setValue, isUpdateAdmin]);

  // If data is still loading, show skeletons to indicate loading state

  if (isLoading) {
    return (
      <>
        {[...Array(4)].map((_, i) => (
          <Field key={i} className="space-y-2">
            <LabelSkeleton />
            <InputSkeleton />
          </Field>
        ))}
      </>
    );
  }

  return (
    <>
      {/* Username Input Field */}
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

      {/* Title Input Field */}
      <Field className="space-y-2">
        <Label size="lg">{t(`inputs.title.label`)}</Label>
        <Input
          placeholder={t("inputs.title.placeholder")}
          {...register("title")}
          isError={!!errors["title"]}
        />
        {errors["title"] && (
          <InputErrorMessage>
            {t(`inputs.title.inputValidation.${errors["title"].type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Email Field (Only shown when updating an admin) */}
      {isUpdateAdmin && (
        <Field className="space-y-2">
          <Label size="lg">{t(`inputs.email.label`)}</Label>
          <Input
            type="email"
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
      )}

      {/* Password Field (Only shown when creating a new admin) */}
      {!isUpdateAdmin && (
        <Field className="space-y-2">
          <Label size="lg">{t(`inputs.password.label`)}</Label>
          <Input
            placeholder={t("inputs.password.placeholder")}
            type="password"
            {...register("password")}
            isError={!!errors["password"]}
          />
          {errors["password"] && (
            <InputErrorMessage>
              {t(`inputs.password.inputValidation.${errors["password"].type === "matches" ? errors["password"].message : errors["password"].type}`)}
            </InputErrorMessage>
          )}
        </Field>
      )}

      {/* Profile Selection */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.profile.label")}</Label>
        {profilesListIsLoading ? (
          <SelectBoxSkeleton />
        ) : (
        <CustomSelect
          options={profileOptions}
          onChange={(option) => {
            if (option?.value !== undefined) {
              setSelectedProfile(Number(option.value));
            }
          }}
          className="w-full"
        />
        )}
      </Field>
    </>
  );
};

export default Inputs;
