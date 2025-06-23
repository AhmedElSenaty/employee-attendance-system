import { useState } from "react";
import { SectionHeader, Header, Button, Description } from "../../../components/ui"
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { AdminFormValues, getAdminSchema } from "../../../validation";
import { ADMIN_NS } from "../../../constants";
import { useCreateAdmin } from "../../../hooks";
import { Inputs } from "./views";
import { PermissionCheckboxes } from "../manage-permissions/views";
import { DepartmentCheckboxes } from "../manage-departments/views";

const AddAdminPage = () => {
  const { t } = useTranslation([ADMIN_NS]);
  const navigate = useNavigate();

  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);
  const [checkedDepartments, setCheckedDepartments] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue
  } = useForm<AdminFormValues>({
    resolver: yupResolver(getAdminSchema(false)),
    mode: "onChange",
  });

  const { mutateAsync: addAdminAndGetUserID, isPending: isAdding } = useCreateAdmin();

  const handleConfirmAdd: SubmitHandler<AdminFormValues> = async (request: AdminFormValues) => {
    try {
      const payload = {
        ...request,
        permissions: checkedPermissions || [],
        departmentsIds: checkedDepartments || [],
      }

      const response = await addAdminAndGetUserID(payload);
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
        heading={t("addAdminPage.header.heading")}
        subtitle={t("addAdminPage.header.subtitle")}
      />
      
      {/* Admin Information Section */}
      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("addAdminPage.informationsSectionHeader.title")}
          description={t("addAdminPage.informationsSectionHeader.description")}
        />
        
        {/* Admin Form */}
        <form className="space-y-5" onSubmit={handleSubmit(handleConfirmAdd)}>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Render the inputs for admin information */}
            <Inputs
              register={register} 
              errors={errors}
              control={control}
              setValue={setValue} 
              checkedPermissionsHandler={setCheckedPermissions}
            />
          </div>

          {/* Form description or additional notes */}
          <Description>{t("addAdminPage.note")}</Description>

          {/* Submit button */}
          <Button fullWidth={false} isLoading={isAdding} >
            {isAdding ? t("buttons.loading") : t("buttons.create")}
          </Button>
        </form>
      </div>

      {/* Permissions Section */}
      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("addAdminPage.permissionsSectionHeader.title")}
          description={t("addAdminPage.permissionsSectionHeader.description")}
        />
        
        {/* Render permission checkboxes */}
        <PermissionCheckboxes
          checked={checkedPermissions}
          setChecked={setCheckedPermissions}
        />
      </div>

      
      {/* Departments Section */}
      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("addAdminPage.departmentsSectionHeader.title")}
          description={t("addAdminPage.departmentsSectionHeader.description")}
        />
        
        {/* Render department checkboxes */}
        <DepartmentCheckboxes
          checked={checkedDepartments}
          setChecked={setCheckedDepartments}
        />
      </div>
    </div>
  )
}

export default AddAdminPage;