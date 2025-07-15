export interface EmployeeSummary {
  id: number;
  name: string;
}

export interface EmployeeMyVactions {
  availableCasualLeaves: number
  availableLeaveRequests: number
  availableOrdinaryLeaves: number
  totalCasualLeaves: number
  totalLeaveRequests: number
  totalMissions: number
  totalOrdinaryLeaves: number
  totalSickLeave: number
}

export interface EmployeeCredentials {
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
  avilableLeaveRequestsPerMonth?: string,
  avilableOrdinaryLeaveeRequestsPerYear?: string,
  avilableCasualLeaveeRequestsPerYear?: string,
}

export interface EmployeeData {
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

export interface EmployeeLeaveStats {
  employeeId: number;
  employeeName: string;
  departmentName: string;
  totalOrdinaryLeaves: number;
  availableOrdinaryLeaves: number;
  totalCasualLeaves: number;
  availableCasualLeaves: number;
  totalLeaveRequests: number;
  availableLeaveRequests: number;
  totalSickLeave: number;
  totalMissions: number;
}


export interface EmployeeWorkingHours {
  EmployeeId: string;
  AttendTime: string,
  GoTime: string,
  Description: string
  StartDate: string
  EndDate: string
  MedicalReport: Array<File>
}