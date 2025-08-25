import { useTranslation } from "react-i18next";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EmployeeFormValues, getEmployeeSchema } from "../../../validation";
import { useNavigate } from "react-router";
import {
  Button,
  Description,
  Header,
  SectionHeader,
} from "../../../components/ui";
import { EMPLOYEE_NS } from "../../../constants";
import { useCreateEmployee } from "../../../hooks";
import { DelegateInputs, DepartmentInputs, Inputs } from "./views";
import { showToast } from "../../../utils";
import { useUserStore } from "../../../store";

const AddEmployeePage = () => {
  const { t } = useTranslation([EMPLOYEE_NS]);
  const navigate = useNavigate();
  const role = useUserStore((state) => state.role);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue: setEmployeeValue,
  } = useForm<EmployeeFormValues>({
    resolver: yupResolver(getEmployeeSchema(false)),
    mode: "onChange",
  });

  const { mutateAsync: addEmployeeAndGetUserID, isPending } =
    useCreateEmployee();

  const handleConfirmAdd: SubmitHandler<EmployeeFormValues> = async (
    request: EmployeeFormValues
  ) => {
    if (request.subDepartmentId === undefined) {
      showToast("warn", "You must add sub-department");
      return;
    }
    try {
      const response = await addEmployeeAndGetUserID(request);
      const userID = response?.data?.data?.userId;
      if (userID) {
        navigate(`/${role}/edit-employee/${userID}`);
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
        heading={t("addEmployeePage.header.heading")}
        subtitle={t("addEmployeePage.header.subtitle")}
      />
      <form
        className="bg-white shadow-md space-y-10 p-5 rounded-lg"
        onSubmit={handleSubmit(handleConfirmAdd)}
      >
        <div className="space-y-5 border-b-2 pb-10 border-gray-200">
          <SectionHeader
            title={t("addEmployeePage.informationsSectionHeader.title")}
            description={t(
              "addEmployeePage.informationsSectionHeader.description"
            )}
          />
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Inputs
              errors={errors}
              register={register}
              setValue={setEmployeeValue}
            />
          </div>
        </div>
        <div className="space-y-5 border-b-2 pb-10 border-gray-200">
          <SectionHeader
            title={t("addEmployeePage.departmentSectionHeader.title")}
            description={t(
              "addEmployeePage.departmentSectionHeader.description"
            )}
          />
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DepartmentInputs
              errors={errors}
              register={register}
              control={control}
            />
          </div>
        </div>
        <div className="space-y-5 border-b-2 pb-10 border-gray-200">
          <SectionHeader
            title={t("addEmployeePage.delegateSectionHeader.title")}
            description={t("addEmployeePage.delegateSectionHeader.description")}
          />
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DelegateInputs
              errors={errors}
              register={register}
              control={control}
            />
          </div>
          <Description>{t("addEmployeePage.note")}</Description>
        </div>

        <Button fullWidth={false} isLoading={isPending}>
          {isPending ? t("buttons.loading") : t("buttons.create")}
        </Button>
      </form>
    </div>
  );
};

export default AddEmployeePage;
