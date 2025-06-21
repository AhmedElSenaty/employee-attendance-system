import * as yup from "yup";

export const entitySchema = yup.object().shape({
  name: yup
    .string()
    .required("Entity name is required")
    .min(3, "Entity name must be at least 3 characters")
    .max(100, "Entity name cannot exceed 100 characters"),
  
  description: yup
    .string()
    .trim()
    .nullable()
    .transform((_, originalValue) => originalValue === null ? "" : originalValue)
    .max(500, "Description cannot exceed 500 characters"),
});

export type EntityFormValues = yup.InferType<typeof entitySchema>;