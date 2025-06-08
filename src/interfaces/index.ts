//! Done
export * from "./adminInterfaces"
export * from "./pagination.interface"
export * from "./metadata.interface"
export * from "./filtersInterfaces"
export * from "./managerInterfaces";
export * from "./profile.interface"
export * from "./employeeInterfaces"
export * from "./login.interfaces";
export * from "./authInterfaces";
export * from "./resetAccount.interfaces";
export * from "./permission.interfaces"
export * from "./officialVacation.Interfaces";
export * from "./entity.interfaces";
export * from "./device.interfaces";
export * from "./department.interfaces";
export * from "./subDepartment.interfaces";
export * from "./attendance.interfaces";
export * from "./report.interfaces"
export * from "./meInterfaces"


export interface IErrorResponse {
  errors?: string[]; // The API might return an array of error messages
  message: string; // Optional
}
