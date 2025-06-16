import * as yup from "yup";
import { MissionRequestType } from "../enums";

export const missionRequestSchema = yup.object({
  type: yup
    .mixed<MissionRequestType>()
    .transform((value) => (value !== "" ? Number(value) : undefined))
    .oneOf(
      [MissionRequestType.FullDay, MissionRequestType.HalfDay],
      "Invalid mission request type"
    )
    .required("Mission request type is required"),

  date: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in the format YYYY-MM-DD")
    .required("Date is required"),

  description: yup
    .string()
    .max(500, "Description can't exceed 500 characters")
    .required("Description is required"),
});

export const assignMissionRequestSchema = yup.object({
  employeeId: yup
    .number()
    .typeError("Employee ID must be a valid number")
    .integer("Employee ID must be a whole number")
    .positive("Employee ID must be greater than 0")
    .required("Employee ID is required"),
  startTime: yup
    .string()
    .required("start Time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "Invalid time format. Use HH:mm or HH:mm:ss"),
  endTime: yup
    .string()
    .required("end Time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "Invalid time format. Use HH:mm or HH:mm:ss"),
  date: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in the format YYYY-MM-DD")
    .required("Date is required"),

  description: yup
    .string()
    .max(500, "Description can't exceed 500 characters")
    .required("Description is required"),
});
