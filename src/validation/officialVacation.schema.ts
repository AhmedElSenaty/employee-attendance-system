import * as yup from "yup";

export const officialVacationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required"),
  startDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD")
    .required("Start Date is required"),
  endDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD")
    .required("End Date is required"),
});
