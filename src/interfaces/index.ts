//! Done
export * from "./adminInterfaces"
export * from "./paginationInterface"
export * from "./metaDataInterface"
export * from "./filtersInterfaces"
export * from "./managerInterfaces";
export * from "./profile.interface"
export * from "./employeeInterfaces"
export * from "./loginInterfaces";
export * from "./authInterfaces";
export * from "./resetAccountInterfaces";
export * from "./permission.interfaces"
export * from "./officialVacation.Interfaces";
export * from "./entity.interfaces";
export * from "./device.interfaces";
export * from "./department.interfaces";
export * from "./subDepartment.interfaces";
export * from "./attendance.interfaces";
export * from "./exportFileInterfaces"
export * from "./meInterfaces"


export interface IErrorResponse {
  errors?: string[]; // The API might return an array of error messages
  message: string; // Optional
}
