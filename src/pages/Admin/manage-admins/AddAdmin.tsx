import { useState } from "react";
import { SectionHeader, Header, Button, Description } from "../../../components/ui"
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { IAdminCredentials } from "../../../interfaces";
import { getAdminSchema } from "../../../validation";
import { RenderDepartmentCheckboxes } from "../manage-departments/views";
import { RenderAdminInputs } from "./views";
import { RenderPermissionCheckboxes } from "../manage-permissions/views";
import { ADMIN_TRANSLATION_NAMESPACE } from ".";
import { useCreateAdmin } from "../../../hooks/admin.hooks";

const AddAdminPage = () => {
  const navigate = useNavigate();  // For navigating to different pages
  const { t } = useTranslation(["common", ADMIN_TRANSLATION_NAMESPACE]); // Translation hook

  // State to manage the selected permissions and departments for the new admin
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);
  const [checkedDepartments, setCheckedDepartments] = useState<number[]>([]);

  // useForm hook from react-hook-form to handle form data and validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue
  } = useForm<IAdminCredentials>({
    resolver: yupResolver(getAdminSchema(false)),  // Schema validation with Yup
    mode: "onChange", // Validation on change
  });

  const { mutateAsync: addAdminAndGetUserID, isPending: isAdding } = useCreateAdmin();

  const handleConfirmAdd: SubmitHandler<IAdminCredentials> = async (request: IAdminCredentials) => {
    try {
      // Add selected permissions and departments to the request payload
      request.permissions = checkedPermissions || [];
      request.departmentsIds = checkedDepartments || [];

      const response = await addAdminAndGetUserID(request);
      const userID = response?.data?.data?.userId;
      if (userID) {
        navigate(`/admin/edit-admin/${userID}`)
      } else {
        console.error("No user ID returned in response:", response);
      }
    } catch (error) {
      console.error("Error adding profile:", error);
    }
  };



  return (
    <div className="sm:p-5 p-3 space-y-5">
      {/* Header for the page */}
      <Header
        heading={t("addAdminPage.header.heading", { ns: ADMIN_TRANSLATION_NAMESPACE })}
        subtitle={t("addAdminPage.header.subtitle", { ns: ADMIN_TRANSLATION_NAMESPACE })}
      />
      
      {/* Admin Information Section */}
      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("addAdminPage.adminInformationsSectionHeader.title", { ns: ADMIN_TRANSLATION_NAMESPACE })}
          description={t("addAdminPage.adminInformationsSectionHeader.description", { ns: ADMIN_TRANSLATION_NAMESPACE })}
        />
        
        {/* Admin Form */}
        <form className="space-y-5" onSubmit={handleSubmit(handleConfirmAdd)}>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Render the inputs for admin information */}
            <RenderAdminInputs
              register={register} 
              errors={errors}
              control={control}
              setValue={setValue} 
              checkedPermissionsHandler={setCheckedPermissions}
              t={t}
            />
          </div>

          {/* Form description or additional notes */}
          <Description>{t("addAdminPage.note", { ns: ADMIN_TRANSLATION_NAMESPACE })}</Description>

          {/* Submit button */}
          <Button fullWidth={false} isLoading={isAdding}>
            {t("addAdminPage.saveAdminButton", { ns: ADMIN_TRANSLATION_NAMESPACE })}
          </Button>
        </form>
      </div>

      {/* Permissions Section */}
      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("addAdminPage.permissionsSectionHeader.title", { ns: ADMIN_TRANSLATION_NAMESPACE })}
          description={t("addAdminPage.permissionsSectionHeader.description", { ns: ADMIN_TRANSLATION_NAMESPACE })}
        />
        
        {/* Render permission checkboxes */}
        <RenderPermissionCheckboxes
          checkedPermissions={checkedPermissions}
          setCheckedPermissions={setCheckedPermissions}
        />
      </div>

      
      {/* Departments Section */}
      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("addAdminPage.departmentsSectionHeader.title", { ns: ADMIN_TRANSLATION_NAMESPACE })}
          description={t("addAdminPage.departmentsSectionHeader.description", { ns: ADMIN_TRANSLATION_NAMESPACE })}
        />
        
        {/* Render department checkboxes */}
        <RenderDepartmentCheckboxes
          checkedDepartments={checkedDepartments}
          setCheckedDepartments={setCheckedDepartments}
        />
      </div>
    </div>
  )
}

export default AddAdminPage;