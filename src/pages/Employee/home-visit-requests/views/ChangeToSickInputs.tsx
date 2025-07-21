import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Description, Field, InputErrorMessage, Label, Textarea } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { HOME_VISIT_REQUESTS_NS } from "../../../../constants";
import { FileInputPreview } from "../../../../components/ui/Form/FileUpload";
import { ChangeToSickFormValues } from "../../../../validation/homeVisit.schema";

interface Props {
  register: UseFormRegister<ChangeToSickFormValues>;
  errors: FieldErrors<ChangeToSickFormValues>;
  watch: UseFormWatch<ChangeToSickFormValues>
}
const ChangeToSickInputs = ({
  register,
  errors,
  watch
}: Props) => {

  const { t } = useTranslation([HOME_VISIT_REQUESTS_NS]);
  const medicalReportFile = watch("MedicalReport") as FileList;
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

export default ChangeToSickInputs
