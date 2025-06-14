import * as yup from "yup";

export const updateAdminSchema = () =>
  yup.object().shape({
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username cannot exceed 50 characters")
      .matches(/^\S*$/, { message: "matches", type: "matches" })
      .required("Username is required"),

    email: yup
      .string()
      .email("Email must be a valid email address")
      .required("Email is required"),
  });
export const updateEmployeeSchema = () =>
  yup.object().shape({
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username cannot exceed 50 characters")
      .matches(/^\S*$/, { message: "Username must not contain spaces", excludeEmptyString: true })
      .required("Username is required"),

    email: yup
      .string()
      .email("Email must be a valid email address")
      .required("Email is required"),

    fullName: yup
      .string()
      .required("Full name is required")
      .min(3, "Full name must be at least 3 characters")
      .max(100, "Full name cannot exceed 100 characters"),

    ssn: yup
      .string()
      .matches(/^\d{14}$/, "SSN must be exactly 14 digits")
      .required("SSN is required"),

    phoneNumber: yup
      .string()
      .matches(/^01[0-2,5]{1}[0-9]{8}$/, "Invalid Egyptian phone number")
      .required("Phone number is required"),
  });
