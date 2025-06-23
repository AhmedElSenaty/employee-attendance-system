import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { ISickRequestUpdateReportCredentials } from "../../../../interfaces";
import { Description, Field, InputErrorMessage, Label } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { SICK_REQUESTS_NS } from "../../../../constants";
import { FileInputPreview } from "../../../../components/ui/Form/FileUpload";

interface IInputsProps {
  register: UseFormRegister<ISickRequestUpdateReportCredentials>;
  errors: FieldErrors<ISickRequestUpdateReportCredentials>;
  watch: UseFormWatch<ISickRequestUpdateReportCredentials>
}
const EditReportInputs = ({
  register,
  errors,
  watch
}: IInputsProps) => {
  const medicalReportFile = watch("MedicalReport");

  const { t } = useTranslation([SICK_REQUESTS_NS]);
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
    </>
  )
}

export default EditReportInputs
