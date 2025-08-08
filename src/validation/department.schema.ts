import * as yup from "yup";

export const departmentSchema = yup.object().shape({
  id: yup
    .number()
    .typeError("Department ID must be a number")
    .required("Department ID is required")
    .positive("Department ID must be a positive number")
    .min(1, "Department ID must be at least 1")
    .integer("Department ID must be an integer"),
  name: yup
    .string()
    .required("Department Name is required")
    .min(3, "Department Name must be at least 3 characters")
    .max(100, "Department Name cannot exceed 100 characters"),

  description: yup
    .string()
    .trim()
    .nullable()
    .transform((_, originalValue) =>
      originalValue === null ? "" : originalValue
    )
    .max(500, "Description cannot exceed 500 characters"),

  activationDate: yup.string().nullable(),
});

export type DepartmentFormValues = yup.InferType<typeof departmentSchema>;
