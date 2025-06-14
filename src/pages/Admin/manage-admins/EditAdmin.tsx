import { useEffect, useState } from "react";
import { Button, ButtonSkeleton, SectionHeader, Header, Field, Input, InputErrorMessage, Label } from "../../../components/ui";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { getAdminSchema } from "../../../validation/admin.schema";
import { IAdminCredentials } from "../../../interfaces/admin.interfaces";
import { useNavigate, useParams } from "react-router";
import { DeleteAdminPopup, RenderAdminInputs, UnblockAdminPopup } from "./views";
import { RenderDepartmentCheckboxes } from "../manage-departments/views";
import { RenderPermissionCheckboxes } from "../manage-permissions/views";
import { passwordUpdateSchema } from "../../../validation";
import { ADMIN_TRANSLATION_NAMESPACE } from ".";
import { HasPermission } from "../../../components/auth";
import { useUpdateUserPermissions } from "../../../hooks/permission.hooks";
import { useUpdateUserDepartments } from "../../../hooks/department.hooks";
import { useUnblockAccount, useUpdateAccountPassword } from "../../../hooks/account.hook";
import { useDeleteAdmin, useGetAdminByID, useUpdateAdmin } from "../../../hooks/admin.hooks";

const EditAdminPage = () => {
  // Translation namespace setup for dynamic translation based on context
  const { t } = useTranslation(["common", ADMIN_TRANSLATION_NAMESPACE]);

  // Get the 'id' from URL parameters to identify which admin is being edited/viewed
  const { id } = useParams();
  const navigate = useNavigate();

  // State hooks to manage checked permissions and departments, and open/close state of popups
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);
  const [checkedDepartments, setCheckedDepartments] = useState<number[]>([]);

  // Popup states for delete and unblock actions
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isUnblockPopupOpen, setIsUnblockPopupOpen] = useState(false);
  

  // Form handling for the admin data (name, email, etc.) using react-hook-form and yup validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue
  } = useForm<IAdminCredentials>({
    resolver: yupResolver(getAdminSchema(true)), // Validation schema for admin form
    mode: "onChange", // Trigger validation on input change
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

  // Fetch admin data based on the admin 'id' (using a custom hook that fetches data by ID)
  const { admin, isAdminDataLoading } = useGetAdminByID(id || "", reset);

  // useEffect hook that runs when the 'admin' data or loading state changes
  useEffect(() => {
    // If admin data is available, set the permissions and departments
    setCheckedPermissions(admin?.permissions || []);  // Default to an empty array if permissions are not available
    setCheckedDepartments(admin?.departments || []);   // Default to an empty array if departments are not available
  }, [admin, isAdminDataLoading]);  // Effect triggers when 'admin' data or 'isAdminDataLoading' changes

  // Destructuring functions and loading states from custom hooks for managing admins, departments, and permissions
  const { mutate: updateAdmin, isPending: isupdateing } = useUpdateAdmin();
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();


  // Handler for confirming the edit action for the admin
  const handleConfirmEdit: SubmitHandler<IAdminCredentials> = async (request: IAdminCredentials) => {
    request.id = id; // Adding admin 'id' to the request
    updateAdmin(request); // Call the 'updateAdmin' function to perform the update
  };

  // Handler for confirming the delete action for the admin
  const handleConfirmDelete = () => {
    deleteAdmin(id || ""); // Delete admin by 'id', falling back to empty string if 'id' is unavailable
    setIsDeletePopupOpen(false); // Close the delete confirmation popup
    navigate(`/admin/manage-admins/`); // Navigate to the admin management page after deletion
  };

  // Destructuring functions and loading states for managing user departments
  const { mutate: updateUserDepartments, isPending: isUserDepartmentsUpdating } = useUpdateUserDepartments();

  // Handler for confirming the update action for user departments
  const handleConfirmUpdateDepartments = () => {
    updateUserDepartments({
      userID: id || "",        // Passing user ID, falling back to empty string if unavailable
      departments: checkedDepartments, // Passing selected departments
    });
  };

  // Destructuring functions and loading states for managing user permissions
  const {
    mutate: updateUserPermissions,
    isPending: isUserPermissionsUpdating
  } = useUpdateUserPermissions();

  // Handler for confirming the update action for user permissions
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
          heading={t("updateAdminPage.header.heading", { ns: ADMIN_TRANSLATION_NAMESPACE })} 
          subtitle={t("updateAdminPage.header.subtitle", { ns: ADMIN_TRANSLATION_NAMESPACE })}
        />

        {/* Main form section for updating admin details */}
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("updateAdminPage.adminInformationsSectionHeader.title", { ns: ADMIN_TRANSLATION_NAMESPACE })} 
            description={t("updateAdminPage.adminInformationsSectionHeader.description", { ns: ADMIN_TRANSLATION_NAMESPACE })}
          />
          <form className="space-y-5" onSubmit={handleSubmit(handleConfirmEdit)}>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Render input fields for the admin details */}
              <RenderAdminInputs 
                checkedPermissionsHandler={setCheckedPermissions} 
                register={register} 
                errors={errors} 
                control={control} 
                setValue={setValue} 
                isUpdateAdmin={true} 
                isLoading={isAdminDataLoading}
                t={t}
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
                      {t("updateAdminPage.updateAdminButton", { ns: ADMIN_TRANSLATION_NAMESPACE })}
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
                      {t("updateAdminPage.deleteAdminButton", { ns: ADMIN_TRANSLATION_NAMESPACE })}
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
              title={t("updateAdminPage.adminInformationsSectionHeader.title", { ns: ADMIN_TRANSLATION_NAMESPACE })} 
              description={t("updateAdminPage.adminInformationsSectionHeader.description", { ns: ADMIN_TRANSLATION_NAMESPACE })}
            />
            <form className="space-y-5" onSubmit={handleSubmitUpdatePassword(handleConfirmUpdatePassword)}>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password input field */}
                <Field className="space-y-2">
                  <Label size="lg">{t(`form.password.label`, { ns: ADMIN_TRANSLATION_NAMESPACE })}</Label>
                  <Input
                    placeholder={t("form.password.placeholder", { ns: ADMIN_TRANSLATION_NAMESPACE })}
                    type="password"
                    {...updatePasswordRegister("password")}
                    isError={!!updatePasswordErrors["password"]}
                  />
                  {updatePasswordErrors["password"] && (
                    <InputErrorMessage>
                      {t(`form.password.inputValidation.${updatePasswordErrors["password"].type === "matches" ? updatePasswordErrors["password"].message : updatePasswordErrors["password"].type}`, {
                        ns: ADMIN_TRANSLATION_NAMESPACE,
                      })}
                    </InputErrorMessage>
                  )}
                </Field>
                
                {/* Confirm Password input field */}
                <Field className="space-y-2">
                  <Label size="lg">{t(`form.confirmPassword.label`, { ns: ADMIN_TRANSLATION_NAMESPACE })}</Label>
                  <Input
                    placeholder={t("form.confirmPassword.placeholder", { ns: ADMIN_TRANSLATION_NAMESPACE })}
                    type="password"
                    {...updatePasswordRegister("confirmPassword")}
                    isError={!!updatePasswordErrors["confirmPassword"]}
                  />
                  {updatePasswordErrors["confirmPassword"] && (
                    <InputErrorMessage>
                      {t(`form.confirmPassword.inputValidation.${updatePasswordErrors["confirmPassword"].type}`, { ns: ADMIN_TRANSLATION_NAMESPACE })}
                    </InputErrorMessage>
                  )}
                </Field>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  fullWidth={false} 
                  isLoading={isUpdateAccountPasswordLoading}
                >
                  {t("updateAdminPage.updatePasswordButton", { ns: ADMIN_TRANSLATION_NAMESPACE })}
                </Button>
              </div>
            </form>
          </div>
        </HasPermission>

        {/* Permissions Section */}
        <HasPermission permission="Update User Permissions">
          <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
            <SectionHeader 
              title={t("updateAdminPage.permissionsSectionHeader.title", { ns: ADMIN_TRANSLATION_NAMESPACE })} 
              description={t("updateAdminPage.permissionsSectionHeader.description", { ns: ADMIN_TRANSLATION_NAMESPACE })}
            />
            <RenderPermissionCheckboxes
              checkedPermissions={checkedPermissions}
              setCheckedPermissions={setCheckedPermissions}
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
                {t("updateAdminPage.updateAdminPermissionsButton", { ns: ADMIN_TRANSLATION_NAMESPACE })}
              </Button>
            )}
          </div>
        </HasPermission>

        {/* Departments Section */}
        <HasPermission permission="Grant Department Access">
          <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
            <SectionHeader 
              title={t("updateAdminPage.departmentsSectionHeader.title", { ns: ADMIN_TRANSLATION_NAMESPACE })} 
              description={t("updateAdminPage.departmentsSectionHeader.description", { ns: ADMIN_TRANSLATION_NAMESPACE })}
            />
            <RenderDepartmentCheckboxes
              checkedDepartments={checkedDepartments}
              setCheckedDepartments={setCheckedDepartments}
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
                {t("updateAdminPage.updateAdminDepartmentsButton", { ns: ADMIN_TRANSLATION_NAMESPACE })}
              </Button>
            )}
          </div>
        </HasPermission>
      </div>

      {/* Popups for confirming actions */}
      <DeleteAdminPopup
        isOpen={isDeletePopupOpen}
        handleClose={() => { setIsDeletePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        t={t}
      />
      <UnblockAdminPopup
        isOpen={isUnblockPopupOpen}
        handleClose={() => { setIsUnblockPopupOpen(false) }}
        handleConfirmUnblock={handleConfirmUnblock}
        isLoading={isUnblockAccountLoading}
        t={t}
      />
    </>

  )
}

export default EditAdminPage