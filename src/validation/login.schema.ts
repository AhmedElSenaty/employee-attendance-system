import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required"),
  rememberMe: yup.boolean().default(false),
});
export const ResetPassword = yup.object().shape({
  newPassword: yup
    .string()
    .required("Password is required"),
  confirmPass: yup
    .string()
    .required("Confirm Password is required"),
  mail: yup.string().default(""),
  token:yup.string().default("")
});