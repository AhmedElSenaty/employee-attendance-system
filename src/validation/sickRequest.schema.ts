import * as yup from "yup";

export const sickRequestSchema = yup.object().shape({
  StartDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD")
    .required("Start Date is required"),

  NumberOfDays: yup
    .number()
    .required("Number of days is required")
    .min(1, "Number of days must be at least 1"),

  Description: yup
    .string()
    .max(500, "Description can't exceed 500 characters")
    .required("Description is required"),

  PermitApproval: yup
    .string()
    .max(500, "Permit approval can't exceed 500 characters")
    .required("Permit approval is required"),

  MedicalReport: yup
  .mixed()
  .required("Medical report file is required")
  .test("fileType", "Only PDF or image files are allowed", (value) => {
    if (!value) return false;

    // value can be FileList or array of files
    const file = value instanceof FileList ? value[0] : Array.isArray(value) ? value[0] : value;

    if (!file) return false;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    return allowedTypes.includes(file.type);
  }),
});

export const assignSickRequestSchema = sickRequestSchema.shape({
  EmployeeId: yup
    .number()
    .required("Employee is required")
});

export const sickRequestUpdateTextSchema = yup.object().shape({
  startDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD")
    .required("Start Date is required"),

  numberOfDays: yup
    .number()
    .required("Number of days is required")
    .min(1, "Number of days must be at least 1"),

  description: yup
    .string()
    .max(500, "Description can't exceed 500 characters")
    .required("Description is required"),

  permitApproval: yup
    .string()
    .max(500, "Permit approval can't exceed 500 characters")
    .required("Permit approval is required"),
});

export const sickRequestUpdateReportSchema = yup.object().shape({
  MedicalReport: yup
  .mixed()
  .required("Medical report file is required")
  .test("fileType", "Only PDF or image files are allowed", (value) => {
    if (!value) return false;

    // value can be FileList or array of files
    const file = value instanceof FileList ? value[0] : Array.isArray(value) ? value[0] : value;

    if (!file) return false;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    return allowedTypes.includes(file.type);
  }),
});
