import * as yup from "yup";

export const deviceSchema = yup.object({
  device_name: yup
    .string()
    .trim()
    .min(3, "Device name must be at least 3 characters")
    .max(100, "Device name must be at most 100 characters")
    .required("Device name is required"),

  iP_Address: yup
    .string()
    .trim()
    .matches(
      /^(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?[0-9])$/,
      "Invalid IP address format"
    )
    .required("IP address is required"),

  port: yup
    .number()
    .typeError("Port must be a number")
    .integer("Port must be an integer")
    .min(1, "Port must be between 1 and 65535")
    .max(65535, "Port must be between 1 and 65535")
    .required("Port is required"),
});

export type DeviceFormValues = yup.InferType<typeof deviceSchema>;