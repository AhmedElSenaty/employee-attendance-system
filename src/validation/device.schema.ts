import * as yup from "yup";

export const deviceSchema = yup.object().shape({
  device_name: yup
    .string()
    .required("Device name is required"),
  iP_Address: yup
    .string()
    .matches(
      /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/,
      { message: "matches", type: "matches" }
    )
    .required("IP Address is required"),
  port: yup
    .number()
    .min(1, "Port must be between 1 and 65535")
    .max(65535, "Port must be between 1 and 65535")
    .required("Port is required"),
});
