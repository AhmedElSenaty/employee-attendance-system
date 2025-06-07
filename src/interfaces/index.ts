//! Done
export * from "./adminInterfaces"
export * from "./paginationInterface"
export * from "./metaDataInterface"
export * from "./filtersInterfaces"
export * from "./managerInterfaces";
export * from "./profileInterfaces"
export * from "./employeeInterfaces"
export * from "./loginInterfaces";
export * from "./authInterfaces";
export * from "./resetAccountInterfaces";
export * from "./permissionInterfaces"
export * from "./officialVacation.Interfaces";
export * from "./entityInterfaces";
export * from "./deviceInterfaces";
export * from "./departmentInterfaces";
export * from "./subDepartmentInterfaces";
export * from "./attendanceInterfaces";
export * from "./exportFileInterfaces"
export * from "./meInterfaces"


export interface IErrorResponse {
  errors?: string[]; // The API might return an array of error messages
  message: string; // Optional
}
