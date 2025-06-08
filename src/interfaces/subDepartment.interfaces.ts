import { IMetadata } from "./metadata.interface";

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


export interface UseGetAllSubDepartmentsReturn {
  subDepartments: ISubDepartmentData[];
  metadata: IMetadata;
  totalSubDepartments: number
  isSubDepartmentsDataLoading: boolean;
}

export interface UseGetSubDepartmentnByIDReturn {
  subDepartment: ISubDepartmentData;
  isSubDepartmentDataLoading: boolean;
}

export interface UseGetSubDepartmentsListReturn {
  subDepartmentsList: ISubDepartment[]; // Replace with actual type if different
  isSubDepartmentsLoading: boolean;
}
