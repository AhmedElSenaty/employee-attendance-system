import * as yup from "yup";
import { LeaveRequestTimeType } from "../enums";

export const leaveRequestSchema = yup.object({
  type: yup
  .mixed<LeaveRequestTimeType>()
  .transform((value) => (value !== "" ? Number(value) : undefined))
  .oneOf([LeaveRequestTimeType.Morning, LeaveRequestTimeType.Evening], "Invalid leave request type")
  .required("Leave request type is required"),

  date: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in the format YYYY-MM-DD")
    .required("Date is required"),

  description: yup
    .string()
    .max(500, "Description can't exceed 500 characters")
    .required("Description is required"),
});
