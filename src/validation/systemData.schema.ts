import * as yup from "yup";

export const SystemDataSchema = yup.object().shape({
  max_time_To_attend: yup
    .string()
    .required("Maximum attendance time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format. Use HH:mm"),

  min_time_To_Go: yup
    .string()
    .required("Minimum departure time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format. Use HH:mm"),

  annualVacationMax10Years: yup
    .number()
    .integer("Annual vacation (≤10 years) must be a integar number")
    .typeError("Annual vacation (≤10 years) must be a number")
    .min(0, "Value must be 0 or greater")
    .required("Annual vacation for ≤10 years is required"),

  annualVacationTillAgeIs50Years: yup
    .number()
    .integer("Annual vacation (≤50 years) must be a integar number")
    .typeError("Annual vacation (≤50 years) must be a number")
    .min(0, "Value must be 0 or greater")
    .required("Annual vacation for ≤50 years is required"),

  annualVacationAfterAgeIs50Years: yup
    .number()
    .integer("Annual vacation (>50 years) must be a integar number")
    .typeError("Annual vacation (>50 years) must be a number")
    .min(0, "Value must be 0 or greater")
    .required("Annual vacation for >50 years is required"),

  maxNumberOfLeavesRequestPerMonth: yup
    .number()
    .integer("Max leave requests/month must be a integar number")
    .typeError("Max leave requests/month must be a number")
    .min(0, "Value must be 0 or greater")
    .required("Max number of leave requests per month is required"),

  maxDaysInCasulVaccationPerYear: yup
    .number()
    .integer("Max casual leave days/year must be a integar number")
    .typeError("Max casual leave days/year must be a number")
    .min(0, "Value must be 0 or greater")
    .required("Max casual leave days per year is required"),
});

export type SystemDataFormValues = yup.InferType<typeof SystemDataSchema>;