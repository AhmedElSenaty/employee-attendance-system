export * from "./admin.interfaces"
export * from "./attendance.interfaces";
export * from "./auth.interfaces";
export * from "./employee.interfaces"
export * from "./filtersInterfaces"
export * from "./login.interfaces";
export * from "./manager.interfaces";
export * from "./me.interfaces"
export * from "./metadata.interface"
export * from "./pagination.interface"
export * from "./report.interfaces"
export * from "./resetAccount.interfaces";
export * from "./subDepartment.interfaces";
export * from "./workingDays.interfaces";
export * from "./leaveRequest.interfaces"
export * from "./mission.interfaces"
export * from "./ordinaryRequest.interfaces"
export * from "./casualLeaveRequest.interfaces";
export * from "./sickRequests.interfaces";

export * from "./device.interfaces";
export * from "./systemData.interfaces";
export * from "./logs.interfaces";
export * from "./profile.interface"
export * from "./permission.interfaces"
export * from "./officialVacation.interfaces";
export * from "./entity.interfaces";
export * from "./department.interfaces";

export interface IErrorResponse {
  errors?: string[]; // The API might return an array of error messages
  message: string; // Optional
}
