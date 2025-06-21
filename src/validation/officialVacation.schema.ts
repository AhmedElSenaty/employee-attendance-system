import * as yup from "yup";

export const officialVacationSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "name must be at least 3 characters")
    .max(100, "name must not exceed 100 characters")
    .required("Name is required"),
  startDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format. Use YYYY-MM-DD")
    .required("Start Date is required"),
  endDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format. Use YYYY-MM-DD")
    .required("End Date is required"),
});

export type OfficialVacationFormValues = yup.InferType<typeof officialVacationSchema>;