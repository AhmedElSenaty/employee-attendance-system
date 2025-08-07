import * as yup from "yup";

export const changeVacationCountSchema = yup.object().shape({
  totalCasual: yup
    .number()
    .nullable()
    .typeError("Total Casual must be a number"),

  availableCasual: yup
    .number()
    .nullable()
    .typeError("Available Casual must be a number"),

  totalOrdinary: yup
    .number()
    .nullable()
    .typeError("Total Ordinary must be a number"),

  availableOrdinary: yup
    .number()
    .nullable()
    .typeError("Available Ordinary must be a number"),

  totalLeaveRequest: yup
    .number()
    .nullable()
    .typeError("Total Leave Request must be a number"),

  availableLeaveRequest: yup
    .number()
    .nullable()
    .typeError("Available Leave Request must be a number"),

  managerName: yup
    .string()
    .required("Manager name is required")
    .max(100, "Manager name must be less than 100 characters"),

  emplyeeName: yup
    .string()
    .required("Employee name is required")
    .max(100, "Employee name must be less than 100 characters"),

  description: yup
    .string()
    .trim()
    .nullable()
    .transform((_, originalValue) =>
      originalValue === null ? "" : originalValue
    )
    .max(500, "Description cannot exceed 500 characters"),

  comment: yup
    .string()
    .trim()
    .nullable()
    .transform((_, originalValue) =>
      originalValue === null ? "" : originalValue
    )
    .max(500, "Comment cannot exceed 500 characters"),
});

export type ChangeVacationCountFormValues = yup.InferType<
  typeof changeVacationCountSchema
>;

export const AddchangeVacationCountSchema = yup.object().shape({
  employeeId: yup
    .number()
    .typeError("Employee is required")
    .required("Employee is required"),

  totalCasual: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("Total Casual must be a number"),

  availableCasual: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("Available Casual must be a number"),

  totalOrdinary: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("Total Ordinary must be a number"),

  availableOrdinary: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("Available Ordinary must be a number"),

  totalLeaveRequest: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("Total Leave Request must be a number"),

  availableLeaveRequest: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("Available Leave Request must be a number"),

  description: yup
    .string()
    .trim()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .max(500, "Description cannot exceed 500 characters"),

  comment: yup
    .string()
    .trim()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .max(500, "Comment cannot exceed 500 characters"),

  medicalReportImageUrl: yup.mixed().nullable(),
});

export type AddChangeVacationCountFormValues = yup.InferType<
  typeof AddchangeVacationCountSchema
>;
