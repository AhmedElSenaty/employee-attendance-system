import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import {
  Button,
  ButtonSkeleton,
  Field,
  Header,
  Input,
  InputErrorMessage,
  Label,
  SectionHeader,
} from "../../../components/ui";
import {
  getManagerSchema,
  ManagerFormValues,
  passwordUpdateSchema,
} from "../../../validation";
import { PermissionCheckboxes } from "../../Admin/manage-permissions/views";
import { DepartmentCheckboxes } from "../../Admin/manage-departments/views";
import { HasPermission } from "../../../components/auth";
import { MANAGER_NS } from "../../../constants";
import { DeletePopup, Inputs, UnblockPopup } from "./views";
import {
  useDeleteManager,
  useGetManagerByID,
  useUnblockAccount,
  useUpdateAccountPassword,
  useUpdateManager,
  useUpdateUserDepartments,
  useUpdateUserPermissions,
} from "../../../hooks";

const EditManagerPage = () => {
  const { t } = useTranslation([MANAGER_NS]);

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
    setValue,
  } = useForm<ManagerFormValues>({
    resolver: yupResolver(getManagerSchema(true)),
    mode: "onChange",
  });

  const {
    register: updatePasswordRegister,
    handleSubmit: handleSubmitUpdatePassword,
    formState: { errors: updatePasswordErrors },
  } = useForm<{ password: string; confirmPassword: string }>({
    resolver: yupResolver(passwordUpdateSchema(false)),
    mode: "onChange",
  });

  const { manager, isLoading: isManagerDataLoading } = useGetManagerByID(
    id || "",
    reset
  );

  useEffect(() => {
    setCheckedPermissions(manager?.permissions || []);
    setCheckedDepartments(
      manager?.department.id ? [manager.department.id] : []
    );
  }, [manager, isManagerDataLoading]);

  const { mutate: updateManager, isPending: isupdateing } = useUpdateManager();
  const { mutate: deleteManager, isPending: isDeleting } = useDeleteManager();

  const handleConfirmEdit: SubmitHandler<ManagerFormValues> = async (
    request: ManagerFormValues
  ) => {
    const payload = {
      id: id,
      ...request,
    };
    updateManager(payload);
  };

  const handleConfirmDelete = () => {
    deleteManager(id || "");
    setIsDeletePopupOpen(false);
    navigate(`/admin/manage-managers/`);
  };

  const {
    mutate: updateUserDepartments,
    isPending: isUserDepartmentsUpdating,
  } = useUpdateUserDepartments();

  const handleConfirmUpdateDepartments = () => {
    updateUserDepartments({
      userID: id || "",
      departments: checkedDepartments,
    });
  };

  const {
    mutate: updateUserPermissions,
    isPending: isUserPermissionsUpdating,
  } = useUpdateUserPermissions();

  const handleConfirmUpdatePermissions = () => {
    updateUserPermissions({
      userID: id || "",
      permissions: checkedPermissions,
    });
  };

  const {
    mutate: updateAccountPassword,
    isPending: isUpdateAccountPasswordLoading,
  } = useUpdateAccountPassword();
  const { mutate: unblockAccount, isPending: isUnblockAccountLoading } =
    useUnblockAccount();

  const handleConfirmUpdatePassword: SubmitHandler<{
    password: string;
  }> = async (request: { password: string }) => {
    updateAccountPassword({
      password: request.password,
      userId: id || "",
    });
  };

  const handleConfirmUnblock = () => {
    unblockAccount(id || "");
    setIsUnblockPopupOpen(false);
  };

  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header
          heading={t("updateManagerPage.header.heading")}
          subtitle={t("updateManagerPage.header.subtitle")}
        />
        <form
          className="bg-white shadow-md space-y-5 p-5 rounded-lg"
          onSubmit={handleSubmit(handleConfirmEdit)}
        >
          <SectionHeader
            title={t("updateManagerPage.informationsSectionHeader.title")}
            description={t(
              "updateManagerPage.informationsSectionHeader.description"
            )}
          />
          <div className="space-y-5">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <Inputs
                checkedPermissionsHandler={setCheckedPermissions}
                register={register}
                errors={errors}
                control={control}
                setValue={setValue}
                isUpdateManager={true}
                isLoading={isManagerDataLoading}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {isManagerDataLoading ? (
                <>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-36">
                      <ButtonSkeleton fullWidth={false} />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <HasPermission permission="Update Manager">
                    <Button
                      fullWidth={false}
                      isLoading={isupdateing}
                      type="submit"
                    >
                      {isupdateing
                        ? t("buttons.loading")
                        : t("buttons.updateInformations")}
                    </Button>
                  </HasPermission>
                  <HasPermission permission="Unlock Account">
                    {manager?.isBlocked && (
                      <Button
                        fullWidth={false}
                        isLoading={isUnblockAccountLoading}
                        variant={"black"}
                        type="button"
                      >
                        {isUnblockAccountLoading
                          ? t("buttons.loading")
                          : t("buttons.unblock")}
                      </Button>
                    )}
                  </HasPermission>
                  <HasPermission permission="Delete Manager">
                    <Button
                      fullWidth={false}
                      isLoading={isDeleting}
                      variant={"danger"}
                      type="button"
                      onClick={() => setIsDeletePopupOpen(true)}
                    >
                      {isDeleting ? t("buttons.loading") : t("buttons.delete")}
                    </Button>
                  </HasPermission>
                </>
              )}
            </div>
          </div>
        </form>

        {/* Password Update Section */}
        <HasPermission permission="Update Password">
          <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
            <SectionHeader
              title={t("updateManagerPage.passwordSectionHeader.title")}
              description={t(
                "updateManagerPage.passwordSectionHeader.description"
              )}
            />
            <form
              className="space-y-5"
              onSubmit={handleSubmitUpdatePassword(handleConfirmUpdatePassword)}
            >
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password input field */}
                <Field className="space-y-2">
                  <Label size="lg">{t(`inputs.password.label`)}</Label>
                  <Input
                    placeholder={t("inputs.password.placeholder")}
                    type="password"
                    {...updatePasswordRegister("password")}
                    isError={!!updatePasswordErrors["password"]}
                  />
                  {updatePasswordErrors["password"] && (
                    <InputErrorMessage>
                      {t(
                        `inputs.password.inputValidation.${
                          updatePasswordErrors["password"].type === "matches"
                            ? updatePasswordErrors["password"].message
                            : updatePasswordErrors["password"].type
                        }`
                      )}
                    </InputErrorMessage>
                  )}
                </Field>

                {/* Confirm Password input field */}
                <Field className="space-y-2">
                  <Label size="lg">{t(`inputs.confirmPassword.label`)}</Label>
                  <Input
                    placeholder={t("inputs.confirmPassword.placeholder")}
                    type="password"
                    {...updatePasswordRegister("confirmPassword")}
                    isError={!!updatePasswordErrors["confirmPassword"]}
                  />
                  {updatePasswordErrors["confirmPassword"] && (
                    <InputErrorMessage>
                      {t(
                        `inputs.confirmPassword.inputValidation.${updatePasswordErrors["confirmPassword"].type}`
                      )}
                    </InputErrorMessage>
                  )}
                </Field>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  fullWidth={false}
                  isLoading={isUpdateAccountPasswordLoading}
                >
                  {isUpdateAccountPasswordLoading
                    ? t("buttons.loading")
                    : t("buttons.updatePassword")}
                </Button>
              </div>
            </form>
          </div>
        </HasPermission>

        <HasPermission permission="Update User Permissions">
          <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
            <SectionHeader
              title={t("updateManagerPage.permissionsSectionHeader.title")}
              description={t(
                "updateManagerPage.permissionsSectionHeader.description"
              )}
            />
            <PermissionCheckboxes
              checked={checkedPermissions}
              setChecked={setCheckedPermissions}
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
                {isUserPermissionsUpdating
                  ? t("buttons.loading")
                  : t("buttons.updatePermissions")}
              </Button>
            )}
          </div>
        </HasPermission>
        <HasPermission permission="Grant Department Access">
          <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
            <DepartmentCheckboxes
              checked={checkedDepartments}
              setChecked={setCheckedDepartments}
              needSelectOne={true}
              isLoading={isManagerDataLoading}
              title={t("updateManagerPage.departmentsSectionHeader.title")}
              description={t(
                "updateManagerPage.departmentsSectionHeader.description"
              )}
            />
            {isManagerDataLoading ? (
              <div className="w-36">
                <ButtonSkeleton fullWidth={false} />
              </div>
            ) : (
              <Button
                fullWidth={false}
                onClick={handleConfirmUpdateDepartments}
                isLoading={isUserDepartmentsUpdating}
              >
                {isUserDepartmentsUpdating
                  ? t("buttons.loading")
                  : t("buttons.updateUserDepartments")}
              </Button>
            )}
          </div>
        </HasPermission>
      </div>
      <DeletePopup
        isOpen={isDeletePopupOpen}
        handleClose={() => {
          setIsDeletePopupOpen(false);
        }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
      />
      <UnblockPopup
        isOpen={isUnblockPopupOpen}
        handleClose={() => {
          setIsUnblockPopupOpen(false);
        }}
        handleConfirmUnblock={handleConfirmUnblock}
        isLoading={isUnblockAccountLoading}
      />
    </>
  );
};

export default EditManagerPage;
