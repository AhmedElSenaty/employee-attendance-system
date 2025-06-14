export interface ISubDepartment {
  id: number;
  name: string;
}

export interface ISubDepartmentCredentials {
  id: number;
  name: string;
  description?: string;
  departmentID: number;
  entityId: number;
}

export interface ISubDepartmentData {
  subDepartmentId: number,
  name: string,
  description: string,
  departmentId: number,
  departmentName:string,
  entityId: number,
  entityName: string
}