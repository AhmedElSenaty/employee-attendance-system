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