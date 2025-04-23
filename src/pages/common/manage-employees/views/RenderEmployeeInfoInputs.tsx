import { FieldErrors, UseFormRegister } from "react-hook-form";
import { IEmployeeCredentials } from "../../../../interfaces";
import { TFunction } from "i18next";
import {
  Field,
  Input,
  InputErrorMessage,
  InputSkeleton,
  Label,
  LabelSkeleton,
} from "../../../../components/ui/Forms";
import { EMPLOYEE_TRANSLATION_NAMESPACE } from "..";

interface IRenderEmployeeInputsProps {
  register: UseFormRegister<IEmployeeCredentials>;
  errors: FieldErrors<IEmployeeCredentials>;
  t: TFunction;
  isUpdateEmployee?: boolean;
  isLoading?: boolean;
}

const RenderEmployeeInputs = ({
  register,
  errors,
  isUpdateEmployee,
  isLoading,
  t,
}: IRenderEmployeeInputsProps) => {
  if(isLoading) {
    return (
      <>
        <Field className="flex-1 w-full sm:w-auto flex flex-col space-y-3">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
        <Field className="flex-1 w-full sm:w-auto flex flex-col space-y-3">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
        <Field className="flex-1 w-full sm:w-auto flex flex-col space-y-3">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
        <Field className="flex-1 w-full sm:w-auto flex flex-col space-y-3">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
        <Field className="flex-1 w-full sm:w-auto flex flex-col space-y-3">
          <LabelSkeleton />
          <InputSkeleton />
        </Field>
      </>
    )
  }
  return (
    <>
      {/* Username */}
      {isUpdateEmployee && (
        <Field className="space-y-2">
          <Label size="lg">{t("form.username.label", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</Label>
          <Input
            placeholder={t("form.username.placeholder", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
            {...register("username")}
            isError={!!errors["username"]}
          />
          {errors["username"] && (
            <InputErrorMessage>
              {t(`form.username.inputValidation.${errors["username"].type}`, { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
            </InputErrorMessage>
          )}
        </Field>
      )}

      {/* Email */}
      {isUpdateEmployee && (
        <Field className="space-y-2">
          <Label size="lg">{t("form.email.label", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</Label>
          <Input
            type="email"
            placeholder={t("form.email.placeholder", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
            {...register("email")}
            isError={!!errors["email"]}
          />
          {errors["email"] && (
            <InputErrorMessage>
              {t(`form.email.inputValidation.${errors["email"].type}`, { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
            </InputErrorMessage>
          )}
        </Field>
      )}

      {/* Full Name */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.fullName.label", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</Label>
        <Input
          placeholder={t("form.fullName.placeholder", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
          {...register("fullName")}
          isError={!!errors["fullName"]}
        />
        {errors["fullName"] && (
          <InputErrorMessage>
            {t(`form.fullName.inputValidation.${errors["fullName"].type}`, { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>

      {/* SSN */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.ssn.label", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</Label>
        <Input
          placeholder={t("form.ssn.placeholder", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
          {...register("ssn")}
          isError={!!errors["ssn"]}
        />
        {errors["ssn"] && (
          <InputErrorMessage>
            {t(`form.ssn.inputValidation.${errors["ssn"].type}`, { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Phone Number */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.phoneNumber.label", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</Label>
        <Input
          placeholder={t("form.phoneNumber.placeholder", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
          {...register("phoneNumber")}
          isError={!!errors["phoneNumber"]}
        />
        {errors["phoneNumber"] && (
          <InputErrorMessage>
            {t(`form.phoneNumber.inputValidation.${errors["phoneNumber"].type}`, { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Hiring Date */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.hiringDate.label", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</Label>
        <Input
          type="date"
          {...register("hiringDate")}
          isError={!!errors["hiringDate"]}
        />
        {errors["hiringDate"] && (
          <InputErrorMessage>
            {t(`form.hiringDate.inputValidation.${errors["hiringDate"].type}`, { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Old ID */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.oldId.label", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</Label>
        <Input
          placeholder={t("form.oldId.placeholder", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
          type="number"
          {...register("oldId")}
          isError={!!errors["oldId"]}
        />
        {errors["oldId"] && (
          <InputErrorMessage>
            {t(`form.oldId.inputValidation.${errors["oldId"].type}`, { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default RenderEmployeeInputs;
