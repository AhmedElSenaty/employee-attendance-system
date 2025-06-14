import * as yup from "yup";

export const resetAccountSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  oldPassword: yup
    .string()
    .required("Old password is required"),
  password: yup
    .string()
    .min(8, "min")
    .matches(/[A-Z]/, { message: "uppercase", type: "uppercase" })
    .matches(/[a-z]/, { message: "lowercase", type: "lowercase" })
    .matches(/[0-9]/, { message: "number", type: "number" })
    .matches(/[!@#$%^&]/, { message: "specialChar", type: "specialChar" })
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});
