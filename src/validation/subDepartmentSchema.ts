import * as yup from "yup";

export const SubDepartmentSchema = yup.object().shape({
  id: yup
    .number()
    .typeError("Sub-Department ID must be a number")
    .required("Sub-Department ID is required")
    .positive("Sub-Department ID must be a positive number")
    .integer("Sub-Department ID must be an integer"),
  
  name: yup
    .string()
    .required("Sub-Department Name is required")
    .min(3, "Sub-Department Name must be at least 3 characters")
    .max(50, "Sub-Department Name cannot exceed 50 characters"),
  
  description: yup
    .string()
    .max(255, "Description cannot exceed 255 characters"),
  departmentID: yup
    .number()
    .typeError("Department ID must be a number")
    .required("Department ID is required")
    .positive("Department ID must be a positive number")
    .integer("Department ID must be an integer"),
  
  entityId: yup
    .number()
    .typeError("Entity ID must be a number")
    .required("Entity ID is required")
    .positive("Entity ID must be a positive number")
    .integer("Entity ID must be an integer"),
});
