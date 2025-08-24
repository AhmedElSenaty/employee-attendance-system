import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import {
  CustomSelect,
  Field,
  Input,
  InputErrorMessage,
  InputSkeleton,
  Label,
  LabelSkeleton,
  SelectBoxSkeleton,
} from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { EMPLOYEE_NS } from "../../../../constants";
import { EmployeeFormValues } from "../../../../validation";
import { useUserStore } from "../../../../store";
import { useGetOvertimePriceCategoryList } from "../../../../hooks";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router";
import { HasPermission } from "../../../../components/auth";

interface Props {
  register: UseFormRegister<EmployeeFormValues>;
  errors: FieldErrors<EmployeeFormValues>;
  isUpdateEmployee?: boolean;
  isLoading?: boolean;
  setValue: UseFormSetValue<EmployeeFormValues>;
  initialCategoryId?: number | null;
}

const Inputs = ({
  register,
  errors,
  isUpdateEmployee,
  isLoading,
  setValue,
  initialCategoryId,
}: Props) => {
  const { t } = useTranslation([EMPLOYEE_NS]);
  const role = useUserStore((state) => state.role);

  const [selectCategoryId, setCategoryId] = useState<number | null>();
  // selectedDepartmentID || null

  const { list, isLoading: isCategoryLoading } =
    useGetOvertimePriceCategoryList();

  const categoryOptions = useMemo(
    () =>
      list?.map((c: any) => ({
        value: c.id,
        label: c.description,
      })) || [],
    [list]
  );

  useEffect(() => {
    if (typeof initialCategoryId === "number") {
      setCategoryId(initialCategoryId);
      setValue("overtimeCategoryId", initialCategoryId);
    } else if (initialCategoryId === null) {
      setCategoryId(null);
      setValue("overtimeCategoryId", null);
    }
  }, [initialCategoryId, setValue]);

  const selectedOption =
    categoryOptions.find(
      (opt: { value: number }) => opt.value === selectCategoryId
    ) || null;

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
      {/* employee id */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.employeeId.label")}</Label>
        <Input
          disabled={isUpdateEmployee}
          onWheel={(e) => e.currentTarget.blur()}
          type="number"
          placeholder={t("inputs.employeeId.placeholder")}
          {...register("employeeId")}
          isError={!!errors["employeeId"]}
        />
        {errors["employeeId"] && (
          <InputErrorMessage>
            {t(
              `inputs.employeeId.inputValidation.${errors["employeeId"].type}`
            )}
          </InputErrorMessage>
        )}
      </Field>

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
            onWheel={(e) => e.currentTarget.blur()}
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
          onWheel={(e) => e.currentTarget.blur()}
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
            onWheel={(e) => e.currentTarget.blur()}
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
          onWheel={(e) => e.currentTarget.blur()}
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
            onWheel={(e) => e.currentTarget.blur()}
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
          onWheel={(e) => e.currentTarget.blur()}
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

      {/* category Select */}

      <HasPermission permission={"Manage WorkOvertime"}>
        <Field className="space-y-3 w-full sm:w-auto flex flex-col">
          <Label size="lg">{t("inputs.overtime")}</Label>
          {isCategoryLoading || isLoading ? (
            <SelectBoxSkeleton />
          ) : (
            <CustomSelect
              placeholder={t("filters.select.label")}
              options={categoryOptions}
              value={
                categoryOptions.find((opt) => opt.value === selectCategoryId) ||
                initialCategoryId
              }
              onChange={(option) => {
                const val = (option as any)?.value ?? null;
                setCategoryId(val);
                setValue("overtimeCategoryId", val, {
                  // shouldValidate: true,
                  // shouldDirty: true,
                });
              }}
              className="w-full"
              isSearchable
              isClearable
            />
          )}
        </Field>
        <input
          type="hidden"
          {...register("overtimeCategoryId")}
          value={selectCategoryId ?? ""}
        />
      </HasPermission>

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
