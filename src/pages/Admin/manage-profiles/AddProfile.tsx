import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Description, Button, Header, SectionHeader } from "../../../components/ui/";
import { useNavigate } from "react-router";
import { PermissionCheckboxes } from "../manage-permissions/views";
import { PROFILE_NS } from "../../../constants";
import { ProfileFormValues, profileSchema } from "../../../validation";
import { useCreateProfile } from "../../../hooks";
import { ProfileCredentials } from "../../../interfaces";
import { Inputs } from "./views";

const AddProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation([PROFILE_NS]);

  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema),
    mode: "onChange",
  });

  const { mutateAsync: addProfile, isPending: isAdding } = useCreateProfile();

  const submitForm: SubmitHandler<ProfileFormValues> = async (formData) => {
    try {
      const request: ProfileCredentials = {
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
          heading={t("addPage.header.heading")}
          subtitle={t("addPage.header.subtitle")}
        />
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("addPage.informationsSectionHeader.title")} 
            description={t("addPage.informationsSectionHeader.description")} 
          />
          <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <Inputs register={register} errors={errors} />
            </div>
            <Description>{t("inputs.note")}</Description>
            <Button fullWidth={false} isLoading={isAdding} >
              {
                isAdding ? 
                t("buttons.loading") 
                : t("addPage.saveProfileButton")
              }
            </Button>
          </form>
        </div>
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("addPage.permissionsSectionHeader.title")} 
            description={t("addPage.permissionsSectionHeader.description")} 
          />
          <PermissionCheckboxes 
            checked={checkedPermissions}
            setChecked={setCheckedPermissions}
          />
        </div>
      </div>
    </>
  )
}

export default AddProfilePage