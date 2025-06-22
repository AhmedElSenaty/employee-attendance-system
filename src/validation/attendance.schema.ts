import * as yup from "yup";

export const attendanceSchema = yup.object().shape({
  deviceId: yup
    .number()
    .typeError("Please select a device")
    .required("Please select a device")
    .positive("Please select a valid device")
    .integer("Please select a valid device"),

  employeeId: yup
    .number()
    .typeError("Please select a employee")
    .required("Please select a employee")
    .positive("Please select a valid employee")
    .integer("Please select a valid employee"),

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

export type AttendanceFormValues = yup.InferType<typeof attendanceSchema>;