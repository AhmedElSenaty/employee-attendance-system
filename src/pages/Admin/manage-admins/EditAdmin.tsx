import { useEffect, useState } from "react";
import { Button, ButtonSkeleton, SectionHeader, Header, Field, Input, InputErrorMessage, Label } from "../../../components/ui";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { HasPermission } from "../../../components/auth";
import { ADMIN_NS } from "../../../constants";
import { AdminFormValues, getAdminSchema, passwordUpdateSchema } from "../../../validation";
import { useDeleteAdmin, useGetAdminByID, useUnblockAccount, useUpdateAccountPassword, useUpdateAdmin, useUpdateUserDepartments, useUpdateUserPermissions } from "../../../hooks";
import { AdminCredentials } from "../../../interfaces";
import { DeletePopup, Inputs, UnblockPopup } from "./views";
import { PermissionCheckboxes } from "../manage-permissions/views";
import { DepartmentCheckboxes } from "../manage-departments/views";

const EditAdminPage = () => {
  const { t } = useTranslation([ADMIN_NS]);

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
  } = useForm<AdminFormValues>({
    resolver: yupResolver(getAdminSchema(true)),
    mode: "onChange",
  });

  const {
    register: updatePasswordRegister,
    handleSubmit: handleSubmitUpdatePassword,
    formState: { errors: updatePasswordErrors },
  } = useForm<{ password: string, confirmPassword: string }>({
    resolver: yupResolver(passwordUpdateSchema(false)),
    mode: "onChange",
  });

  const { admin, isAdminDataLoading } = useGetAdminByID(id || "", reset);

  useEffect(() => {
    setCheckedPermissions(admin?.permissions || []);
    setCheckedDepartments(admin?.departments || []);
  }, [admin, isAdminDataLoading]); 

  const { mutate: updateAdmin, isPending: isupdateing } = useUpdateAdmin();
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();


  const handleConfirmEdit: SubmitHandler<AdminCredentials> = async (request: AdminCredentials) => {
    request.id = id; 
    updateAdmin(request);
  };

  const handleConfirmDelete = () => {
    deleteAdmin(id || "");
    setIsDeletePopupOpen(false);
    navigate(`/admin/manage-admins/`);
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
      userID: id || "",        // Passing user ID, falling back to empty string if unavailable
      permissions: checkedPermissions, // Passing selected permissions
    });
  };

  const { mutate: updateAccountPassword, isPending: isUpdateAccountPasswordLoading } = useUpdateAccountPassword();
  const { mutate: unblockAccount, isPending: isUnblockAccountLoading } = useUnblockAccount();

  // Handler for confirming the password update action
  const handleConfirmUpdatePassword: SubmitHandler<{password: string}> = async (request: { password: string }) => {
    updateAccountPassword({
      password: request.password, // Passing the new password
      userId: id || "",           // Passing the user ID, falling back to empty string if unavailable
    });
  };

  // Handler for confirming the unblock action for the account
  const handleConfirmUnblock = () => {
    unblockAccount(id || "");  // Unblock the account by user ID, falling back to empty string if unavailable
    setIsUnblockPopupOpen(false); // Close the unblock confirmation popup
  };

  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        {/* Header section with dynamic translations for the title and subtitle */}
        <Header 
          heading={t("updateAdminPage.header.heading")} 
          subtitle={t("updateAdminPage.header.subtitle")}
        />

        {/* Main form section for updating admin details */}
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("updateAdminPage.adminInformationsSectionHeader.title")} 
            description={t("updateAdminPage.adminInformationsSectionHeader.description")}
          />
          <form className="space-y-5" onSubmit={handleSubmit(handleConfirmEdit)}>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Render input fields for the admin details */}
              <Inputs 
                checkedPermissionsHandler={setCheckedPermissions} 
                register={register} 
                errors={errors} 
                control={control} 
                setValue={setValue} 
                isUpdateAdmin={true} 
                isLoading={isAdminDataLoading}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Show loading skeletons if the data is loading */}
              {isAdminDataLoading ? (
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
                  <HasPermission permission="Update Admin">
                    {/* Update admin button */}
                    <Button fullWidth={false} isLoading={isupdateing}>
                      {t("updateAdminPage.updateAdminButton")}
                    </Button>
                  </HasPermission>
                  

                  {/* Unblock button if the admin is blocked */}
                  <HasPermission permission="Unlock Account">
                    {admin?.isBlocked && (
                      <Button 
                        fullWidth={false} 
                        isLoading={isUnblockAccountLoading}
                        variant={"black"}
                        type="button"
                        onClick={() => setIsUnblockPopupOpen(true)}
                      >
                        {t("buttons.unblock")}
                      </Button>
                    )}
                  </HasPermission>
                  <HasPermission permission="Delete Admin">
                    {/* Delete admin button */}
                    <Button
                      fullWidth={false}
                      isLoading={isDeleting}
                      variant={"danger"}
                      type="button"
                      onClick={() => setIsDeletePopupOpen(true)}
                    >
                      {t("updateAdminPage.deleteAdminButton")}
                    </Button>
                  </HasPermission>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Password Update Section */}
        <HasPermission permission="Update Password">
          <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
            <SectionHeader 
              title={t("updateAdminPage.adminInformationsSectionHeader.title")} 
              description={t("updateAdminPage.adminInformationsSectionHeader.description")}
            />
            <form className="space-y-5" onSubmit={handleSubmitUpdatePassword(handleConfirmUpdatePassword)}>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password input field */}
                <Field className="space-y-2">
                  <Label size="lg">{t(`form.password.label`)}</Label>
                  <Input
                    placeholder={t("form.password.placeholder")}
                    type="password"
                    {...updatePasswordRegister("password")}
                    isError={!!updatePasswordErrors["password"]}
                  />
                  {updatePasswordErrors["password"] && (
                    <InputErrorMessage>
                      {t(`form.password.inputValidation.${updatePasswordErrors["password"].type === "matches" ? updatePasswordErrors["password"].message : updatePasswordErrors["password"].type}`)}
                    </InputErrorMessage>
                  )}
                </Field>
                
                {/* Confirm Password input field */}
                <Field className="space-y-2">
                  <Label size="lg">{t(`form.confirmPassword.label`)}</Label>
                  <Input
                    placeholder={t("form.confirmPassword.placeholder")}
                    type="password"
                    {...updatePasswordRegister("confirmPassword")}
                    isError={!!updatePasswordErrors["confirmPassword"]}
                  />
                  {updatePasswordErrors["confirmPassword"] && (
                    <InputErrorMessage>
                      {t(`form.confirmPassword.inputValidation.${updatePasswordErrors["confirmPassword"].type}`)}
                    </InputErrorMessage>
                  )}
                </Field>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  fullWidth={false} 
                  isLoading={isUpdateAccountPasswordLoading}
                >
                  {t("updateAdminPage.updatePasswordButton")}
                </Button>
              </div>
            </form>
          </div>
        </HasPermission>

        {/* Permissions Section */}
        <HasPermission permission="Update User Permissions">
          <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
            <SectionHeader 
              title={t("updateAdminPage.permissionsSectionHeader.title")} 
              description={t("updateAdminPage.permissionsSectionHeader.description")}
            />
            <PermissionCheckboxes
              checked={checkedPermissions}
              setChecked={setCheckedPermissions}
              isLoading={isAdminDataLoading}
            />
            {isAdminDataLoading ? (
              <div className="w-36">
                <ButtonSkeleton fullWidth={false} />
              </div>
            ) : (
              <Button 
                fullWidth={false} 
                isLoading={isUserPermissionsUpdating} 
                onClick={handleConfirmUpdatePermissions}
              >
                {t("updateAdminPage.updateAdminPermissionsButton")}
              </Button>
            )}
          </div>
        </HasPermission>

        {/* Departments Section */}
        <HasPermission permission="Grant Department Access">
          <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
            <SectionHeader 
              title={t("updateAdminPage.departmentsSectionHeader.title")} 
              description={t("updateAdminPage.departmentsSectionHeader.description")}
            />
            <DepartmentCheckboxes
              checked={checkedDepartments}
              setChecked={setCheckedDepartments}
              isLoading={isAdminDataLoading}
            />
            {isAdminDataLoading ? (
              <div className="w-36">
                <ButtonSkeleton fullWidth={false} />
              </div>
            ) : (
              <Button 
                fullWidth={false} 
                isLoading={isUserDepartmentsUpdating} 
                onClick={handleConfirmUpdateDepartments}
              >
                {t("updateAdminPage.updateAdminDepartmentsButton")}
              </Button>
            )}
          </div>
        </HasPermission>
      </div>

      {/* Popups for confirming actions */}
      <DeletePopup
        isOpen={isDeletePopupOpen}
        handleClose={() => { setIsDeletePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
      />
      <UnblockPopup
        isOpen={isUnblockPopupOpen}
        handleClose={() => { setIsUnblockPopupOpen(false) }}
        handleConfirmUnblock={handleConfirmUnblock}
        isLoading={isUnblockAccountLoading}
      />
    </>

  )
}

export default EditAdminPage