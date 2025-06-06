import { useState } from "react";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { IManagerCredentials } from "../../../interfaces";
import { getManagerSchema } from "../../../validation";
import { RenderManagerInputs } from "./views";
import { Description } from "../../../components/ui/Forms";
import { useManageManagers } from "../../../hooks/useManagerHook";
import { RenderPermissionCheckboxes } from "../../Admin/manage-permissions/views";
import { RenderDepartmentCheckboxes } from "../../Admin/manage-departments/views";
import { MANAGER_TRANSLATION_NAMESPACE } from ".";
import { Button, Header, SectionHeader } from "../../../components/ui";

const AddManagerPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["common", MANAGER_TRANSLATION_NAMESPACE]);

  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);
  const [checkedDepartment, setCheckedDepartment] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue
  } = useForm<IManagerCredentials>({
    resolver: yupResolver(getManagerSchema(false)),
    mode: "onChange",
  });

  const {
    addManagerAndGetUserID,
    isAdding,
  } = useManageManagers();

  const handleConfirmAdd: SubmitHandler<IManagerCredentials> = async (request: IManagerCredentials) => {
    try {
      request.permissions = checkedPermissions || [];
      request.departmentId = checkedDepartment[0];
      
      const userID = (await addManagerAndGetUserID(request)).data?.data?.userId;
      navigate(`/admin/edit-manager/${userID}`)
    } catch (error) {
      console.error("Error adding manager:", error);
    }
  };

  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header
        heading={t("addManagerPage.header.heading", { ns: MANAGER_TRANSLATION_NAMESPACE })}
        subtitle={t("addManagerPage.header.subtitle", { ns: MANAGER_TRANSLATION_NAMESPACE })}
      />
      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("addManagerPage.managerInformationsSectionHeader.title", { ns: MANAGER_TRANSLATION_NAMESPACE })}
          description={t("addManagerPage.managerInformationsSectionHeader.description", { ns: MANAGER_TRANSLATION_NAMESPACE })}
        />
        <form className="space-y-5" onSubmit={handleSubmit(handleConfirmAdd)}>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <RenderManagerInputs
              register={register} 
              errors={errors}
              control={control}
              setValue={setValue} 
              checkedPermissionsHandler={setCheckedPermissions}
              t={t}
            />
          </div>
          <Description>{t("addManagerPage.note", { ns: MANAGER_TRANSLATION_NAMESPACE })}</Description>
          <Button fullWidth={false} isLoading={isAdding} >
            {t("addManagerPage.saveManagerButton", { ns: MANAGER_TRANSLATION_NAMESPACE })}
          </Button>
        </form>
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("addManagerPage.permissionsSectionHeader.title", { ns: MANAGER_TRANSLATION_NAMESPACE })}
          description={t("addManagerPage.permissionsSectionHeader.description", { ns: MANAGER_TRANSLATION_NAMESPACE })}
        />
        <RenderPermissionCheckboxes
          checkedPermissions={checkedPermissions}
          setCheckedPermissions={setCheckedPermissions}
        />
      </div>

      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader 
          title={t("addManagerPage.departmentsSectionHeader.title", { ns: MANAGER_TRANSLATION_NAMESPACE })}
          description={t("addManagerPage.departmentsSectionHeader.description", { ns: MANAGER_TRANSLATION_NAMESPACE })}
        />
        <RenderDepartmentCheckboxes
          checkedDepartments={checkedDepartment}
          setCheckedDepartments={setCheckedDepartment}
          needSelectOne={true}
        />
      </div>
    </div>
  )
}

export default AddManagerPage;