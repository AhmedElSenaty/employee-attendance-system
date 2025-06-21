import * as yup from "yup";

export const profileSchema = yup.object().shape({
  nameEn: yup
    .string()
    .max(100, "English name must not exceed 100 characters"),
  nameAr: yup
    .string()
    .required("Arabic name is required")
    .min(3, "Arabic name must be at least 3 characters")
    .max(100, "Arabic name must not exceed 100 characters"),
});

export type ProfileFormValues = yup.InferType<typeof profileSchema>;