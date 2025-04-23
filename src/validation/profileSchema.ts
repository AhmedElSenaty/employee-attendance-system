import * as yup from "yup";

export const profileSchema = yup.object().shape({
  nameEn: yup
    .string()
    .max(50, "English name must not exceed 50 characters"),
  nameAr: yup
    .string()
    .required("Arabic name is required")
    .min(2, "Arabic name must be at least 2 characters")
    .max(50, "Arabic name must not exceed 50 characters"),
});
