import * as yup from "yup";

export const assignRequestSchema = yup.object().shape({
  employeeId: yup
    .number()
    .typeError("Employee ID must be a number")
    .required("Employee ID is required")
    .positive("Employee ID must be a positive number")
    .integer("Employee ID must be an integer"),

  startDate: yup
    .string()
    .required("Start Date is required")
    .test("is-date", "Start Date must be a valid ISO date", (value) =>
      !value || !isNaN(Date.parse(value))
    ),

  endDate: yup
    .string()
    .required("End Date is required")
    .test("is-date", "End Date must be a valid ISO date", (value) =>
      !value || !isNaN(Date.parse(value))
    ),

  leaveType: yup
    .number()
    .typeError("Leave Type must be a number")
    .required("Leave Type is required")
    .integer("Leave Type must be an integer"),

  description: yup
    .string()
    .required("Description is required")
    .trim()
    .min(3, "Description must be at least 3 characters")
    .max(500, "Description cannot exceed 500 characters"),
});

export type AssignRequestFormValues = yup.InferType<typeof assignRequestSchema>;

export interface EditRequestFormValues {
  requestId: number;
  leaveType: number;
  startDate: string;
  endDate: string;
  comment: string;
}

export const editRequestSchema = yup.object({
  requestId: yup.number().required(),
  leaveType: yup.number().required(),
  startDate: yup.string().required(),
  endDate: yup.string().required(),
  comment: yup.string().required(),
});