import { useState } from "react";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { getManagerSchema, ManagerFormValues } from "../../../validation";
import { Description } from "../../../components/ui/Form";
import { Button, Header, SectionHeader } from "../../../components/ui";
import { MANAGER_NS } from "../../../constants";
import { useCreateManager } from "../../../hooks";
import { ManagerCredentials } from "../../../interfaces";
import { PermissionCheckboxes } from "../../Admin/manage-permissions/views";
import { DepartmentCheckboxes } from "../../Admin/manage-departments/views";
import { Inputs } from "./views";

const AddManagerPage = () => {
  const { t } = useTranslation([MANAGER_NS]);
  const navigate = useNavigate();

  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);
  const [checkedDepartment, setCheckedDepartment] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue
  } = useForm<ManagerFormValues>({
    resolver: yupResolver(getManagerSchema(false)),
    mode: "onChange",
  });


  const { mutateAsync: addManagerAndGetUserID, isPending: isAdding } = useCreateManager();

  const handleConfirmAdd: SubmitHandler<ManagerCredentials> = async (request: ManagerCredentials) => {
    try {
      request.permissions = checkedPermissions || [];
      request.departmentId = checkedDepartment[0];

      const response = await addManagerAndGetUserID(request);
      const userID = response?.data?.data?.userId;
      if (userID) {
        navigate(`/admin/edit-manager/${userID}`)
      } else {
        console.error("No user ID returned in response:", response);
      }
    } catch (error) {
      console.error("Error adding profile:", error);
    }
  };


  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header
        heading={t("addManagerPage.header.heading")}
        subtitle={t("addManagerPage.header.subtitle")}
      />
      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("addManagerPage.informationsSectionHeader.title")}
          description={t("addManagerPage.informationsSectionHeader.description")}
        />
        <form className="space-y-5" onSubmit={handleSubmit(handleConfirmAdd)}>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <Inputs
              register={register} 
              errors={errors}
              control={control}
              setValue={setValue} 
              checkedPermissionsHandler={setCheckedPermissions}
            />
          </div>
          <Description>{t("addManagerPage.note")}</Description>
          <Button fullWidth={false} isLoading={isAdding} >
            {isAdding ? t("buttons.loading") : t("buttons.create")}
          </Button>
        </form>
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("addManagerPage.permissionsSectionHeader.title")}
          description={t("addManagerPage.permissionsSectionHeader.description")}
        />
        <PermissionCheckboxes
          checked={checkedPermissions}
          setChecked={setCheckedPermissions}
        />
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("addManagerPage.departmentsSectionHeader.title")}
          description={t("addManagerPage.departmentsSectionHeader.description")}
        />
        <DepartmentCheckboxes
          checked={checkedDepartment}
          setChecked={setCheckedDepartment}
          needSelectOne={true}
        />
      </div>
    </div>
  )
}

export default AddManagerPage;