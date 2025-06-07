import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSchema } from "../../../validation";
import { IProfileCredentials } from "../../../interfaces";
import { Description, Button, Header, SectionHeader } from "../../../components/ui/";
import { RenderProfileInputs } from "./views";
import { useNavigate } from "react-router";
import { RenderPermissionCheckboxes } from "../manage-permissions/views";
import { PROFILE_TRANSLATION_NAMESPACE } from ".";
import { useCreateProfile } from "../../../hooks/profile.hooks";

const AddProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["common", PROFILE_TRANSLATION_NAMESPACE]);

  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProfileCredentials>({
    resolver: yupResolver(profileSchema),
    mode: "onChange",
  });

  const { mutateAsync: addProfile, isPending: isAdding } = useCreateProfile();

  const submitForm: SubmitHandler<IProfileCredentials> = async (formData) => {
    try {
      const request: IProfileCredentials = {
        ...formData,
        permissionsIds: checkedPermissions ?? [],
      };
  
      const response = await addProfile(request);
      const profileId = response?.data?.data?.id;
  
      if (profileId) {
        navigate(`/admin/edit-profile/${profileId}`);
      } else {
        console.error("No profile ID returned in response:", response);
      }
    } catch (error) {
      console.error("Error adding profile:", error);
    }
  };
  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header
          heading={t("addProfilePage.header.heading", { ns: PROFILE_TRANSLATION_NAMESPACE })}
          subtitle={t("addProfilePage.header.subtitle", { ns: PROFILE_TRANSLATION_NAMESPACE })}
        />
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("addProfilePage.profileInformationsSectionHeader.title", { ns: PROFILE_TRANSLATION_NAMESPACE })} 
            description={t("addProfilePage.profileInformationsSectionHeader.description", { ns: PROFILE_TRANSLATION_NAMESPACE })} 
          />
          <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              {<RenderProfileInputs register={register} errors={errors} t={t}  />}
            </div>
            <Description>{t("form.note", { ns: PROFILE_TRANSLATION_NAMESPACE })}</Description>
            <Button fullWidth={false} isLoading={isAdding} >{t("addProfilePage.saveProfileButton", { ns: PROFILE_TRANSLATION_NAMESPACE })}</Button>
          </form>
        </div>
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("addProfilePage.permissionsSectionHeader.title", { ns: PROFILE_TRANSLATION_NAMESPACE })} 
            description={t("addProfilePage.permissionsSectionHeader.description", { ns: PROFILE_TRANSLATION_NAMESPACE })} 
          />
          <RenderPermissionCheckboxes 
            checkedPermissions={checkedPermissions}
            setCheckedPermissions={setCheckedPermissions}
          />
        </div>
      </div>
    </>
  )
}

export default AddProfilePage