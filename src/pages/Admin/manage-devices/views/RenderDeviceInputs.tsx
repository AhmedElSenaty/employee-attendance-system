import { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  Field,
  Input,
  InputErrorMessage,
  InputSkeleton,
  Label,
  LabelSkeleton,
} from "../../../../components/ui/Forms";
import { IDeviceCredentials } from "../../../../interfaces";
import { TFunction } from "i18next";
import { DEVICE_TRANSLATION_NAMESPACE } from "..";

interface IDeviceInputsProps {
  register: UseFormRegister<IDeviceCredentials>;
  errors: FieldErrors<IDeviceCredentials>;
  t: TFunction;
  isLoading?: boolean;
}

const RenderDeviceInputs = ({ register, errors, t, isLoading }: IDeviceInputsProps) => {
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
              {t("form.device_name.label", { ns: DEVICE_TRANSLATION_NAMESPACE })}
            </Label>
            <Input
              type="text"
              placeholder={t("form.device_name.placeholder", { ns: DEVICE_TRANSLATION_NAMESPACE })}
              isError={!!errors.device_name}
              {...register("device_name")}
            />
            {errors.device_name && (
              <InputErrorMessage>
                {t(`form.device_name.inputValidation.${errors.device_name.type}`, {
                  ns: DEVICE_TRANSLATION_NAMESPACE,
                })}
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
              {t("form.ip_address.label", { ns: DEVICE_TRANSLATION_NAMESPACE })}
            </Label>
            <Input
              type="text"
              placeholder={t("form.ip_address.placeholder", { ns: DEVICE_TRANSLATION_NAMESPACE })}
              isError={!!errors.iP_Address}
              {...register("iP_Address")}
            />
            {errors.iP_Address && (
              <InputErrorMessage>
                {t(`form.ip_address.inputValidation.${errors.iP_Address.type}`, {
                  ns: DEVICE_TRANSLATION_NAMESPACE,
                })}
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
              {t("form.port.label", { ns: DEVICE_TRANSLATION_NAMESPACE })}
            </Label>
            <Input
              type="number"
              placeholder={t("form.port.placeholder", { ns: DEVICE_TRANSLATION_NAMESPACE })}
              isError={!!errors.port}
              {...register("port")}
            />
            {errors.port && (
              <InputErrorMessage>
                {t(`form.port.inputValidation.${errors.port.type}`, {
                  ns: DEVICE_TRANSLATION_NAMESPACE,
                })}
              </InputErrorMessage>
            )}
          </>
        )}
      </Field>
    </>
  );
};

export default RenderDeviceInputs;
