import * as yup from "yup";

export const getEmployeeSchema = (isUpdate: boolean) =>
  yup.object().shape({
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username cannot exceed 50 characters")
      .matches(/^\S*$/, {
        message: "Username must not contain spaces",
        excludeEmptyString: true,
      })
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
      .nullable()
      .transform((value, originalValue) => (originalValue === "" ? null : value)),

    hiringDate: yup
      .string()
      .required("Hiring date is required"),

    delegateId: 
      yup.string(),

    avilableLeaveRequestsPerMonth: yup
      .string()
      .required("Available leave requests per month is required"),

    avilableOrdinaryLeaveeRequestsPerYear: yup
      .string()
      .required("Available ordinary leave requests per year is required"),

    avilableCasualLeaveeRequestsPerYear: yup
      .string()
      .required("Available casual leave requests per year is required"),

          // ✅ Conditionally required on update
    totalOrdinaryLeaves: yup
      .string()
      .when([], {
        is: () => isUpdate,
        then: (schema) => schema.required("Total ordinary leaves is required"),
        otherwise: (schema) => schema.strip(),
      }),

    totalCasualLeaves: yup
      .string()
      .when([], {
        is: () => isUpdate,
        then: (schema) => schema.required("Total casual leaves is required"),
        otherwise: (schema) => schema.strip(),
      }),

    totalLeaveRequests: yup
      .string()
      .when([], {
        is: () => isUpdate,
        then: (schema) => schema.required("Total leave requests is required"),
        otherwise: (schema) => schema.strip(),
      }),
  });

export type EmployeeFormValues = yup.InferType<ReturnType<typeof getEmployeeSchema>>;
