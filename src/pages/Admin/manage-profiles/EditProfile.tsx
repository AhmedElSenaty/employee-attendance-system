import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, ButtonSkeleton, SectionHeader, Header, Description } from "../../../components/ui";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProfileFormValues, profileSchema } from "../../../validation";
import { useNavigate, useParams } from "react-router";
import { HasPermission } from "../../../components/auth";
import { useDeleteProfile, useGetProfileByID, useUpdateProfile } from "../../../hooks/profile.hooks";
import { PROFILE_NS } from "../../../constants";
import { ProfileCredentials } from "../../../interfaces";
import { DeletePopup, Inputs } from "./views";
import { PermissionCheckboxes } from "../manage-permissions/views";

const EditProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { t } = useTranslation([PROFILE_NS])

  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);
  const [isDeleteProfilePopupOpen, setIsDeleteProfilePopupOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema),
    mode: "onChange",
  });

  const { profile, isLoading: isProfileDataLoading } = useGetProfileByID(id || "", reset)

  useEffect(() => {
    setCheckedPermissions(profile?.permissionsIds || [])
  }, [profile, isProfileDataLoading])

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();


  const submitForm: SubmitHandler<ProfileFormValues> = async (request: ProfileCredentials) => {
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
          heading={t("editPage.header.heading")}
          subtitle={t("editPage.header.subtitle")}
        />
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("editPage.informationsSectionHeader.title")} 
            description={t("editPage.informationsSectionHeader.description")} 
          />
          <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              {
                <Inputs
                  register={register}
                  errors={errors}
                  isLoading={isProfileDataLoading}
                />
              }
            </div>
            <Description>{t("inputs.note")}</Description>
            <div className="flex flex-wrap gap-3">
              {
                isProfileDataLoading ? (
                  <>
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="w-36">
                        <ButtonSkeleton fullWidth={false} />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <HasPermission permission="Update Profile">
                      <Button fullWidth={false} isLoading={isUpdating} >
                        {
                          isUpdating ? 
                          t("buttons.loading") 
                          : t("editPage.saveProfileButton")
                        }
                      </Button>
                    </HasPermission>
                    <HasPermission permission="Delete Profile">
                      <Button 
                        fullWidth={false} 
                        isLoading={isDeleting} 
                        variant={"danger"}
                        type="button"
                        onClick={() => setIsDeleteProfilePopupOpen(true)}
                      >
                        {
                          isDeleting ? 
                          t("buttons.loading") 
                          : t("editPage.deleteProfileButton")
                        }
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
            title={t("editPage.permissionsSectionHeader.title")} 
            description={t("editPage.permissionsSectionHeader.description")} 
          />
          <PermissionCheckboxes 
            checked={checkedPermissions}
            setChecked={setCheckedPermissions}
            isLoading={isProfileDataLoading}
          />
        </div>
      </div>
      <DeletePopup
        isOpen={isDeleteProfilePopupOpen}
        handleClose={() => { setIsDeleteProfilePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </>
  )
}

export default EditProfilePage