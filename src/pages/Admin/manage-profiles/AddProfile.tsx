import { useState } from "react";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { useTranslation } from "react-i18next";
import { Header } from "../../../components/ui/Header";
import { Button } from "../../../components/ui/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSchema } from "../../../validation";
import { IProfileCredentials } from "../../../interfaces";
import { Description } from "../../../components/ui/Forms";
import { RenderProfileInputs } from "./views";
import { useNavigate } from "react-router";
import { RenderPermissionCheckboxes } from "../manage-permissions/views";
import { useManageProfiles } from "../../../hooks/useProfileHook";
import { PROFILE_TRANSLATION_NAMESPACE } from ".";

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

  const {
    addProfileAndGetID,
    isAdding
  } = useManageProfiles();

  const submitForm: SubmitHandler<IProfileCredentials> = async (request: IProfileCredentials) => {
    try {
      request.permissionsIds = checkedPermissions || []
      
      // Use the addAdminWithResponse function
      const profileID = (await addProfileAndGetID(request)).data?.data.id;
      navigate(`/admin/edit-profile/${profileID}`)
    } catch (error) {
      // Handle error here if needed
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