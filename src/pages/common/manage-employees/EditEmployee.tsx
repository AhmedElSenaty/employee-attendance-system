import { useTranslation } from "react-i18next";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  EmployeeFormValues,
  getEmployeeSchema,
  passwordUpdateSchema,
} from "../../../validation";
import {
  SectionHeader,
  Button,
  ButtonSkeleton,
  Header,
  StatusBadge,
  Description,
  Field,
  Input,
  InputErrorMessage,
  Label,
  Textarea,
} from "../../../components/ui";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Timer,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { HasPermission } from "../../../components/auth";
import { EMPLOYEE_NS } from "../../../constants";
import {
  EmployeeWorkingDaysForm,
  EmployeeWorkingHours,
} from "../../../interfaces";
import {
  useSetWorkingHours,
  useDeleteEmployee,
  useGetEmployeeByID,
  useGetWorkingDaysByID,
  useUnblockAccount,
  useUpdateAccountPassword,
  useUpdateEmployee,
  useUpdateEmployeeWorkingHours,
  useUpdateWorkingDays,
  useRestorePreviousSchedule,
} from "../../../hooks";
import {
  DelegateInputs,
  DeletePopup,
  DepartmentInputs,
  Inputs,
  UnblockPopup,
  WorkingDaysCheckboxes,
} from "./views";
import { FileInputPreview } from "../../../components/ui/Form/FileUpload";
import GoToPreviousSchedulePopup from "./views/GoToPreviousSchedulePopup";
const EditEmployeePage = () => {
  const { t } = useTranslation([EMPLOYEE_NS]);

  const { id } = useParams();
  const navigate = useNavigate();

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isUnblockPopupOpen, setIsUnblockPopupOpen] = useState(false);
  const [selectedWorkingDays, setSelectedWorkingDays] = useState<number[]>([]);
  const [selectedRestDays, setSelectedRestDays] = useState<number[]>([]);
  const [isEndDateNull, setIsEndDateNull] = useState(false);
  const [isRestorePopupOpen, setIsRestorePopupOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue: setEmployeeValue,
  } = useForm<EmployeeFormValues>({
    resolver: yupResolver(getEmployeeSchema(true)),
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
  const {
    register: updateHoursRegister,
    handleSubmit: handleSubmitUpdateHours,
    formState: { errors: updateHoursErrors },
    setValue,
  } = useForm<EmployeeWorkingHours>();

  const {
    register: updateDaysRegister,
    handleSubmit: handleSubmitWorkingDaysForm,
    setValue: setDaysValue,
    formState: { errors: updateDaysErrors },
  } = useForm<EmployeeWorkingDaysForm>();

  const { employee, isLoading: isEmployeeDataLoading } = useGetEmployeeByID(
    id || "",
    reset
  );

  // Destructuring functions and loading states from custom hooks for managing admins, departments, and permissions
  const { mutate: updateEmployee, isPending: isupdateing } =
    useUpdateEmployee();
  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();
  const { mutate: restoreSchedule, isPending: isRestoring } =
    useRestorePreviousSchedule();

  const handleConfirmUpdateInfo: SubmitHandler<EmployeeFormValues> = async (
    request: EmployeeFormValues
  ) => {
    const payload = {
      id: id,
      ...request,
    };
    updateEmployee(payload);
  };

  const handleConfirmDelete = () => {
    deleteEmployee(id || "");
    setIsDeletePopupOpen(false);
    navigate(`/admin/manage-employees/`);
  };

  const {
    mutate: updateAccountPassword,
    isPending: isUpdateAccountPasswordLoading,
  } = useUpdateAccountPassword();
  const { mutate: unblockAccount, isPending: isUnblockAccountLoading } =
    useUnblockAccount();
  const { mutate: updateWorkingDays, isPending: isUpdateDaysLoading } =
    useUpdateWorkingDays();
  const { mutate: updateWorkingHours, isPending: isUpdateHoursLoading } =
    useUpdateEmployeeWorkingHours();

  const handleConfirmUpdatePassword: SubmitHandler<{
    password: string;
  }> = async (request: { password: string }) => {
    updateAccountPassword({
      password: request.password,
      userId: id || "",
    });
  };

  const handleConfirmUpdateWorkingDaysForm: SubmitHandler<
    EmployeeWorkingDaysForm
  > = (request) => {
    updateWorkingDays({
      employeeId: id || "",
      workingDays: request.WorkingDays,
      restDays: request.RestDays,
      StartDate: request.StartDate,
      EndDate: request.EndDate,
      Description: request.Description,
    });
  };

  const handleConfirmUpdateWorkingHours: SubmitHandler<
    EmployeeWorkingHours
  > = async (request: EmployeeWorkingHours) => {
    request.EmployeeId = id || "";
    updateWorkingHours(request);
  };

  const handleConfirmUnblock = () => {
    unblockAccount(id || "");
    setIsUnblockPopupOpen(false);
  };

  const handleConfirmRestore = () => {
    restoreSchedule(id, {
      onSuccess: async () => {
        window.location.reload(); // 👈 force full page refresh
        setIsRestorePopupOpen(false);
      },
    });
  };

  const { workingDays: workingDaysData, isWorkingDaysLoading } =
    useGetWorkingDaysByID(id || "");

  const { data } = useSetWorkingHours(id || "");

  useEffect(() => {
    if (data?.data?.data) {
      const { attendTime, goTime, description, startDate, endDate } =
        data.data.data;
      setValue("AttendTime", attendTime);
      setValue("GoTime", goTime);
      setValue("Description", description);
      setValue("StartDate", startDate);
      setValue("EndDate", endDate);
    }
  }, [data, setValue]);

  useEffect(() => {
    setDaysValue("WorkingDays", selectedWorkingDays);
  }, [selectedWorkingDays, setDaysValue]);

  useEffect(() => {
    setDaysValue("RestDays", selectedRestDays);
  }, [selectedRestDays, setDaysValue]);

  useEffect(() => {
    if (workingDaysData) {
      const workIds = workingDaysData.employeeWorkingDays.map((d) => d.dayId);
      const restIds = workingDaysData.employeeRestDays.map((d) => d.dayId);
      setSelectedWorkingDays(workIds);
      setSelectedRestDays(restIds);

      // ✅ This part was missing
      setDaysValue("WorkingDays", workIds);
      setDaysValue("RestDays", restIds);
      setDaysValue("StartDate", workingDaysData.startDate || "");
      setDaysValue("EndDate", workingDaysData.endDate || null);
      setDaysValue("Description", workingDaysData.description || "");
    }
  }, [workingDaysData, isWorkingDaysLoading, setDaysValue]);

  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header
          heading={t("editEmployeePage.header.heading")}
          subtitle={t("editEmployeePage.header.subtitle")}
        />

        <form
          className="bg-white shadow-md space-y-10 p-5 rounded-lg"
          onSubmit={handleSubmit(handleConfirmUpdateInfo)}
        >
          <div className="space-y-5 border-b-2 pb-10 border-gray-200">
            <SectionHeader
              title={t("editEmployeePage.informationsSectionHeader.title")}
              description={t(
                "editEmployeePage.informationsSectionHeader.description"
              )}
            />
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 p-6 bg-white rounded-2xl shadow-md">
              {/* Profile Image */}
              <div className="flex flex-col gap-2 items-center justify-center col-span-1 sm:col-span-2 lg:col-span-1">
                <picture className="lg:w-full lg:h-full w-30 flex h-fit rounded-2xl overflow-hidden border border-gray-300 shadow-sm">
                  <img
                    src={
                      employee?.profileImage ??
                      "/images/default-user-image.webp"
                    }
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
                    ? t("table.status.active")
                    : t("table.status.notActive")}
                </StatusBadge>
              </div>

              {/* Inputs */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                <Inputs
                  errors={errors}
                  register={register}
                  isUpdateEmployee
                  isLoading={isEmployeeDataLoading}
                  setValue={setEmployeeValue}
                  initialCategoryId={employee?.overtimePriceCategoryId}
                />
              </div>
            </div>
          </div>
          <div className="space-y-5 border-b-2 pb-10 border-gray-200">
            <SectionHeader
              title={t("editEmployeePage.departmentSectionHeader.title")}
              description={t(
                "editEmployeePage.departmentSectionHeader.description"
              )}
            />
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <DepartmentInputs
                errors={errors}
                register={register}
                selectedDepartmentID={Number(employee?.departmentId)}
                control={control}
              />
            </div>
          </div>
          <div className="space-y-5 border-b-2 pb-10 border-gray-200">
            <SectionHeader
              title={t("editEmployeePage.delegateSectionHeader.title")}
              description={t(
                "editEmployeePage.delegateSectionHeader.description"
              )}
            />
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <DelegateInputs
                errors={errors}
                register={register}
                selectedDepartmentID={Number(employee?.delegeteDepartmentId)}
                control={control}
              />
            </div>
            <Description>{t("editEmployeePage.note")}</Description>
          </div>

          <div className="flex flex-wrap gap-3">
            {isEmployeeDataLoading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-36">
                    <ButtonSkeleton fullWidth={false} />
                  </div>
                ))}
              </>
            ) : (
              <>
                <HasPermission permission="Update Employee">
                  <Button fullWidth={false} isLoading={isupdateing}>
                    {isupdateing
                      ? t("buttons.loading")
                      : t("buttons.updateInformations")}
                  </Button>
                </HasPermission>
                <HasPermission permission="Unlock Account">
                  {employee?.isBlocked && (
                    <Button
                      fullWidth={false}
                      isLoading={isUnblockAccountLoading}
                      variant={"black"}
                      type="button"
                      onClick={() => setIsUnblockPopupOpen(true)}
                    >
                      {isUnblockAccountLoading
                        ? t("buttons.loading")
                        : t("buttons.unblock")}
                    </Button>
                  )}
                </HasPermission>
                <HasPermission permission="Delete Employee">
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
        </form>

        <HasPermission permission="Update Password">
          {/* Password Update Section */}
          <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
            <SectionHeader
              title={t("editEmployeePage.passwordSectionHeader.title")}
              description={t(
                "editEmployeePage.passwordSectionHeader.description"
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
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          {/* Bottom-right aligned button */}

          <form
            className="space-y-5"
            onSubmit={handleSubmitWorkingDaysForm(
              handleConfirmUpdateWorkingDaysForm
            )}
          >
            {/* Working Days Section */}
            <div className="flex items-center justify-between mb-4">
              <SectionHeader
                title={t("editEmployeePage.workingDaysSectionHeader.title")}
                description={t(
                  "editEmployeePage.workingDaysSectionHeader.description"
                )}
              />
              <Button
                variant="outline"
                size="sm"
                type="button"
                icon={<RotateCcw size={16} />}
                className="text-red-500 border-red-300 hover:bg-red-50"
                onClick={() => {
                  setIsRestorePopupOpen(true); // ✅ update this
                }}
              >
                استرجاع الجدول السابق
              </Button>
            </div>

            <div className="space-y-2">
              <WorkingDaysCheckboxes
                checkedDays={selectedWorkingDays}
                setCheckedDays={setSelectedWorkingDays}
                isLoading={isEmployeeDataLoading || isWorkingDaysLoading}
                disabledDays={selectedRestDays} // prevent overlap
              />
            </div>

            {/* Rest Days Section */}
            <SectionHeader
              title={t("editEmployeePage.restDaysSectionHeader.title")}
              description={t(
                "editEmployeePage.restDaysSectionHeader.description"
              )}
            />
            <div className="space-y-2 pb-4">
              <WorkingDaysCheckboxes
                checkedDays={selectedRestDays}
                setCheckedDays={setSelectedRestDays}
                isLoading={isEmployeeDataLoading || isWorkingDaysLoading}
                disabledDays={selectedWorkingDays} // prevent overlap
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field className="space-y-2">
                <Label size="lg">{t("inputs.attendStartDate.label")}</Label>
                <Input
                  type="date"
                  placeholder={t("inputs.attendTime.placeholder")}
                  isError={!!updateHoursErrors.StartDate}
                  icon={<Calendar />}
                  {...updateDaysRegister("StartDate")}
                />
                {updateHoursErrors.StartDate && (
                  <InputErrorMessage>
                    {t(
                      `inputs.attendTime.inputValidation.${updateHoursErrors.StartDate?.type}`
                    )}
                  </InputErrorMessage>
                )}
              </Field>
              <Field className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label size="lg">{t("inputs.attendEndDate.label")}</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="noEndDate"
                      checked={isEndDateNull}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setIsEndDateNull(isChecked);
                        setDaysValue("EndDate", isChecked ? null : undefined); // update form state
                      }}
                      className="accent-primary"
                    />
                    <label htmlFor="noEndDate" className="text-sm">
                      {t("noEndDate", "لا يوجد تاريخ نهاية")}
                    </label>
                  </div>
                </div>

                <Input
                  type="date"
                  placeholder={t("inputs.goTime.placeholder")}
                  isError={!!updateDaysErrors.EndDate}
                  disabled={isEndDateNull}
                  icon={<Calendar />}
                  {...updateDaysRegister("EndDate")}
                />

                {updateDaysErrors.EndDate && (
                  <InputErrorMessage>
                    {t(
                      `inputs.goTime.inputValidation.${updateDaysErrors.EndDate?.type}`
                    )}
                  </InputErrorMessage>
                )}
              </Field>
            </div>

            <Field className="space-y-4">
              <Label size="lg">{t("inputs.description.label")}</Label>
              <Textarea
                placeholder={t("inputs.description.placeholder")}
                {...updateDaysRegister("Description")}
              />
            </Field>

            <div className="flex flex-wrap gap-3">
              <Button fullWidth={false} isLoading={isUpdateDaysLoading}>
                {isUpdateDaysLoading
                  ? t("buttons.loading")
                  : t("buttons.updateWorkingDays")}
              </Button>
            </div>
          </form>
        </div>
        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader
            title={t("editEmployeePage.hoursSectionHeader.title")}
            description={t("editEmployeePage.hoursSectionHeader.description")}
          />
          <form
            className="space-y-5"
            onSubmit={handleSubmitUpdateHours(handleConfirmUpdateWorkingHours)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field className="space-y-2">
                <Label size="lg">{t("inputs.attendTime.label")}</Label>
                <Input
                  type="time"
                  placeholder={t("inputs.attendTime.placeholder")}
                  isError={!!updateHoursErrors.AttendTime}
                  icon={<Timer />}
                  {...updateHoursRegister("AttendTime")}
                />
                <Label size="lg">{t("inputs.attendStartDate.label")}</Label>
                <Input
                  type="date"
                  placeholder={t("inputs.attendTime.placeholder")}
                  isError={!!updateHoursErrors.StartDate}
                  icon={<Calendar />}
                  {...updateHoursRegister("StartDate")}
                />
                {updateHoursErrors.StartDate && (
                  <InputErrorMessage>
                    {t(
                      `inputs.attendTime.inputValidation.${updateHoursErrors.StartDate?.type}`
                    )}
                  </InputErrorMessage>
                )}
              </Field>
              <Field className="space-y-2">
                <Label size="lg">{t("inputs.goTime.label")}</Label>
                <Input
                  type="time"
                  placeholder={t("inputs.goTime.placeholder")}
                  isError={!!updateHoursErrors.GoTime}
                  icon={<Timer />}
                  {...updateHoursRegister("GoTime")}
                />
                <Label size="lg">{t("inputs.attendEndDate.label")}</Label>
                <Input
                  type="date"
                  placeholder={t("inputs.goTime.placeholder")}
                  isError={!!updateHoursErrors.GoTime}
                  icon={<Calendar />}
                  {...updateHoursRegister("EndDate")}
                />
                {updateHoursErrors.EndDate && (
                  <InputErrorMessage>
                    {t(
                      `inputs.goTime.inputValidation.${updateHoursErrors.EndDate?.type}`
                    )}
                  </InputErrorMessage>
                )}
              </Field>
            </div>
            <Field className="space-y-4">
              <Label size="lg">{t("inputs.Reports.label")}</Label>

              <FileInputPreview {...updateHoursRegister("MedicalReport")} />
              <Label size="lg">{t("inputs.description.label")}</Label>
              <Textarea
                placeholder={t("inputs.description.placeholder")}
                {...updateHoursRegister("Description")}
              />
            </Field>
            <div className="flex flex-wrap gap-3">
              <Button fullWidth={false} isLoading={isUpdateHoursLoading}>
                {isUpdateDaysLoading
                  ? t("buttons.loading")
                  : t("buttons.updateHours")}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <DeletePopup
        isOpen={isDeletePopupOpen}
        handleClose={() => {
          setIsDeletePopupOpen(false);
        }}
        handleConfirmDelete={handleConfirmDelete}
        isLoading={isDeleting}
      />
      <GoToPreviousSchedulePopup
        isOpen={isRestorePopupOpen}
        handleClose={() => {
          setIsRestorePopupOpen(false);
        }}
        handleConfirmRestore={handleConfirmRestore}
        isLoading={isRestoring}
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

export default EditEmployeePage;
