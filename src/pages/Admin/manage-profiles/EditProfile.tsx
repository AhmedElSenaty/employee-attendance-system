import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, ButtonSkeleton, SectionHeader, Header, Description } from "../../../components/ui";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSchema } from "../../../validation";
import { IProfileCredentials } from "../../../interfaces";
import { DeleteProfilePopup, RenderProfileInputs } from "./views";
import { useNavigate, useParams } from "react-router";
import { RenderPermissionCheckboxes } from "../manage-permissions/views";
import { PROFILE_TRANSLATION_NAMESPACE } from ".";
import { HasPermission } from "../../../components/auth";
import { useDeleteProfile, useGetProfileByID, useUpdateProfile } from "../../../hooks/profile.hooks";

const EditProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { t } = useTranslation(["common", PROFILE_TRANSLATION_NAMESPACE]);

  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);
  const [isDeleteProfilePopupOpen, setIsDeleteProfilePopupOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IProfileCredentials>({
    resolver: yupResolver(profileSchema),
    mode: "onChange",
  });

  const { profile, isProfileDataLoading } = useGetProfileByID(id || "", reset)

  useEffect(() => {
    setCheckedPermissions(profile?.permissionsIds || [])
  }, [profile, isProfileDataLoading])


  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();


  const submitForm: SubmitHandler<IProfileCredentials> = async (request: IProfileCredentials) => {
    request.permissionsIds = checkedPermissions || []
    updateProfile(request);
    
  };

  const { mutate: deleteProfile, isPending: isDeleting } = useDeleteProfile();

  const handleConfirmDelete = () => {
    deleteProfile(profile.id)
    setIsDeleteProfilePopupOpen(false)
    navigate(`/admin/manage-profiles/`) 
  };

  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header
          heading={t("updateProfilePage.header.heading", { ns: PROFILE_TRANSLATION_NAMESPACE })}
          subtitle={t("updateProfilePage.header.subtitle", { ns: PROFILE_TRANSLATION_NAMESPACE })}
        />
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("updateProfilePage.profileInformationsSectionHeader.title", { ns: PROFILE_TRANSLATION_NAMESPACE })} 
            description={t("updateProfilePage.profileInformationsSectionHeader.description", { ns: PROFILE_TRANSLATION_NAMESPACE })} 
          />
          <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              {
                <RenderProfileInputs
                  register={register}
                  errors={errors}
                  isLoading={isProfileDataLoading}
                  t={t}
                />
              }
            </div>
            <Description>{t("form.note", { ns: PROFILE_TRANSLATION_NAMESPACE })}</Description>
            <div className="flex flex-wrap gap-3">
              {
                isProfileDataLoading ? (
                  <>
                    <div className="w-36">
                      <ButtonSkeleton fullWidth={false} />
                    </div>
                    <div className="w-36">
                      <ButtonSkeleton fullWidth={false} />
                    </div>
                  </>
                ) : (
                  <>
                    <HasPermission permission="Update Profile">
                      <Button fullWidth={false} isLoading={isUpdating} >{t("updateProfilePage.saveProfileButton", { ns: PROFILE_TRANSLATION_NAMESPACE })}</Button>
                    </HasPermission>
                    <HasPermission permission="Delete Profile">
                      <Button
                        fullWidth={false}
                        isLoading={isDeleting}
                        variant={"danger"}
                        type="button"
                        onClick={() => setIsDeleteProfilePopupOpen(true)}
                      >
                        {t("updateProfilePage.deleteProfileButton", { ns: PROFILE_TRANSLATION_NAMESPACE })}
                      </Button>
                    </HasPermission>
                  </>
                )
              }
            </div>
          </form>
        </div>
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("updateProfilePage.permissionsSectionHeader.title", { ns: PROFILE_TRANSLATION_NAMESPACE })} 
            description={t("updateProfilePage.permissionsSectionHeader.description", { ns: PROFILE_TRANSLATION_NAMESPACE })} 
          />
          <RenderPermissionCheckboxes 
            checkedPermissions={checkedPermissions}
            setCheckedPermissions={setCheckedPermissions}
            isLoading={isProfileDataLoading}
          />
        </div>
      </div>
      <DeleteProfilePopup
        isOpen={isDeleteProfilePopupOpen}
        handleClose={() => { setIsDeleteProfilePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        t={t}
      />
    </>
  )
}

export default EditProfilePage