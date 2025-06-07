import { FieldErrors, UseFormRegister } from "react-hook-form";
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
import { TFunction } from "i18next";
import { IAttendanceCredentials } from "../../../../interfaces";
import { Calendar, Timer } from "lucide-react";
import { useGetDevicesList } from "../../../../hooks/device.hooks";
import { useGetEmployeesList } from "../../../../hooks/useEmployeesHook";
import { ATTENDANCE_TRANSLATION_NAMESPACE } from "..";

interface IRenderAttendanceInputsProps {
  register: UseFormRegister<IAttendanceCredentials>;
  errors: FieldErrors<IAttendanceCredentials>;
  t: TFunction;
  isLoading?: boolean;
}

const RenderAttendanceInputs = ({
  register,
  errors,
  t,
  isLoading = false,
}: IRenderAttendanceInputsProps) => {
  const { devicesList, devicesListIsLoading } = useGetDevicesList();
  const { employeesList, isEmployeesListLoading } = useGetEmployeesList();

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
        <Label size="lg">{t("form.deviceId.label", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</Label>
        {devicesListIsLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <SelectBox isError={!!errors.deviceId} {...register("deviceId")}>
            <option value="">Select device</option>
            {devicesList?.map((device, idx) => (
              <option key={idx} value={device.id}>
                {device.name}
              </option>
            ))}
          </SelectBox>
        )}
        {errors.deviceId && (
          <InputErrorMessage>
            {t(`form.deviceId.inputValidation.${errors.deviceId?.type}`, { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Employee ID */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.employeeId.label", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</Label>
        {isEmployeesListLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <SelectBox isError={!!errors.employeeId} {...register("employeeId")}>
            <option value="">Select employee</option>
            {employeesList?.map((employee, idx) => (
              <option key={idx} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </SelectBox>
        )}
        {errors.employeeId && (
          <InputErrorMessage>
            {t(`form.employeeId.inputValidation.${errors.employeeId?.type}`, { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Attendance Date */}
      <Field className="space-y-2">
        <Input
          type="date"
          placeholder={t("form.attendanceDate.placeholder", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
          isError={!!errors.attendanceDate}
          icon={<Calendar />}
          {...register("attendanceDate")}
        />
        {errors.attendanceDate && (
          <InputErrorMessage>
            {t(`form.attendanceDate.inputValidation.${errors.attendanceDate?.type}`, { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Attendance Time */}
      <Field className="space-y-2">
        <Input
          type="time"
          placeholder={t("form.attendanceTime.placeholder", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
          isError={!!errors.attendanceTime}
          icon={<Timer />}
          {...register("attendanceTime")}
        />
        {errors.attendanceTime && (
          <InputErrorMessage>
            {t(`form.attendanceTime.inputValidation.${errors.attendanceTime?.type}`, { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>

      {/* Status */}
      <Field className="space-y-2">
        <Label size="lg">{t("form.status.label", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</Label>
        <SelectBox isError={!!errors.status} {...register("status")}>
          <option value="">Select Status</option>
          {["حضور", "انصراف"].map((status, idx) => (
            <option key={idx} value={status}>
              {status}
            </option>
          ))}
        </SelectBox>
        {errors.status && (
          <InputErrorMessage>
            {t(`form.status.inputValidation.${errors.status?.type}`, { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
          </InputErrorMessage>
        )}
      </Field>
    </>
  );
};

export default RenderAttendanceInputs;
