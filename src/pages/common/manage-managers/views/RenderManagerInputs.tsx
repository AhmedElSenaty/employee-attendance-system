import { FieldErrors, UseFormRegister, useWatch, UseFormSetValue, Control } from "react-hook-form";
import { Field, Input, InputErrorMessage, InputSkeleton, Label, LabelSkeleton, SelectBox, SelectBoxSkeleton } from "../../../../components/ui/Forms";
import { IManagerCredentials } from "../../../../interfaces";
import { TFunction } from "i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../../context/store";
import { useEffect, useState } from "react";
import { useGetProfilePermissions, useGetProfilesList } from "../../../../hooks/useProfileHook";
import { MANAGER_TRANSLATION_NAMESPACE } from "..";

interface IRenderManagerInputsProps {
  register: UseFormRegister<IManagerCredentials>;
  errors: FieldErrors<IManagerCredentials>;
  t: TFunction;
  isUpdateManager?: boolean;
  control: Control<IManagerCredentials>; // required for useWatch
  setValue: UseFormSetValue<IManagerCredentials>; // to programmatically set password
  checkedPermissionsHandler: (profilePermissions: string[]) => void
  isLoading?: boolean
}

const RenderRenderManagerInputs = ({ register, errors, t, isUpdateManager = false, control, setValue, checkedPermissionsHandler, isLoading }: IRenderManagerInputsProps) => {
  const { language } = useSelector((state: RootState) => state.language);
  const { profilesList, profilesListIsLoading } = useGetProfilesList();
  const [selectedProfile, setSelectedProfile] = useState<number>(0)
  const username = useWatch({ control, name: "username" });

  const { profilePermissions, profilePermissionsIsLoading } = useGetProfilePermissions(selectedProfile)

  useEffect(() => {
    if (selectedProfile != 0 && !profilePermissionsIsLoading) {
      checkedPermissionsHandler(profilePermissions)
    }
  }, [selectedProfile, profilePermissions, profilePermissionsIsLoading, checkedPermissionsHandler]);

  useEffect(() => {
    if (!isUpdateManager && username) {
      setValue("password", username + "@123#");
    }
  }, [username, setValue, isUpdateManager]);

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
      </>
    )
  } 

  return (
    <>
      <Field className="space-y-2">
        <Label size="lg">{t(`form.username.label`, { ns: MANAGER_TRANSLATION_NAMESPACE })}</Label>
        <Input
          placeholder={t("form.username.placeholder", { ns: MANAGER_TRANSLATION_NAMESPACE })}
          {...register("username")}
          isError={!!errors["username"]}
        />
        {errors["username"] && (
          <InputErrorMessage>
            {t(`form.username.inputValidation.${errors["username"].type}`, { ns: MANAGER_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>
      {isUpdateManager && (
        <Field className="space-y-2">
          <Label size="lg">{t(`form.email.label`, { ns: MANAGER_TRANSLATION_NAMESPACE })}</Label>
          <Input
            type="email"
            placeholder={t("form.email.placeholder", { ns: MANAGER_TRANSLATION_NAMESPACE })}
            {...register("email")}
            isError={!!errors["email"]}
          />
          {errors["email"] && (
            <InputErrorMessage>
              {t(`form.email.inputValidation.${errors["email"].type}`, { ns: MANAGER_TRANSLATION_NAMESPACE })}
            </InputErrorMessage>
          )}
        </Field>
      )}
      {!isUpdateManager && (
        <Field className="space-y-2">
          <Label size="lg">{t(`form.password.label`, { ns: MANAGER_TRANSLATION_NAMESPACE })}</Label>
          <Input
            placeholder={t("form.password.placeholder", { ns: MANAGER_TRANSLATION_NAMESPACE })}
            type="password"
            {...register("password")}
            isError={!!errors["password"]}
          />
          {errors["password"] && (
            <InputErrorMessage>
              {t(`form.password.inputValidation.${errors["password"].type}`, { ns: MANAGER_TRANSLATION_NAMESPACE })}
            </InputErrorMessage>
          )}
        </Field>
      )}
      <Field className="space-y-2">
        <Label size="lg">{t("form.profile.label", { ns: MANAGER_TRANSLATION_NAMESPACE })}</Label>
        {
          profilesListIsLoading ? (
            <SelectBoxSkeleton />
          ) : (
            <SelectBox
              onChange={(e) => {
                const selectedId = parseInt(e.target.value);
                setSelectedProfile(selectedId);
              }}
            >
              <option value={0}>{t("form.profile.defaultValue", { ns: MANAGER_TRANSLATION_NAMESPACE })}</option>
              {profilesList.map(profile => (
                <option key={profile.id} value={profile.id}>{language == "en" ? profile.nameEn : profile.nameAr }</option>
              ))}
            </SelectBox>
          )
        }
      </Field>
    </>
  );
};

export default RenderRenderManagerInputs;
