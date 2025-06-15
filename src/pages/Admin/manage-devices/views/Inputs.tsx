import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IDeviceCredentials } from "../../../../interfaces";
import { Field, Input, InputErrorMessage, InputSkeleton, Label, LabelSkeleton } from "../../../../components/ui";
import { DEVICES_NS } from "../../../../constants";
import { useTranslation } from "react-i18next";

interface IDeviceInputsProps {
  register: UseFormRegister<IDeviceCredentials>;
  errors: FieldErrors<IDeviceCredentials>;
  isLoading?: boolean;
}

const RenderDeviceInputs = ({ register, errors, isLoading }: IDeviceInputsProps) => {
  const { t } = useTranslation([DEVICES_NS]);

  return (
    <>
      {/* Device Name */}
      <Field className="space-y-2">
        {isLoading ? (
          <>
            <LabelSkeleton />
            <InputSkeleton />
          </>
        ) : (
          <>
            <Label size="lg">
              {t("form.device_name.label")}
            </Label>
            <Input
              type="text"
              placeholder={t("form.device_name.placeholder")}
              isError={!!errors.device_name}
              {...register("device_name")}
            />
            {errors.device_name && (
              <InputErrorMessage>
                {t(`form.device_name.inputValidation.${errors.device_name.type}`)}
              </InputErrorMessage>
            )}
          </>
        )}
      </Field>

      {/* IP Address */}
      <Field className="space-y-2">
        {isLoading ? (
          <>
            <LabelSkeleton />
            <InputSkeleton />
          </>
        ) : (
          <>
            <Label size="lg">
              {t("form.ip_address.label")}
            </Label>
            <Input
              type="text"
              placeholder={t("form.ip_address.placeholder")}
              isError={!!errors.iP_Address}
              {...register("iP_Address")}
            />
            {errors.iP_Address && (
              <InputErrorMessage>
                {t(`form.ip_address.inputValidation.${errors.iP_Address.type}`)}
              </InputErrorMessage>
            )}
          </>
        )}
      </Field>

      {/* Port */}
      <Field className="space-y-2">
        {isLoading ? (
          <>
            <LabelSkeleton />
            <InputSkeleton />
          </>
        ) : (
          <>
            <Label size="lg">
              {t("form.port.label")}
            </Label>
            <Input
              type="number"
              placeholder={t("form.port.placeholder")}
              isError={!!errors.port}
              {...register("port")}
            />
            {errors.port && (
              <InputErrorMessage>
                {t(`form.port.inputValidation.${errors.port.type}`)}
              </InputErrorMessage>
            )}
          </>
        )}
      </Field>
    </>
  );
};

export default RenderDeviceInputs;
