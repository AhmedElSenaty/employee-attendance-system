import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import {
  Field,
  Input,
  InputErrorMessage,
  Label,
  SelectBoxSkeleton,
  InputSkeleton,
  LabelSkeleton,
  CustomSelect
} from "../../../../components/ui";
import { DeviceSummary, EmployeeSummary } from "../../../../interfaces";
import { Calendar, Timer } from "lucide-react";
import { useGetEmployeesList, useGetDevicesList } from "../../../../hooks/";
import { useTranslation } from "react-i18next";
import { ATTENDANCE_NS } from "../../../../constants";
import { AttendanceFormValues } from "../../../../validation";

interface Props {
  register: UseFormRegister<AttendanceFormValues>;
  errors: FieldErrors<AttendanceFormValues>;
  isLoading?: boolean;
  control: Control<AttendanceFormValues>
}

const Inputs = ({
  register,
  errors,
  isLoading = false,
  control
}: Props) => {
  const { t } = useTranslation([ATTENDANCE_NS]);

  const { devices: devicesList, isLoading: devicesListIsLoading } = useGetDevicesList();
  const { employeesList, isEmployeesListLoading } = useGetEmployeesList();

  const deviceOptions = devicesList?.map((device: DeviceSummary) => ({
    value: device.id,
    label: device.name,
  })) || [];

  const employeeOptions = employeesList?.map((employee: EmployeeSummary) => ({
    value: employee.id,
    label: employee.name,
  })) || [];

  const statusOptions = ["حضور", "انصراف"].map((state) => ({
    value: state,
    label: state,
  }));


  if (isLoading) {
    return (
      <>
        {[...Array(5)].map((_, i) => (
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
      {/* Device ID */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.deviceId.label")}</Label>
        {devicesListIsLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <Controller
            name="deviceId"
            control={control}
            render={({ field }) => (
              <CustomSelect
                className="w-full"
                options={deviceOptions}
                value={deviceOptions.find((opt: {value: number, label: string}) => opt.value === field.value) || null}
                onChange={(option) => field.onChange(option?.value)}
                error={!!errors.deviceId}
              />
            )}
          />
        )}
        {errors.deviceId && (
          <InputErrorMessage>
            {t(`inputs.deviceId.inputValidation.${errors.deviceId?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Employee ID */}
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
                value={employeeOptions.find((opt: {value: number, label: string}) => opt.value === field.value) || null}
                onChange={(option) => field.onChange(option?.value)}
                error={!!errors.employeeId}
              />
            )}
          />
        )}
        {errors.employeeId && (
          <InputErrorMessage>
            {t(`inputs.employeeId.inputValidation.${errors.employeeId?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Attendance Date */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.attendanceDate.label")}</Label>
        <Input
          type="date"
          placeholder={t("inputs.attendanceDate.placeholder")}
          isError={!!errors.attendanceDate}
          icon={<Calendar />}
          {...register("attendanceDate")}
        />
        {errors.attendanceDate && (
          <InputErrorMessage>
            {t(`inputs.attendanceDate.inputValidation.${errors.attendanceDate?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Attendance Time */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.attendanceTime.label")}</Label>
        <Input
          type="time"
          placeholder={t("inputs.attendanceTime.placeholder")}
          isError={!!errors.attendanceTime}
          icon={<Timer />}
          {...register("attendanceTime")}
        />
        {errors.attendanceTime && (
          <InputErrorMessage>
            {t(`inputs.attendanceTime.inputValidation.${errors.attendanceTime?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Status */}
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.status.label")}</Label>
        <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <CustomSelect
                className="w-full"
                options={statusOptions}
                value={statusOptions.find((opt) => opt.value === field.value) || null}
                onChange={(option) => field.onChange(option?.value)}
                error={!!errors.status}
              />
            )}
          />
        {errors.status && (
          <InputErrorMessage>
            {t(`inputs.status.inputValidation.${errors.status?.type}`)}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default Inputs;
