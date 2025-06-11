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
