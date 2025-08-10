import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { useGetEmployeesList } from "../../../../hooks";
import {
  EmployeeSummary,
  IAssignSickRequestCredentials,
} from "../../../../interfaces";
import {
  CustomSelect,
  Description,
  Field,
  Input,
  InputErrorMessage,
  Label,
  SelectBoxSkeleton,
  Textarea,
} from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { SICK_REQUESTS_NS } from "../../../../constants";
import { Calendar } from "lucide-react";
import { FileInputPreview } from "../../../../components/ui/Form/FileUpload";

interface IInputsProps {
  register: UseFormRegister<IAssignSickRequestCredentials>;
  errors: FieldErrors<IAssignSickRequestCredentials>;
  watch: UseFormWatch<IAssignSickRequestCredentials>;
  control: Control<IAssignSickRequestCredentials>;
}
const AssignInputs = ({ register, errors, watch, control }: IInputsProps) => {
  const { t } = useTranslation([SICK_REQUESTS_NS]);
  const medicalReportFile = watch("MedicalReport");
  const { employeesList, isLoading: isEmployeesListLoading } =
    useGetEmployeesList();
  const employeeOptions =
    employeesList?.map((employee: EmployeeSummary) => ({
      value: employee.id,
      label: employee.name,
    })) || [];

  return (
    <>
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.medicalReport.label")}</Label>
        <FileInputPreview
          {...register("MedicalReport")}
          isSelected={Boolean(medicalReportFile?.length)}
          isError={!!errors.MedicalReport}
        />
        {medicalReportFile?.[0] && (
          <a
            href={URL.createObjectURL(medicalReportFile[0])}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm text-blue-600 hover:underline"
          >
            {t("inputs.medicalReport.viewFileButton", "View Selected File")}
          </a>
        )}
        <Description>{t(`inputs.medicalReport.description`)}</Description>
        {errors.MedicalReport && (
          <InputErrorMessage>
            {t(
              `inputs.medicalReport.inputValidation.${errors.MedicalReport?.type}`
            )}
          </InputErrorMessage>
        )}
      </Field>

      {/* Employee ID */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.employeeId.label")}</Label>
        {isEmployeesListLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <Controller
            name="EmployeeId"
            control={control}
            render={({ field }) => (
              <CustomSelect
                className="w-full"
                options={employeeOptions}
                value={
                  employeeOptions.find(
                    (opt: { value: number; label: string }) =>
                      opt.value === field.value
                  ) || null
                }
                onChange={(option) => field.onChange(option?.value)}
                error={!!errors.EmployeeId}
                isSearchable
              />
            )}
          />
        )}
        {errors.EmployeeId && (
          <InputErrorMessage>
            {t(`inputs.employeeId.inputValidation.${errors.EmployeeId?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      <Field className="space-y-2">
        <Label size="lg">{t("inputs.startDate.label")}</Label>
        <Input
          type="date"
          placeholder={t("inputs.startDate.placeholder")}
          isError={!!errors.StartDate}
          icon={<Calendar />}
          {...register("StartDate")}
        />
        {errors.StartDate && (
          <InputErrorMessage>
            {t(`inputs.startDate.inputValidation.${errors.StartDate?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      <Field className="space-y-2">
        <Label size="lg">{t("inputs.numberOfDays.label")}</Label>
        <Input
          type="number"
          onWheel={(e) => e.currentTarget.blur()}
          placeholder={t("inputs.numberOfDays.placeholder")}
          isError={!!errors.NumberOfDays}
          {...register("NumberOfDays")}
        />
        {errors.NumberOfDays && (
          <InputErrorMessage>
            {t(
              `inputs.numberOfDays.inputValidation.${errors.NumberOfDays?.type}`
            )}
          </InputErrorMessage>
        )}
      </Field>

      <Field className="space-y-2">
        <Label size="lg">{t("inputs.permitApproval.label")}</Label>
        <Textarea
          placeholder={t("inputs.permitApproval.placeholder")}
          isError={!!errors.PermitApproval}
          {...register("PermitApproval")}
        />
        {errors.PermitApproval && (
          <InputErrorMessage>
            {t(
              `inputs.permitApproval.inputValidation.${errors.PermitApproval?.type}`
            )}
          </InputErrorMessage>
        )}
      </Field>

      <Field className="space-y-2">
        <Label size="lg">{t("inputs.description.label")}</Label>
        <Textarea
          placeholder={t("inputs.description.placeholder")}
          isError={!!errors.Description}
          {...register("Description")}
        />
        {errors.Description && (
          <InputErrorMessage>
            {t(
              `inputs.description.inputValidation.${errors.Description?.type}`
            )}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default AssignInputs;
