import * as yup from "yup";

export const sickRequestSchema = yup.object().shape({
  StartDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD")
    .required("Start Date is required"),

  NumberOfDays: yup
    .number()
    .required("Number of days is required")
    .min(1, "Number of days must be at least 1"),

  Description: yup
    .string()
    .max(500, "Description can't exceed 500 characters")
    .required("Description is required"),

  PermitApproval: yup
    .string()
    .max(500, "Permit approval can't exceed 500 characters")
    .required("Permit approval is required"),

    MedicalReport: yup
    .mixed<File>()
    .required("Medical report file is required"),
});

export const assignSickRequestSchema = sickRequestSchema.shape({
  EmployeeId: yup
    .number()
    .required("Employee is required")
});
