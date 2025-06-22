import * as yup from "yup";

export const subDepartmentSchema = yup.object().shape({
  id: yup
    .number()
    .typeError("Sub-Department ID must be a number")
    .required("Sub-Department ID is required")
    .positive("Sub-Department ID must be a positive number")
    .max(9999, "Sub-Department ID cannot exceed 9999")
    .min(1, "Sub-Department ID must be at least 1")
    .integer("Sub-Department ID must be an integer"),
  
  name: yup
    .string()
    .required("Sub-Department Name is required")
    .min(3, "Sub-Department Name must be at least 3 characters")
    .max(100, "Sub-Department Name cannot exceed 50 characters"),
  
  description: yup
    .string()
    .trim()
    .nullable()
    .transform((_, originalValue) => originalValue === null ? "" : originalValue)
    .max(500, "Description cannot exceed 500 characters"),

  departmentID: yup
    .number()
    .typeError("Please select a department")
    .required("Please select a department")
    .positive("Please select a valid department")
    .integer("Please select a valid department"),
  
  entityId: yup
    .number()
    .typeError("Please select an entity")
    .required("Please select an entity")
    .positive("Please select a valid entity")
    .integer("Please select a valid entity"),
});

export type SubDepartmentFormValues = yup.InferType<typeof subDepartmentSchema>;