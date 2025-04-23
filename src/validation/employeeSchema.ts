import * as yup from "yup";

export const getEmployeeSchema = (isUpdate: boolean) =>
  yup.object().shape({
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username cannot exceed 50 characters")
      .matches(/^\S*$/, { message: "Username must not contain spaces", excludeEmptyString: true })
      .when([], {
        is: () => isUpdate,
        then: (schema) => schema.required("Username is required"),
        otherwise: (schema) => schema.strip(),
      }),

    email: yup
      .string()
      .email("Email must be a valid email address")
      .when([], {
        is: () => isUpdate,
        then: (schema) => schema.required("Email is required"),
        otherwise: (schema) => schema.strip(),
      }),

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

    subDepartmentId: yup
      .string()
      .required("Sub-department is required"),

    hiringDate: yup
      .string()
      .required("Hiring date is required"),

    oldId: yup
      .string()
      .required("Old ID is required"),
  });
