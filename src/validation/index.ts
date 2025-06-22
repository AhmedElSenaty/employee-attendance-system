import * as yup from "yup";

export * from "./admin.schema"
export * from "./device.schema"
export * from "./employee.schema"
export * from "./login.schema"
export * from "./manager.schema"
export * from "./officialVacation.schema"
export * from "./profile.schema"
export * from "./resetAccount.schema"
export * from "./systemData.schema"
export * from "./updateAccount.schema"
export * from "./updatePassword.schema"

export * from "./leaveRequest.schema"
export * from "./ordinaryRequest.schema"
export * from "./missionRequest.schema"
export * from "./casualLeaveRequest.schema copy"
export * from "./sickRequest.schema"
export * from "./entity.schema"
export * from "./department.schema"
export * from "./subDepartment.schema"
export * from "./attendance.schema"

export const uploadProfileImageSchema = yup.object().shape({
  profileImage: yup
  .mixed()
  .required("Profile image file is required")
  .test("fileType", "Only image files are allowed", (value) => {
    if (!value) return false;

    // value can be FileList or array of files
    const file = value instanceof FileList ? value[0] : Array.isArray(value) ? value[0] : value;

    if (!file) return false;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    return allowedTypes.includes(file.type);
  }),
});
