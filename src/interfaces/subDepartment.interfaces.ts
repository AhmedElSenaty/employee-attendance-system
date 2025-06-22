export interface SubDepartmentSummary {
  id: number;
  name: string;
}

export interface SubDepartmentCredentials {
  id?: number;
  name: string;
  description?: string;
  departmentID: number;
  entityId: number;
}

export interface SubDepartment {
  subDepartmentId: number,
  name: string,
  description: string,
  departmentId: number,
  departmentName:string,
  entityId: number,
  entityName: string
}
