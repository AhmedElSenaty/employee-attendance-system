import * as yup from "yup";

export const AttendanceSchema = yup.object().shape({
  deviceId: yup
    .number()
    .typeError("Device ID must be a valid number")
    .integer("Device ID must be a whole number")
    .positive("Device ID must be greater than 0")
    .required("Device ID is required"),

  employeeId: yup
    .number()
    .typeError("Employee ID must be a valid number")
    .integer("Employee ID must be a whole number")
    .positive("Employee ID must be greater than 0")
    .required("Employee ID is required"),

  attendanceDate: yup
    .string()
    .required("Attendance Date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"),

  attendanceTime: yup
    .string()
    .required("Attendance Time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "Invalid time format. Use HH:mm or HH:mm:ss"),

  status: yup
    .string()
    .required("Status is required")
    .oneOf(["حضور", "انصراف"], "Invalid status selection"),
});
