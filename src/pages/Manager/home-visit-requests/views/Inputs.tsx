import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import {
  CustomSelect,
  Field,
  Input,
  InputErrorMessage,
  InputSkeleton,
  Label,
  LabelSkeleton,
  SelectBoxSkeleton,
  Textarea,
  TextareaSkeleton,
} from "../../../../components/ui";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { HOME_VISIT_REQUESTS_NS } from "../../../../constants";
import { AssignHomeLeaveRequestSchema } from "../../../../validation/homeVisit.schema";
import { useGetEmployeesList } from "../../../../hooks";
import { EmployeeSummary } from "../../../../interfaces";

interface Props {
  register: UseFormRegister<AssignHomeLeaveRequestSchema>;
  errors: FieldErrors<AssignHomeLeaveRequestSchema>;
  control?: Control<AssignHomeLeaveRequestSchema>;
  isLoading?: boolean;
  isUpdateForm?: boolean;
}

const Inputs = ({
  register,
  errors,
  control,
  isLoading,
  isUpdateForm = true,
}: Props) => {
  const { t } = useTranslation(HOME_VISIT_REQUESTS_NS);

  const { employeesList, isLoading: isEmployeesListLoading } =
    useGetEmployeesList();

  const employeeOptions =
    employeesList?.map((employee: EmployeeSummary) => ({
      value: employee.id,
      label: employee.name,
    })) || [];
  return (
    <>
      {!isUpdateForm && (
        <Field className="space-y-2">
          <Label size="lg">{t("inputs.employeeId.label")}</Label>
          {isEmployeesListLoading ? (
            <SelectBoxSkeleton />
          ) : (
            <Controller
              name="employeeId"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  className="w-full"
                  options={employeeOptions}
                  value={
                    employeeOptions.find(
                      (opt: { value: number; label: string }) =>
                        opt.value === field.value
                    ) || null
                  }
                  onChange={(option) => field.onChange(option?.value)}
                  error={!!errors.employeeId}
                  isSearchable
                  isClearable
                />
              )}
            />
          )}
          {errors.employeeId && (
            <InputErrorMessage>
              {t(`inputs.employeeId.inputValidation.required`)}
            </InputErrorMessage>
          )}
        </Field>
      )}
      {/* Date */}
      <Field className="space-y-2">
        {isLoading ? (
          <>
            <LabelSkeleton />
            <InputSkeleton />
          </>
        ) : (
          <>
            <Label size="lg">{t("inputs.startDate.label")}</Label>
            <Input
              type="date"
              placeholder="YYYY-MM-DD"
              isError={!!errors.startDate}
              icon={<Calendar />}
              {...register("startDate")}
              // min={getTodayDateISO()}
            />
            {errors.startDate && (
              <InputErrorMessage>
                {t(`inputs.startDate.validation.${errors.startDate.type}`)}
              </InputErrorMessage>
            )}
          </>
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
            {t(
              `inputs.numberOfDays.inputValidation.${errors.numberOfDays?.type}`
            )}
          </InputErrorMessage>
        )}
      </Field>

      {/* Description */}
      <Field className="space-y-2">
        {isLoading ? (
          <>
            <LabelSkeleton />
            <TextareaSkeleton />
          </>
        ) : (
          <>
            <Label size="lg">{t("inputs.description.label")}</Label>
            <Textarea
              placeholder={t("inputs.description.placeholder")}
              isError={!!errors.description}
              {...register("description")}
            />
            {errors.description && (
              <InputErrorMessage>
                {t(`inputs.description.validation.${errors.description.type}`)}
              </InputErrorMessage>
            )}
          </>
        )}
      </Field>
    </>
  );
};

export default Inputs;
