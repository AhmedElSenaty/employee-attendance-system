import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import { ISickRequestCredentials } from "../../../../interfaces";
import { Field, FileUpload, Input, InputErrorMessage, Label, Textarea } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { SICK_REQUESTS_NS } from "../../../../constants";
import { Calendar, CheckCircle2, ImageIcon } from "lucide-react";

const validateReport = (file: File): string | null => {
  const allowedExtensions = [".jpg", ".jpeg", ".pdf"];
  const maxSizeInMB = 1;
  
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  const fileSizeInMB = file.size / (1024 * 1024);
  
  if (!fileExtension || !allowedExtensions.includes(`.${fileExtension}`)) {
    return "Only PDF, JPG and JPEG files are allowed.";
  }
  
  if (fileSizeInMB > maxSizeInMB) {
    return "File size must not exceed 1MB.";
  }
  
  return null;
};

interface IInputsProps {
  register: UseFormRegister<ISickRequestCredentials>;
  errors: FieldErrors<ISickRequestCredentials>;
  control: Control<ISickRequestCredentials>
}

const AddInputs = ({
  register,
  errors,
  control
}: IInputsProps) => {

  const { t } = useTranslation([SICK_REQUESTS_NS]);

  return (
    <>
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.medicalReport.label")}</Label>

        <Controller
          name="MedicalReport"
          control={control}
          rules={{ required: "Medical report is required" }}
          render={({ field: { onChange } }) => (
            <FileUpload
              onFileSelect={(file) => onChange(file)}
              accept=".jpg,.jpeg,.pdf"
              icon={<ImageIcon className="w-full h-full text-[#19355a]" />}
              successIcon={<CheckCircle2 className="w-full h-full text-green-500" />}
              validateFile={validateReport}
            />
          )}
          />
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

export default AddInputs
