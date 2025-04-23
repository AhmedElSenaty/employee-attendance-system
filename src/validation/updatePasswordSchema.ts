import * as yup from "yup";

export const passwordUpdateSchema = (oldPasswordIsRequired: boolean) => yup.object({
  oldPassword: yup
    .string()
    .when([], {
      is: () => oldPasswordIsRequired,  // Make it required if oldPasswordIsRequired is true
      then: (schema) => schema.required("Old Password is required"),
      otherwise: (schema) => schema.strip(),
    }),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
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
