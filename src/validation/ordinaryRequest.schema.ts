import * as yup from "yup";

export const ordinaryRequestSchema = yup.object().shape({
  startDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD")
    .required("Start Date is required"),
  endDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD")
    .required("End Date is required"),

    description: yup
    .string()
    .max(500, "Description can't exceed 500 characters")
    .required("Description is required"),
});
