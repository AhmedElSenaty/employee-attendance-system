import {
  FieldErrors,
  UseFormRegister,
  useWatch,
  UseFormSetValue,
  Control,
} from "react-hook-form";
import {
  CustomSelect,
  Field,
  Input,
  InputErrorMessage,
  InputSkeleton,
  Label,
  LabelSkeleton,
  SelectBoxSkeleton,
} from "../../../../components/ui";
import { useEffect, useState } from "react";
import {
  useGetProfilePermissions,
  useGetProfilesList,
} from "../../../../hooks/";
import { useLanguageStore } from "../../../../store/";
import { ManagerFormValues } from "../../../../validation";
import { MANAGER_NS } from "../../../../constants";
import { useTranslation } from "react-i18next";
import { ProfileSummary } from "../../../../interfaces";
import { HasPermission } from "../../../../components/auth";

interface Props {
  register: UseFormRegister<ManagerFormValues>;
  errors: FieldErrors<ManagerFormValues>;
  isUpdateManager?: boolean;
  control: Control<ManagerFormValues>; // required for useWatch
  setValue: UseFormSetValue<ManagerFormValues>; // to programmatically set password
  checkedPermissionsHandler: (profilePermissions: string[]) => void;
  isLoading?: boolean;
}

const Inputs = ({
  register,
  errors,
  isUpdateManager = false,
  control,
  setValue,
  checkedPermissionsHandler,
  isLoading,
}: Props) => {
  const { t } = useTranslation([MANAGER_NS]);
  const { language } = useLanguageStore();

  const { profilesList, isLoading: profilesListIsLoading } =
    useGetProfilesList();

  const profileOptions =
    profilesList?.map((profile: ProfileSummary) => ({
      value: profile.id,
      label: language == "ar" ? profile.nameAr : profile.nameEn,
    })) || [];

  const [selectedProfile, setSelectedProfile] = useState<number>(0);
  const username = useWatch({ control, name: "username" });

  const {
    permissions: profilePermissions,
    isLoading: profilePermissionsIsLoading,
  } = useGetProfilePermissions(selectedProfile);

  useEffect(() => {
    if (selectedProfile != 0 && !profilePermissionsIsLoading) {
      checkedPermissionsHandler(profilePermissions);
    }
  }, [
    selectedProfile,
    profilePermissions,
    profilePermissionsIsLoading,
    checkedPermissionsHandler,
  ]);

  useEffect(() => {
    if (!isUpdateManager && username) {
      setValue("password", username + "@123#");
    }
  }, [username, setValue, isUpdateManager]);

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
      {isUpdateManager && (
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
      {!isUpdateManager && (
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
              {t(
                `inputs.password.inputValidation.${
                  errors["password"].type === "matches"
                    ? errors["password"].message
                    : errors["password"].type
                }`
              )}
            </InputErrorMessage>
          )}
        </Field>
      )}

      <HasPermission permission={"Update User Permissions"}>
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
      </HasPermission>
    </>
  );
};

export default Inputs;
