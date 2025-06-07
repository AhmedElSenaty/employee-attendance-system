import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { DeleteManagerPopup, RenderManagerInputs, UnblockManagerPopup } from "./views";
import { Button, ButtonSkeleton, Field, Header, Input, InputErrorMessage, Label, SectionHeader } from "../../../components/ui";
import { getManagerSchema, passwordUpdateSchema } from "../../../validation";
import { IManagerCredentials } from "../../../interfaces";
import { useGetManagerByID, useManageManagers } from "../../../hooks/useManagerHook";
import { useUpdateUserPermissions } from "../../../hooks/permission.hooks";
import { useManageAccount } from "../../../hooks/useAccountHook";
import { RenderPermissionCheckboxes } from "../../Admin/manage-permissions/views";
import { RenderDepartmentCheckboxes } from "../../Admin/manage-departments/views";
import { MANAGER_TRANSLATION_NAMESPACE } from ".";
import { HasPermission } from "../../../components/auth";
import { useUpdateUserDepartments } from "../../../hooks/department.hooks";

const EditManagerPage = () => {
  const { t } = useTranslation(["common", MANAGER_TRANSLATION_NAMESPACE]);
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);
  const [checkedDepartments, setCheckedDepartments] = useState<number[]>([]);
  
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isUnblockPopupOpen, setIsUnblockPopupOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue
  } = useForm<IManagerCredentials>({
    resolver: yupResolver(getManagerSchema(true)),
    mode: "onChange",
  });

  // Form handling for updating password (separate form for password change)
  const {
    register: updatePasswordRegister,  // Register function for the password form
    handleSubmit: handleSubmitUpdatePassword,  // Handle form submission for password update
    formState: { errors: updatePasswordErrors },  // Store form errors related to password update
  } = useForm<{ password: string, confirmPassword: string }>({
    resolver: yupResolver(passwordUpdateSchema(false)), // Validation schema for password form
    mode: "onChange", // Trigger validation on input change
  });

  const { manager, isManagerDataLoading } = useGetManagerByID(id || "", reset)
  
  useEffect(() => {
    setCheckedPermissions(manager?.permissions || [])
    setCheckedDepartments(manager?.department.id ? [manager.department.id] : []);
  }, [manager, isManagerDataLoading])


  const {
    updateManager,
    isupdateing,
    deleteManager,
    isDeleting,
  } = useManageManagers();

  const handleConfirmEdit: SubmitHandler<IManagerCredentials> = async (request: IManagerCredentials) => {
    request.id = id
    updateManager(request)
  };

  const handleConfirmDelete = () => {
    deleteManager(id || "")
    setIsDeletePopupOpen(false)
    navigate(`/admin/manage-managers/`) 
  };

  const { mutate: updateUserDepartments, isPending: isUserDepartmentsUpdating } = useUpdateUserDepartments();


  const handleConfirmUpdateDepartments = () => {
    updateUserDepartments({
      userID: id || "",
      departments: checkedDepartments,
    });
  };

  const {
    mutate: updateUserPermissions,
    isPending: isUserPermissionsUpdating
  } = useUpdateUserPermissions();

  const handleConfirmUpdatePermissions = () => {
    updateUserPermissions({
      userID: id || "",
      permissions: checkedPermissions,
    });
  };

  const {
    updateAccountPassword,
    isUpdateAccountPasswordLoading,
    unblockAccount,
    isUnblockAccountLoading,
  } = useManageAccount();


  const handleConfirmUpdatePassword: SubmitHandler<{password: string}> = async (request: { password: string }) => {
    updateAccountPassword({
      password: request.password,
      userID: id || ""
    });
  };

  const handleConfirmUnblock = () => {
    unblockAccount(id || "")
    setIsUnblockPopupOpen(false)
  };


  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header 
          heading={t("updateManagerPage.header.heading", { ns: MANAGER_TRANSLATION_NAMESPACE })}
          subtitle={t("updateManagerPage.header.subtitle", { ns: MANAGER_TRANSLATION_NAMESPACE })}
        />
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("updateManagerPage.managerInformationsSectionHeader.title", { ns: MANAGER_TRANSLATION_NAMESPACE })} 
            description={t("updateManagerPage.managerInformationsSectionHeader.description", { ns: MANAGER_TRANSLATION_NAMESPACE })} 
          />
          <form className="space-y-5" onSubmit={handleSubmit(handleConfirmEdit)}>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <RenderManagerInputs 
                checkedPermissionsHandler={setCheckedPermissions} 
                register={register} 
                errors={errors} 
                control={control} 
                setValue={setValue} 
                isUpdateManager={true} 
                isLoading={isManagerDataLoading}
                t={t}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {
                isManagerDataLoading ? (
                  <>
                    <div className="w-36">
                      <ButtonSkeleton fullWidth={false} />
                    </div>
                    <div className="w-36">
                      <ButtonSkeleton fullWidth={false} />
                    </div>
                    <div className="w-36">
                      <ButtonSkeleton fullWidth={false} />
                    </div>
                  </>
                ) : (
                  <>
                    <HasPermission permission="Update Manager">
                      <Button 
                        fullWidth={false} 
                        isLoading={isupdateing}
                      >
                        {t("updateManagerPage.updateButton", { ns: MANAGER_TRANSLATION_NAMESPACE })}
                      </Button>
                    </HasPermission>
                    <HasPermission permission="Unlock Account">
                      {
                        manager?.isBlocked && (
                          <Button 
                            fullWidth={false} 
                            isLoading={isUnblockAccountLoading}
                            variant={"black"}
                            type="button"
                            onClick={() => setIsUnblockPopupOpen(true)}
                          >
                            {t("buttons.unblock")}
                          </Button>
                        )
                      }
                    </HasPermission>
                    <HasPermission permission="Delete Manager">
                      <Button
                        fullWidth={false}
                        isLoading={isDeleting}
                        variant={"danger"}
                        type="button"
                        onClick={() => setIsDeletePopupOpen(true)}
                      >
                        {t("updateManagerPage.deleteButton", { ns: MANAGER_TRANSLATION_NAMESPACE })}
                      </Button>
                    </HasPermission>
                  </>
                )
              }
            </div>
          </form>
        </div>

        {/* Password Update Section */}
        <HasPermission permission="Update Password">
          <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
            <SectionHeader 
              title={t("updateManagerPage.managerPasswordSectionHeader.title", { ns: MANAGER_TRANSLATION_NAMESPACE })} 
              description={t("updateManagerPage.managerPasswordSectionHeader.description", { ns: MANAGER_TRANSLATION_NAMESPACE })}
            />
            <form className="space-y-5" onSubmit={handleSubmitUpdatePassword(handleConfirmUpdatePassword)}>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password input field */}
                <Field className="space-y-2">
                  <Label size="lg">{t(`form.password.label`, { ns: MANAGER_TRANSLATION_NAMESPACE })}</Label>
                  <Input
                    placeholder={t("form.password.placeholder", { ns: MANAGER_TRANSLATION_NAMESPACE })}
                    type="password"
                    {...updatePasswordRegister("password")}
                    isError={!!updatePasswordErrors["password"]}
                  />
                  {updatePasswordErrors["password"] && (
                    <InputErrorMessage>
                      {t(`form.password.inputValidation.${updatePasswordErrors["password"].type === "matches" ? updatePasswordErrors["password"].message : updatePasswordErrors["password"].type}`, {
                        ns: MANAGER_TRANSLATION_NAMESPACE,
                      })}
                    </InputErrorMessage>
                  )}
                </Field>
                
                {/* Confirm Password input field */}
                <Field className="space-y-2">
                  <Label size="lg">{t(`form.confirmPassword.label`, { ns: MANAGER_TRANSLATION_NAMESPACE })}</Label>
                  <Input
                    placeholder={t("form.confirmPassword.placeholder", { ns: MANAGER_TRANSLATION_NAMESPACE })}
                    type="password"
                    {...updatePasswordRegister("confirmPassword")}
                    isError={!!updatePasswordErrors["confirmPassword"]}
                  />
                  {updatePasswordErrors["confirmPassword"] && (
                    <InputErrorMessage>
                      {t(`form.confirmPassword.inputValidation.${updatePasswordErrors["confirmPassword"].type}`, { ns: MANAGER_TRANSLATION_NAMESPACE })}
                    </InputErrorMessage>
                  )}
                </Field>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  fullWidth={false} 
                  isLoading={isUpdateAccountPasswordLoading}
                >
                  {t("updateManagerPage.updatePasswordButton", { ns: MANAGER_TRANSLATION_NAMESPACE })}
                </Button>
              </div>
            </form>
          </div>
        </HasPermission>

        <HasPermission permission="Update User Permissions">
          <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
            <SectionHeader 
              title={t("updateManagerPage.permissionsSectionHeader.title", { ns: MANAGER_TRANSLATION_NAMESPACE })} 
              description={t("updateManagerPage.permissionsSectionHeader.description", { ns: MANAGER_TRANSLATION_NAMESPACE })} 
            />
            <RenderPermissionCheckboxes
              checkedPermissions={checkedPermissions}
              setCheckedPermissions={setCheckedPermissions}
              isLoading={isManagerDataLoading}
            />
            {isManagerDataLoading ? (
                <div className="w-36">
                  <ButtonSkeleton fullWidth={false} />
                </div>
              ) : (
                <Button 
                  fullWidth={false} 
                  isLoading={isUserPermissionsUpdating} 
                  onClick={handleConfirmUpdatePermissions}
                >
                  {t("updateManagerPage.updatePermissionsButton", { ns: MANAGER_TRANSLATION_NAMESPACE })}
                </Button>
              )
            }
          </div>
        </HasPermission>
        <HasPermission permission="Grant Department Access">
          <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
            <SectionHeader 
              title={t("updateManagerPage.departmentsSectionHeader.title", { ns: MANAGER_TRANSLATION_NAMESPACE })} 
              description={t("updateManagerPage.departmentsSectionHeader.description", { ns: MANAGER_TRANSLATION_NAMESPACE })} 
            />
            <RenderDepartmentCheckboxes
              checkedDepartments={checkedDepartments}
              setCheckedDepartments={setCheckedDepartments}
              needSelectOne={true}
              isLoading={isManagerDataLoading}
            />
            {
              isManagerDataLoading ? (
                <div className="w-36">
                  <ButtonSkeleton fullWidth={false} />
                </div>
              ) : (
                <Button 
                  fullWidth={false} 
                  onClick={handleConfirmUpdateDepartments}
                  isLoading={isUserDepartmentsUpdating} 
                >
                  {t("updateManagerPage.updateDepartmentsButton", { ns: MANAGER_TRANSLATION_NAMESPACE })}
                </Button>
              )
            }
          </div>
        </HasPermission>
      </div>
      <DeleteManagerPopup
        isOpen={isDeletePopupOpen}
        handleClose={() => { setIsDeletePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        t={t}
      />
      <UnblockManagerPopup
        isOpen={isUnblockPopupOpen}
        handleClose={() => { setIsUnblockPopupOpen(false) }}
        handleConfirmUnblock={handleConfirmUnblock}
        isLoading={isUnblockAccountLoading}
        t={t}
      />
    </>
  )
}

export default EditManagerPage