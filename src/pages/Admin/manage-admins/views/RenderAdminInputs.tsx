import { FieldErrors, UseFormRegister, useWatch, UseFormSetValue, Control } from "react-hook-form";
import { Field, Input, InputErrorMessage, InputSkeleton, Label, LabelSkeleton, SelectBox, SelectBoxSkeleton } from "../../../../components/ui";
import { IAdminCredentials } from "../../../../interfaces";
import { TFunction } from "i18next";
import { useEffect, useState } from "react";
import { useGetProfilePermissions, useGetProfilesList } from "../../../../hooks/profile.hooks";
import { ADMIN_TRANSLATION_NAMESPACE } from "..";
import { useLanguageStore } from "../../../../store/language.store";

interface IAdminInputsProps {
  register: UseFormRegister<IAdminCredentials>; // hook-form's register method for form field registration
  errors: FieldErrors<IAdminCredentials>; // Validation errors for form fields
  t: TFunction; // i18n translation function
  isUpdateAdmin?: boolean; // Flag to check if we're updating an existing admin
  control: Control<IAdminCredentials>; // Hook to manage form state and watch for changes
  setValue: UseFormSetValue<IAdminCredentials>; // Function to programmatically set form values (e.g., password)
  checkedPermissionsHandler: (profilePermissions: string[]) => void; // Handler to update profile permissions
  isLoading?: boolean; // Loading state, determines if we show skeleton loaders
}

const RenderAdminInputs = ({ 
  register, 
  errors, 
  t, 
  isUpdateAdmin = false, 
  control, 
  setValue, 
  checkedPermissionsHandler, 
  isLoading 
}: IAdminInputsProps) => {
  const { profilesList, profilesListIsLoading } = useGetProfilesList(); // Fetch profiles list for selection
    const { language } = useLanguageStore(); // Current language for localization
  const [selectedProfile, setSelectedProfile] = useState<number>(0); // Store the selected profile ID
  const username = useWatch({ control, name: "username" }); // Watch for changes in the username field

  // Fetch profile permissions when profile is selected
  const { profilePermissions, profilePermissionsIsLoading } = useGetProfilePermissions(selectedProfile);

  useEffect(() => {
    if (selectedProfile !== 0 && !profilePermissionsIsLoading) {
      // Pass the fetched permissions to the parent component
      checkedPermissionsHandler(profilePermissions);
    }
  }, [selectedProfile, profilePermissions, profilePermissionsIsLoading, checkedPermissionsHandler]);

  // Set default password when creating a new admin
  useEffect(() => {
    if (!isUpdateAdmin && username) {
      setValue("password", `${username}@123#`);
    }
  }, [username, setValue, isUpdateAdmin]);

  // If data is still loading, show skeletons to indicate loading state
  if (isLoading) {
    return (
      <>
        <Field className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
        <Field className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
        <Field className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
        <Field className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
        <Field className="space-y-2">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
      </>
    );
  } 

  return (
    <>
      {/* Username Input Field */}
      <Field className="space-y-2">
        <Label size="lg">{t(`form.username.label`, { ns: ADMIN_TRANSLATION_NAMESPACE })}</Label>
        <Input
          placeholder={t("form.username.placeholder", { ns: ADMIN_TRANSLATION_NAMESPACE })}
          {...register("username")}
          isError={!!errors["username"]}
        />
        {errors["username"] && (
          <InputErrorMessage>
            {t(`form.username.inputValidation.${errors["username"].type}`, { ns: ADMIN_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Title Input Field */}
      <Field className="space-y-2">
        <Label size="lg">{t(`form.title.label`, { ns: ADMIN_TRANSLATION_NAMESPACE })}</Label>
        <Input
          placeholder={t("form.title.placeholder", { ns: ADMIN_TRANSLATION_NAMESPACE })}
          {...register("title")}
          isError={!!errors["title"]}
        />
        {errors["title"] && (
          <InputErrorMessage>
            {t(`form.title.inputValidation.${errors["title"].type}`, { ns: ADMIN_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Email Field (Only shown when updating an admin) */}
      {isUpdateAdmin && (
        <Field className="space-y-2">
          <Label size="lg">{t(`form.email.label`, { ns: ADMIN_TRANSLATION_NAMESPACE })}</Label>
          <Input
            type="email"
            placeholder={t("form.email.placeholder", { ns: ADMIN_TRANSLATION_NAMESPACE })}
            {...register("email")}
            isError={!!errors["email"]}
          />
          {errors["email"] && (
            <InputErrorMessage>
              {t(`form.email.inputValidation.${errors["email"].type}`, { ns: ADMIN_TRANSLATION_NAMESPACE })}
            </InputErrorMessage>
          )}
        </Field>
      )}

      {/* Password Field (Only shown when creating a new admin) */}
      {!isUpdateAdmin && (
        <Field className="space-y-2">
          <Label size="lg">{t(`form.password.label`, { ns: ADMIN_TRANSLATION_NAMESPACE })}</Label>
          <Input
            placeholder={t("form.password.placeholder", { ns: ADMIN_TRANSLATION_NAMESPACE })}
            type="password"
            {...register("password")}
            isError={!!errors["password"]}
          />
          {errors["password"] && (
            <InputErrorMessage>
              {t(`form.password.inputValidation.${errors["password"].type}`, { ns: ADMIN_TRANSLATION_NAMESPACE })}
            </InputErrorMessage>
          )}
        </Field>
      )}

      {/* Profile Selection */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.profile.label", { ns: ADMIN_TRANSLATION_NAMESPACE })}</Label>
        {profilesListIsLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <SelectBox
            onChange={(e) => {
              const selectedId = parseInt(e.target.value);
              setSelectedProfile(selectedId); // Set selected profile ID
            }}
          >
            <option value={0}>{t("form.profile.defaultValue", { ns: ADMIN_TRANSLATION_NAMESPACE })}</option>
            {profilesList.map(profile => (
              <option key={profile.id} value={profile.id}>
                {language === "en" ? profile.nameEn : profile.nameAr }
              </option>
            ))}
          </SelectBox>
        )}
      </Field>
    </>
  );
};

export default RenderAdminInputs;
