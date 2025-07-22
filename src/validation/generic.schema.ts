import * as yup from "yup";


export const assignGenericRequestSchema = yup.object({
  employeeId: yup
    .number()
    .typeError("Employee ID must be a valid number")
    .integer("Employee ID must be a whole number")
    .positive("Employee ID must be greater than 0")
    .required("Employee ID is required"),
  startDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in the format YYYY-MM-DD")
    .required("Date is required"),
  endDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in the format YYYY-MM-DD")
    .required("Date is required"),

  description: yup
    .string()
    .max(500, "Description can't exceed 500 characters")
    .required("Description is required"),
});

export type AssignGenericFormValues = yup.InferType<typeof assignGenericRequestSchema>;