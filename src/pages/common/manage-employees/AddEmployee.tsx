import { useTranslation } from "react-i18next";
import { RenderEmployeeDelegateInputs, RenderEmployeeInfoInputs } from "./views"
import { SubmitHandler, useForm } from "react-hook-form";
import { IEmployeeCredentials } from "../../../interfaces";
import { yupResolver } from "@hookform/resolvers/yup";
import { getEmployeeSchema } from "../../../validation";
import { Header } from "../../../components/ui/Header";
import { Button } from "../../../components/ui/Button";
import RenderEmployeeDepartmentInputs from "./views/RenderEmployeeDepartmentInputs";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { useManageEmployees } from "../../../hooks/useEmployeesHook";
import { Description } from "../../../components/ui/Forms";
import { useNavigate } from "react-router";
import { EMPLOYEE_TRANSLATION_NAMESPACE } from ".";

const AddEmployeePage = () => {
  const { t } = useTranslation(["common", EMPLOYEE_TRANSLATION_NAMESPACE]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IEmployeeCredentials>({
    resolver: yupResolver(getEmployeeSchema(false)),
    mode: "onChange",
  });

  const {
    addEmployeeAndGetUserID
  } = useManageEmployees();

  const handleConfirmAdd: SubmitHandler<IEmployeeCredentials> = async (request: IEmployeeCredentials) => {
    try {
      const userID = (await addEmployeeAndGetUserID(request)).data?.data?.userId;
      navigate(`/admin/edit-employee/${userID}`)
    } catch (error) {
      console.error("Error adding manager:", error);
    }
  };

  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header
        heading={t("addEmployeePage.header.heading", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
        subtitle={t("addEmployeePage.header.subtitle", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
      />
      <form className="bg-white shadow-md space-y-10 p-5 rounded-lg" onSubmit={handleSubmit(handleConfirmAdd)}>
        <div className="space-y-5 border-b-2 pb-10 border-gray-200">
          <SectionHeader 
            title={t("addEmployeePage.emplyeeInformationsSectionHeader.title", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
            description={t("addEmployeePage.emplyeeInformationsSectionHeader.description", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
          />
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <RenderEmployeeInfoInputs errors={errors} register={register} t={t} />
          </div>
        </div>
        <div className="space-y-5 border-b-2 pb-10 border-gray-200">
          <SectionHeader 
            title={t("addEmployeePage.departmentSectionHeader.title", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
            description={t("addEmployeePage.departmentSectionHeader.description", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
          />
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <RenderEmployeeDepartmentInputs errors={errors} register={register} t={t} />
          </div>
        </div>
        <div className="space-y-5 border-b-2 pb-10 border-gray-200">
          <SectionHeader 
            title={t("addEmployeePage.delegateSectionHeader.title", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
            description={t("addEmployeePage.delegateSectionHeader.description", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
          />
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <RenderEmployeeDelegateInputs errors={errors} register={register} t={t} />
          </div>
          <Description>{t("addEmployeePage.note", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</Description>
        </div>

        <Button fullWidth={false} isLoading={false} >{t("addEmployeePage.saveEmployeeButton", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</Button>
      </form>
    </div>
  )
}

export default AddEmployeePage
