import { useTranslation } from "react-i18next";
import { DeleteEmployeePopup, RenderEmployeeDelegateInputs, RenderEmployeeInfoInputs, UnblockEmployeePopup } from "./views"
import { SubmitHandler, useForm } from "react-hook-form";
import { IEmployeeCredentials } from "../../../interfaces";
import { yupResolver } from "@hookform/resolvers/yup";
import { getEmployeeSchema, passwordUpdateSchema } from "../../../validation";
import { Header } from "../../../components/ui/Header";
import { Button, ButtonSkeleton } from "../../../components/ui/Button";
import RenderEmployeeDepartmentInputs from "./views/RenderEmployeeDepartmentInputs";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { useGetEmployeeByID, useManageEmployees } from "../../../hooks/useEmployeesHook";
import { Description, Field, Input, InputErrorMessage, Label } from "../../../components/ui/Forms";
import { useNavigate, useParams } from "react-router";
import { useManageAccount } from "../../../hooks/useAccountHook";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { EMPLOYEE_TRANSLATION_NAMESPACE } from ".";
import { useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { defaultUserImage } from "../../../assets/images";
import { HasPermission } from "../../../components/auth";

const EditEmployeePage = () => {
  const { t } = useTranslation(["common", EMPLOYEE_TRANSLATION_NAMESPACE]);
  
  const { id } = useParams();
  const navigate = useNavigate();

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isUnblockPopupOpen, setIsUnblockPopupOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IEmployeeCredentials>({
    resolver: yupResolver(getEmployeeSchema(true)),
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


  const { employee , isEmployeeDataLoading} = useGetEmployeeByID(id || "", reset)

  const {
    updateEmployee,
    isUpdating,
    deleteEmployee,
    isDeleting
  } = useManageEmployees();

  const handleConfirmUpdateInfo: SubmitHandler<IEmployeeCredentials> = async (request: IEmployeeCredentials) => {
    request.id = id
    updateEmployee(request);
  };

  const handleConfirmDelete = () => {
    deleteEmployee(id || "")
    setIsDeletePopupOpen(false)
    navigate(`/admin/manage-employees/`) 
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
          heading={t("editEmployeePage.header.heading", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
          subtitle={t("editEmployeePage.header.subtitle", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
        />

        <form className="bg-white shadow-md space-y-10 p-5 rounded-lg" onSubmit={handleSubmit(handleConfirmUpdateInfo)}>
          <div className="space-y-5 border-b-2 pb-10 border-gray-200">
            <SectionHeader 
              title={t("editEmployeePage.emplyeeInformationsSectionHeader.title", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
              description={t("editEmployeePage.emplyeeInformationsSectionHeader.description", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
            />
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 p-6 bg-white rounded-2xl shadow-md">
              {/* Profile Image */}
              <div className="flex flex-col gap-2 items-center justify-center col-span-1 sm:col-span-2 lg:col-span-1">
                <picture className="lg:w-full lg:h-full w-30 flex h-fit rounded-2xl overflow-hidden border border-gray-300 shadow-sm">
                  <img
                    src={employee?.profileImage ?? defaultUserImage}
                    alt="User Avatar"
                    loading="lazy"
                    className="object-cover w-full h-full"
                  />
                </picture>
                <StatusBadge
                  variant={employee?.isActive ? "success" : "warning"}
                  size="medium"
                  fullWidth
                  icon={
                    employee?.isActive ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )
                  }
                >
                  {employee?.isActive
                    ? t("manageEmployeesPage.table.status.active", {
                        ns: EMPLOYEE_TRANSLATION_NAMESPACE,
                      })
                    : t("manageEmployeesPage.table.status.notActive", {
                        ns: EMPLOYEE_TRANSLATION_NAMESPACE,
                    })
                  }
                </StatusBadge>
              </div>

              {/* Inputs */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                <RenderEmployeeInfoInputs
                  errors={errors}
                  register={register}
                  t={t}
                  isUpdateEmployee
                  isLoading={isEmployeeDataLoading}
                />
              </div>
            </div>


          </div>
          <div className="space-y-5 border-b-2 pb-10 border-gray-200">
            <SectionHeader 
              title={t("editEmployeePage.departmentSectionHeader.title", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
              description={t("editEmployeePage.departmentSectionHeader.description", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
            />
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <RenderEmployeeDepartmentInputs errors={errors} register={register} t={t} selectedDepartmentID={Number(employee?.departmentId)} />
            </div>
          </div>
          <div className="space-y-5 border-b-2 pb-10 border-gray-200">
            <SectionHeader 
              title={t("editEmployeePage.delegateSectionHeader.title", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
              description={t("editEmployeePage.delegateSectionHeader.description", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
            />
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <RenderEmployeeDelegateInputs errors={errors} register={register} t={t} selectedDepartmentID={Number(employee?.delegeteDepartmentId)} />
            </div>
            <Description>{t("editEmployeePage.note", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</Description>
          </div>

          <div className="flex flex-wrap gap-3">
              {
                isEmployeeDataLoading ? (
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
                    <HasPermission permission="Update Employee">
                      <Button 
                        fullWidth={false} 
                        isLoading={isUpdating}
                      >
                        {t("editEmployeePage.updateButton", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
                      </Button>
                    </HasPermission>
                    <HasPermission permission="Unlock Account">
                      {
                        employee?.isBlocked && (
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
                    <HasPermission permission="Delete Employee">
                      <Button
                        fullWidth={false}
                        isLoading={isDeleting}
                        variant={"danger"}
                        type="button"
                        onClick={() => setIsDeletePopupOpen(true)}
                      >
                        {t("editEmployeePage.deleteButton", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
                      </Button>
                    </HasPermission>
                  </>
                )
              }
          </div>
        </form>
        <HasPermission permission="Update Password">
          {/* Password Update Section */}
          <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
            <SectionHeader 
              title={t("editEmployeePage.passwordSectionHeader.title", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })} 
              description={t("editEmployeePage.passwordSectionHeader.description", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
            />
            <form className="space-y-5" onSubmit={handleSubmitUpdatePassword(handleConfirmUpdatePassword)}>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password input field */}
                <Field className="space-y-2">
                  <Label size="lg">{t(`form.password.label`, { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</Label>
                  <Input
                    placeholder={t("form.password.placeholder", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
                    type="password"
                    {...updatePasswordRegister("password")}
                    isError={!!updatePasswordErrors["password"]}
                  />
                  {updatePasswordErrors["password"] && (
                    <InputErrorMessage>
                      {t(`form.password.inputValidation.${updatePasswordErrors["password"].type === "matches" ? updatePasswordErrors["password"].message : updatePasswordErrors["password"].type}`, {
                        ns: EMPLOYEE_TRANSLATION_NAMESPACE,
                      })}
                    </InputErrorMessage>
                  )}
                </Field>
                
                {/* Confirm Password input field */}
                <Field className="space-y-2">
                  <Label size="lg">{t(`form.confirmPassword.label`, { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</Label>
                  <Input
                    placeholder={t("form.confirmPassword.placeholder", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
                    type="password"
                    {...updatePasswordRegister("confirmPassword")}
                    isError={!!updatePasswordErrors["confirmPassword"]}
                  />
                  {updatePasswordErrors["confirmPassword"] && (
                    <InputErrorMessage>
                      {t(`form.confirmPassword.inputValidation.${updatePasswordErrors["confirmPassword"].type}`, { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
                    </InputErrorMessage>
                  )}
                </Field>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  fullWidth={false} 
                  isLoading={isUpdateAccountPasswordLoading}
                >
                  {t("editEmployeePage.updatePasswordButton", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
                </Button>
              </div>
            </form>
          </div>
        </HasPermission>
      </div>
      <DeleteEmployeePopup
        isOpen={isDeletePopupOpen}
        handleClose={() => { setIsDeletePopupOpen(false) }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
        t={t}
      />
      <UnblockEmployeePopup
        isOpen={isUnblockPopupOpen}
        handleClose={() => { setIsUnblockPopupOpen(false) }}
        handleConfirmUnblock={handleConfirmUnblock}
        isLoading={isUnblockAccountLoading}
        t={t}
      />
    </>
  )
}

export default EditEmployeePage
