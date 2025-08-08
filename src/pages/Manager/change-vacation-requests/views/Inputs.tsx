import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import {
  CustomSelect,
  Field,
  Input,
  InputErrorMessage,
  Label,
  SelectBoxSkeleton,
  Textarea,
} from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { AddChangeVacationCountFormValues } from "../../../../validation/changeVacationCount.schema";
import { useGetEmployeesList } from "../../../../hooks";
import { EmployeeSummary } from "../../../../interfaces";

interface Props {
  register: UseFormRegister<AddChangeVacationCountFormValues>;
  errors: FieldErrors<AddChangeVacationCountFormValues>;
  setValue: UseFormSetValue<AddChangeVacationCountFormValues>;
  selectedEmployeeId: number | null;
  setSelectedEmployeeId: (id: number | null) => void;
  isEdit: boolean;
}

const AddInputs = ({
  register,
  errors,
  setValue,
  selectedEmployeeId,
  setSelectedEmployeeId,
  isEdit,
}: Props) => {
  const { t } = useTranslation("changeVacationsRequests");

  const { employeesList, isLoading: isEmployeesListLoading } =
    useGetEmployeesList();
  const employeeOptions =
    employeesList?.map((employee: EmployeeSummary) => ({
      value: employee.id,
      label: employee.name,
    })) || [];

  return (
    <>
      {/* Employee ID */}
      {!isEdit && (
        <Field className="space-y-2">
          <Label size="lg">{t("inputs.employeeId.label")}</Label>

          {isEmployeesListLoading ? (
            <SelectBoxSkeleton />
          ) : (
            <CustomSelect
              className="w-full"
              // placeholder={t("inputs.employeeId.placeholder")}
              options={employeeOptions}
              value={
                employeeOptions.find(
                  (opt) => opt.value === selectedEmployeeId
                ) || null
              }
              onChange={(option) => {
                const value = option?.value ?? null;
                setSelectedEmployeeId(value);
                setValue("employeeId", value); // ✅ manually set value in form
              }}
              error={!!errors.employeeId}
              isSearchable
              isClearable
            />
          )}

          {errors.employeeId && (
            <InputErrorMessage>
              {t(
                `inputs.employeeId.inputValidation.${errors.employeeId?.type}`
              )}
            </InputErrorMessage>
          )}
        </Field>
      )}

      {/* Total / Available Casual */}
      <div className="grid grid-cols-2 gap-4">
        <Field className="space-y-2">
          <Label>{t("table.columns.totalCasual")}</Label>
          <Input
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
            isError={!!errors.totalCasual}
            {...register("totalCasual")}
          />
          {errors.totalCasual && (
            <InputErrorMessage>
              {t(
                `inputs.totalCasual.inputValidation.${errors.totalCasual.type}`
              )}
            </InputErrorMessage>
          )}
        </Field>
        <Field className="space-y-2">
          <Label>{t("table.columns.availableCasual")}</Label>
          <Input
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
            isError={!!errors.availableCasual}
            {...register("availableCasual")}
          />
          {errors.availableCasual && (
            <InputErrorMessage>
              {t(
                `inputs.availableCasual.inputValidation.${errors.availableCasual.type}`
              )}
            </InputErrorMessage>
          )}
        </Field>
      </div>

      {/* Total / Available Ordinary */}
      <div className="grid grid-cols-2 gap-4">
        <Field className="space-y-2">
          <Label>{t("table.columns.totalOrdinary")}</Label>
          <Input
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
            isError={!!errors.totalOrdinary}
            {...register("totalOrdinary")}
          />
          {errors.totalOrdinary && (
            <InputErrorMessage>
              {t(
                `inputs.totalOrdinary.inputValidation.${errors.totalOrdinary.type}`
              )}
            </InputErrorMessage>
          )}
        </Field>
        <Field className="space-y-2">
          <Label>{t("table.columns.availableOrdinary")}</Label>
          <Input
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
            isError={!!errors.availableOrdinary}
            {...register("availableOrdinary")}
          />
          {errors.availableOrdinary && (
            <InputErrorMessage>
              {t(
                `inputs.availableOrdinary.inputValidation.${errors.availableOrdinary.type}`
              )}
            </InputErrorMessage>
          )}
        </Field>
      </div>

      {/* Total / Available Leave Requests */}
      <div className="grid grid-cols-2 gap-4">
        <Field className="space-y-2">
          <Label>{t("table.columns.totalLeaveRequest")}</Label>
          <Input
            onWheel={(e) => e.currentTarget.blur()}
            type="number"
            isError={!!errors.totalLeaveRequest}
            {...register("totalLeaveRequest")}
          />
          {errors.totalLeaveRequest && (
            <InputErrorMessage>
              {t(
                `inputs.totalLeaveRequest.inputValidation.${errors.totalLeaveRequest.type}`
              )}
            </InputErrorMessage>
          )}
        </Field>
        <Field className="space-y-2">
          <Label>{t("table.columns.availableLeaveRequest")}</Label>
          <Input
            type="number"
            onWheel={(e) => e.currentTarget.blur()}
            isError={!!errors.availableLeaveRequest}
            {...register("availableLeaveRequest")}
          />
          {errors.availableLeaveRequest && (
            <InputErrorMessage>
              {t(
                `inputs.availableLeaveRequest.inputValidation.${errors.availableLeaveRequest.type}`
              )}
            </InputErrorMessage>
          )}
        </Field>
      </div>

      {/* Description */}
      <Field className="space-y-2">
        <Label>{t("inputs.description.label")}</Label>
        <Textarea
          placeholder={t("inputs.description.placeholder")}
          isError={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <InputErrorMessage>
            {t(`inputs.description.inputValidation.${errors.description.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      <Field className="space-y-2">
        <Label>{t("inputs.reportImage.label")}</Label>
        <Input
          type="file"
          isError={!!errors.medicalReportImageUrl}
          onChange={(e) => {
            const fileList = e.target.files;
            if (fileList && fileList.length > 0) {
              setValue("medicalReportImageUrl", fileList[0], {
                shouldValidate: true,
              });
            }
          }}
        />
        {errors.medicalReportImageUrl && (
          <InputErrorMessage>
            {t(
              `inputs.reportImage.inputValidation.${errors.medicalReportImageUrl.type}`
            )}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default AddInputs;
