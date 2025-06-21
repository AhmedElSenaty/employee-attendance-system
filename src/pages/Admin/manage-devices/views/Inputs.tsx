import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Description, Field, Input, InputErrorMessage, InputSkeleton, Label, LabelSkeleton } from "../../../../components/ui";
import { DEVICES_NS } from "../../../../constants";
import { useTranslation } from "react-i18next";
import { DeviceFormValues } from "../../../../validation";

interface IDeviceInputsProps {
  register: UseFormRegister<DeviceFormValues>;
  errors: FieldErrors<DeviceFormValues>;
  isLoading?: boolean;
}

const RenderDeviceInputs = ({ register, errors, isLoading }: IDeviceInputsProps) => {
  const { t } = useTranslation([DEVICES_NS]);

  if (isLoading) {
    return (
      <>
        {[...Array(3)].map((_, i) => (
          <Field key={i} className="space-y-2">
            <LabelSkeleton />
            <InputSkeleton />
          </Field>
        ))}
      </>
    );
  }

  return (
    <>
      {/* Device Name */}
      <Field className="space-y-2">
        <Label size="lg">
          {t("inputs.device_name.label")}
        </Label>
        <Input
          type="text"
          placeholder={t("inputs.device_name.placeholder")}
          isError={!!errors.device_name}
          {...register("device_name")}
        />
        {errors.device_name && (
          <InputErrorMessage>
            {t(`inputs.device_name.inputValidation.${errors.device_name.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* IP Address */}
      <Field className="space-y-2">
        <Label size="lg">
          {t("inputs.ip_address.label")}
        </Label>
        <Input
          type="text"
          placeholder={t("inputs.ip_address.placeholder")}
          isError={!!errors.iP_Address}
          {...register("iP_Address")}
        />
        <Description>{t("inputs.ip_address.description")}</Description>
        {errors.iP_Address && (
          <InputErrorMessage>
            {t(`inputs.ip_address.inputValidation.${errors.iP_Address.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Port */}
      <Field className="space-y-2">
        <Label size="lg">
          {t("inputs.port.label")}
        </Label>
        <Input
          type="number"
          placeholder={t("inputs.port.placeholder")}
          isError={!!errors.port}
          {...register("port")}
        />
        <Description>{t("inputs.port.description")}</Description>
        {errors.port && (
          <InputErrorMessage>
            {t(`inputs.port.inputValidation.${errors.port.type}`)}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default RenderDeviceInputs;
