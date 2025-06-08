import { IMetadata } from "./metadata.interface";

export interface IEmployee {
  id: number;
  name: string;
}

export interface IEmployeeCredentials {
  id?: string
  username?: string,
  email?: string,
  fullName: string,
  ssn: string,
  phoneNumber: string,
  subDepartmentId: string,
  hiringDate: string,
  oldId: string,
  delegateId?: string
}

export interface IEmployeeData {
  id: string,
  ssn: string,
  fullName: string,
  email: string,
  phoneNumber: string | null,
  departmentName: string,
  subDepartmentName: string,
  isActive: boolean
  isBlocked: boolean,
  createdAt: string,
  profileImage?: string
  username?: string
  dateOfBirth?: string
  delegateId?: string
  delegeteDepartmentId?: string
  departmentId?: string
  subDepartmentId?: string
  hiringDate?: string
  oldId?: string
  delegeteName?: string
  delegeteSubDepartmentName?: string
  isExcludedFromReports: boolean
}

export interface UseGetAllEmployeesReturn {
  employees: IEmployeeData[];
  metadata: IMetadata;
  isEmployeesDataLoading: boolean;
}

export interface UseGetEmployeesCountReturn {
  totalCount: number;
  lockedCount: number;
  blockedCount: number;
  deactivatedCount: number;
  activatedCount: number;
  isEmployeesCountLoading: boolean;
}

export interface UseGetEmployeesListReturn {
  employeesList: IEmployee[],
  isEmployeesListLoading: boolean
}

export interface UseGetEmployeeByIDReturn {
  employee: IEmployeeData | null; // admin might be null if no data is available yet
  isEmployeeDataLoading: boolean; // A flag to indicate loading state
}