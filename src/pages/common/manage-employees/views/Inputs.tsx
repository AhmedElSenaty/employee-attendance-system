import { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  Field,
  Input,
  InputErrorMessage,
  InputSkeleton,
  Label,
  LabelSkeleton,
} from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { EMPLOYEE_NS } from "../../../../constants";
import { EmployeeFormValues } from "../../../../validation";
import { useUserStore } from "../../../../store";
import { NavLink } from "react-router";

interface Props {
  register: UseFormRegister<EmployeeFormValues>;
  errors: FieldErrors<EmployeeFormValues>;
  isUpdateEmployee?: boolean;
  isLoading?: boolean;
}

const Inputs = ({ register, errors, isUpdateEmployee, isLoading }: Props) => {
  const { t } = useTranslation([EMPLOYEE_NS]);
  const role = useUserStore((state) => state.role);

  if (isLoading) {
    return (
      <>
        {[...Array(10)].map((_, i) => (
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
      {/* Username */}
      {isUpdateEmployee && (
        <Field className="space-y-2">
          <Label size="lg">{t("inputs.username.label")}</Label>
          <Input
            placeholder={t("inputs.username.placeholder")}
            {...register("username")}
            isError={!!errors["username"]}
          />
          {errors["username"] && (
            <InputErrorMessage>
              {t(`inputs.username.inputValidation.${errors["username"].type}`)}
            </InputErrorMessage>
          )}
        </Field>
      )}

      {/* Email */}
      {isUpdateEmployee && (
        <Field className="space-y-2">
          <Label size="lg">{t("inputs.email.label")}</Label>
          <Input
            type="email"
            placeholder={t("inputs.email.placeholder")}
            {...register("email")}
            isError={!!errors["email"]}
          />
          {errors["email"] && (
            <InputErrorMessage>
              {t(`inputs.email.inputValidation.${errors["email"].type}`)}
            </InputErrorMessage>
          )}
        </Field>
      )}

      {/* Full Name */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.fullName.label")}</Label>
        <Input
          placeholder={t("inputs.fullName.placeholder")}
          {...register("fullName")}
          isError={!!errors["fullName"]}
        />
        {errors["fullName"] && (
          <InputErrorMessage>
            {t(`inputs.fullName.inputValidation.${errors["fullName"].type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* SSN */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.ssn.label")}</Label>
        <Input
          placeholder={t("inputs.ssn.placeholder")}
          {...register("ssn")}
          isError={!!errors["ssn"]}
        />
        {errors["ssn"] && (
          <InputErrorMessage>
            {t(`inputs.ssn.inputValidation.${errors["ssn"].type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Phone Number */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.phoneNumber.label")}</Label>
        <Input
          placeholder={t("inputs.phoneNumber.placeholder")}
          {...register("phoneNumber")}
          isError={!!errors["phoneNumber"]}
        />
        {errors["phoneNumber"] && (
          <InputErrorMessage>
            {t(
              `inputs.phoneNumber.inputValidation.${errors["phoneNumber"].type}`
            )}
          </InputErrorMessage>
        )}
      </Field>

      {/* Hiring Date */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.hiringDate.label")}</Label>
        <Input
          type="date"
          {...register("hiringDate")}
          isError={!!errors["hiringDate"]}
        />
        {errors["hiringDate"] && (
          <InputErrorMessage>
            {t(
              `inputs.hiringDate.inputValidation.${errors["hiringDate"].type}`
            )}
          </InputErrorMessage>
        )}
      </Field>

      {/* Total Leave Requests */}
      {isUpdateEmployee && (
        <Field className="space-y-2">
          <Label size="lg">{t("inputs.totalLeaveRequests.label")}</Label>
          <Input
            placeholder={t("inputs.totalLeaveRequests.placeholder")}
            type="number"
            {...register("totalLeaveRequests")}
            isError={!!errors["totalLeaveRequests"]}
            disabled={isUpdateEmployee && role === "manager"}
          />
          {errors["totalLeaveRequests"] && (
            <InputErrorMessage>
              {t(
                `inputs.totalLeaveRequests.inputValidation.${errors["totalLeaveRequests"].type}`
              )}
            </InputErrorMessage>
          )}
        </Field>
      )}

      {/* Available Leave Requests Per Month */}
      <Field className="space-y-2">
        <Label size="lg">
          {t("inputs.avilableLeaveRequestsPerMonth.label")}
        </Label>
        <Input
          placeholder={t("inputs.avilableLeaveRequestsPerMonth.placeholder")}
          type="number"
          {...register("avilableLeaveRequestsPerMonth")}
          isError={!!errors["avilableLeaveRequestsPerMonth"]}
          disabled={isUpdateEmployee && role === "manager"}
        />
        {errors["avilableLeaveRequestsPerMonth"] && (
          <InputErrorMessage>
            {t(
              `inputs.avilableLeaveRequestsPerMonth.inputValidation.${errors["avilableLeaveRequestsPerMonth"].type}`
            )}
          </InputErrorMessage>
        )}
      </Field>

      {/* Total Ordinary Leaves */}
      {isUpdateEmployee && (
        <Field className="space-y-2">
          <Label size="lg">{t("inputs.totalOrdinaryLeaves.label")}</Label>
          <Input
            placeholder={t("inputs.totalOrdinaryLeaves.placeholder")}
            type="number"
            {...register("totalOrdinaryLeaves")}
            isError={!!errors["totalOrdinaryLeaves"]}
            disabled={isUpdateEmployee && role === "manager"}
          />
          {errors["totalOrdinaryLeaves"] && (
            <InputErrorMessage>
              {t(
                `inputs.totalOrdinaryLeaves.inputValidation.${errors["totalOrdinaryLeaves"].type}`
              )}
            </InputErrorMessage>
          )}
        </Field>
      )}

      {/* Available Ordinary Leaves Per Year */}
      <Field className="space-y-2">
        <Label size="lg">
          {t("inputs.avilableOrdinaryLeaveeRequestsPerYear.label")}
        </Label>
        <Input
          placeholder={t(
            "inputs.avilableOrdinaryLeaveeRequestsPerYear.placeholder"
          )}
          type="number"
          {...register("avilableOrdinaryLeaveeRequestsPerYear")}
          isError={!!errors["avilableOrdinaryLeaveeRequestsPerYear"]}
          disabled={isUpdateEmployee && role === "manager"}
        />
        {errors["avilableOrdinaryLeaveeRequestsPerYear"] && (
          <InputErrorMessage>
            {t(
              `inputs.avilableOrdinaryLeaveeRequestsPerYear.inputValidation.${errors["avilableOrdinaryLeaveeRequestsPerYear"].type}`
            )}
          </InputErrorMessage>
        )}
      </Field>

      {/* Total Casual Leaves */}
      {isUpdateEmployee && (
        <Field className="space-y-2">
          <Label size="lg">{t("inputs.totalCasualLeaves.label")}</Label>
          <Input
            placeholder={t("inputs.totalCasualLeaves.placeholder")}
            type="number"
            {...register("totalCasualLeaves")}
            isError={!!errors["totalCasualLeaves"]}
            disabled={isUpdateEmployee && role === "manager"}
          />
          {errors["totalCasualLeaves"] && (
            <InputErrorMessage>
              {t(
                `inputs.totalCasualLeaves.inputValidation.${errors["totalCasualLeaves"].type}`
              )}
            </InputErrorMessage>
          )}
        </Field>
      )}

      {/* Available Casual Leaves Per Year */}
      <Field className="space-y-2">
        <Label size="lg">
          {t("inputs.avilableCasualLeaveeRequestsPerYear.label")}
        </Label>
        <Input
          placeholder={t(
            "inputs.avilableCasualLeaveeRequestsPerYear.placeholder"
          )}
          type="number"
          {...register("avilableCasualLeaveeRequestsPerYear")}
          isError={!!errors["avilableCasualLeaveeRequestsPerYear"]}
          disabled={isUpdateEmployee && role === "manager"}
        />
        {errors["avilableCasualLeaveeRequestsPerYear"] && (
          <InputErrorMessage>
            {t(
              `inputs.avilableCasualLeaveeRequestsPerYear.inputValidation.${errors["avilableCasualLeaveeRequestsPerYear"].type}`
            )}
          </InputErrorMessage>
        )}
      </Field>

      <p
        dir="ltr"
        className="text-left text-sm text-gray-700 mt-2"
        style={{ direction: "ltr", textAlign: "left" }}
      >
        {t("changeRequest.text")}{" "}
        <NavLink
          to="../change-vacation-requests"
          className="inline text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
        >
          {t("changeRequest.linkLabel")}
        </NavLink>
      </p>
    </>
  );
};

export default Inputs;
