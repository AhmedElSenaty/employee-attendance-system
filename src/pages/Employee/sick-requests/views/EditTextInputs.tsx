import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ISickRequestUpdateTextCredentials } from "../../../../interfaces";
import { Field, Input, InputErrorMessage, Label, Textarea } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { SICK_REQUESTS_NS } from "../../../../constants";
import { Calendar } from "lucide-react";

interface IInputsProps {
  register: UseFormRegister<ISickRequestUpdateTextCredentials>;
  errors: FieldErrors<ISickRequestUpdateTextCredentials>;
}
const EditTextInputs = ({
  register,
  errors,
}: IInputsProps) => {

  const { t } = useTranslation([SICK_REQUESTS_NS]);
  return (
    <>

      <Field className="space-y-2">
        <Label size="lg">{t("inputs.startDate.label")}</Label>
        <Input
          type="date"
          placeholder={t("inputs.startDate.placeholder")}
          isError={!!errors.startDate}
          icon={<Calendar />}
          {...register("startDate")}
        />
        {errors.startDate && (
          <InputErrorMessage>
            {t(`inputs.startDate.inputValidation.${errors.startDate?.type}`)}
          </InputErrorMessage>
        )}
      </Field>
      
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.numberOfDays.label")}</Label>
        <Input
          type="number"
          placeholder={t("inputs.numberOfDays.placeholder")}
          isError={!!errors.numberOfDays}
          {...register("numberOfDays")}
        />
        {errors.numberOfDays && (
          <InputErrorMessage>
            {t(`inputs.numberOfDays.inputValidation.${errors.numberOfDays?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      <Field className="space-y-2">
        <Label size="lg">{t("inputs.permitApproval.label")}</Label>
        <Textarea
          placeholder={t("inputs.permitApproval.placeholder")}
          isError={!!errors.permitApproval}
          {...register("permitApproval")}
        />
        {errors.permitApproval && (
          <InputErrorMessage>
            {t(`inputs.permitApproval.inputValidation.${errors.permitApproval?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      <Field className="space-y-2">
        <Label size="lg">{t("inputs.description.label")}</Label>
        <Textarea
          placeholder={t("inputs.description.placeholder")}
          isError={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <InputErrorMessage>
            {t(`inputs.description.inputValidation.${errors.description?.type}`)}
          </InputErrorMessage>
        )}
      </Field>
    </>
  )
}

export default EditTextInputs
