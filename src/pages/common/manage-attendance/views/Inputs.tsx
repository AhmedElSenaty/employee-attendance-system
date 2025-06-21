import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import {
  Field,
  Input,
  InputErrorMessage,
  Label,
  SelectBox,
  SelectBoxSkeleton,
  InputSkeleton,
  LabelSkeleton
} from "../../../../components/ui";
import { DeviceSummary, IAttendanceCredentials } from "../../../../interfaces";
import { Calendar, Timer } from "lucide-react";
import { useGetEmployeesList, useGetDevicesList } from "../../../../hooks/";
import { useTranslation } from "react-i18next";
import { ATTENDANCE_NS } from "../../../../constants";
import Select from 'react-select'

interface IInputsProps {
  register: UseFormRegister<IAttendanceCredentials>;
  errors: FieldErrors<IAttendanceCredentials>;
  isLoading?: boolean;
  control: Control<IAttendanceCredentials>
}

const Inputs = ({
  register,
  errors,
  isLoading = false,
  control
}: IInputsProps) => {
  const { t } = useTranslation([ATTENDANCE_NS]);

  const { devices: devicesList, isLoading: devicesListIsLoading } = useGetDevicesList();
  const { employeesList, isEmployeesListLoading } = useGetEmployeesList();

  const deviceOptions = devicesList?.map((device: DeviceSummary) => ({
    value: device.id,
    label: device.name,
  })) || [];

  console.log(devicesList);

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
        <Label size="lg">{t("form.deviceId.label")}</Label>

        {devicesListIsLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <Controller
            name="deviceId"
            control={control}
            rules={{ required: true }} // or your custom validation
            render={({ field }) => (
              <Select
                {...field}
                options={deviceOptions}
                placeholder={t("form.deviceId.defaultValue")}
                classNamePrefix="react-select"
                value={deviceOptions.find((option: {value: number, label: string}) => option.value === field.value) || null}
                onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                isClearable
                isSearchable
              />
            )}
          />
        )}

        {errors.deviceId && (
          <InputErrorMessage>
            {t(`form.deviceId.inputValidation.${errors.deviceId?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Employee ID */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.employeeId.label")}</Label>
        {isEmployeesListLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <SelectBox isError={!!errors.employeeId} {...register("employeeId")}>
            <option value="">{t("form.employeeId.defaultValue")}</option>
            {employeesList?.map((employee, idx) => (
              <option key={idx} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </SelectBox>
        )}
        {errors.employeeId && (
          <InputErrorMessage>
            {t(`form.employeeId.inputValidation.${errors.employeeId?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Attendance Date */}
      <Field className="space-y-2">
        <Input
          type="date"
          placeholder={t("form.attendanceDate.placeholder")}
          isError={!!errors.attendanceDate}
          icon={<Calendar />}
          {...register("attendanceDate")}
        />
        {errors.attendanceDate && (
          <InputErrorMessage>
            {t(`form.attendanceDate.inputValidation.${errors.attendanceDate?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Attendance Time */}
      <Field className="space-y-2">
        <Input
          type="time"
          placeholder={t("form.attendanceTime.placeholder")}
          isError={!!errors.attendanceTime}
          icon={<Timer />}
          {...register("attendanceTime")}
        />
        {errors.attendanceTime && (
          <InputErrorMessage>
            {t(`form.attendanceTime.inputValidation.${errors.attendanceTime?.type}`)}
          </InputErrorMessage>
        )}
      </Field>

      {/* Status */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.status.label")}</Label>
        <SelectBox isError={!!errors.status} {...register("status")}>
          <option value="">{t("form.status.defaultValue")}</option>
          {["حضور", "انصراف"].map((status, idx) => (
            <option key={idx} value={status}>
              {status}
            </option>
          ))}
        </SelectBox>
        {errors.status && (
          <InputErrorMessage>
            {t(`form.status.inputValidation.${errors.status?.type}`)}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default Inputs;
