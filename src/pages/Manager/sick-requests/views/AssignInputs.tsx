import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { useGetEmployeesList } from "../../../../hooks";
import { IAssignSickRequestCredentials } from "../../../../interfaces";
import { Description, Field, Input, InputErrorMessage, Label, SelectBox, SelectBoxSkeleton, Textarea } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { SICK_REQUESTS_NS } from "../../../../constants";
import { Calendar } from "lucide-react";
import { FileInputPreview } from "../../../../components/ui/Form/FileUpload";

interface IInputsProps {
  register: UseFormRegister<IAssignSickRequestCredentials>;
  errors: FieldErrors<IAssignSickRequestCredentials>;
  watch: UseFormWatch<IAssignSickRequestCredentials>
}
const AssignInputs = ({
  register,
  errors,
  watch
}: IInputsProps) => {

  const { t } = useTranslation([SICK_REQUESTS_NS]);
  const medicalReportFile = watch("MedicalReport");
  const { employeesList, isEmployeesListLoading } = useGetEmployeesList();
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
            {t(`inputs.medicalReport.inputValidation.${errors.MedicalReport?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Employee ID */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.employeeId.label")}</Label>
        {isEmployeesListLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <SelectBox isError={!!errors.EmployeeId} {...register("EmployeeId")}>
            <option value="">{t("inputs.employeeId.defaultValue")}</option>
            {employeesList?.map((employee, idx) => (
              <option key={idx} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </SelectBox>
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
          placeholder={t("inputs.numberOfDays.placeholder")}
          isError={!!errors.NumberOfDays}
          {...register("NumberOfDays")}
        />
        {errors.NumberOfDays && (
          <InputErrorMessage>
            {t(`inputs.numberOfDays.inputValidation.${errors.NumberOfDays?.type}`)}
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
            {t(`inputs.permitApproval.inputValidation.${errors.PermitApproval?.type}`)}
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
            {t(`inputs.description.inputValidation.${errors.Description?.type}`)}
          </InputErrorMessage>
        )}
      </Field>
    </>
  )
}

export default AssignInputs
