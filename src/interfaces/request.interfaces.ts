import { LeaveType } from "../enums/requestTypes.enum";

export interface IRequest {
  id: number;
  employeeName: number;
  startDate: string;        // ISO datetime string
  endDate: string;          // ISO datetime string
  leaveType: LeaveType;        // Ideally use an enum like LeaveType
  departmentName: number;
  description: string;
  requestStatus: number;    // Ideally use an enum like RequestStatus
  requestedDate: string;    // ISO datetime string
}

export interface IRejectRequestCredentials {
  comment: string;
}

export interface ISoftDeleteRequestCredentials {
  requestId: number;
  comment: string;
}

export interface IAssignRequest {
  employeeId: number;
  startDate: string;   // ISO date string (e.g., "2025-07-09T13:36:21.933Z")
  endDate: string;
  leaveType: number;   // consider using an enum if leave types are predefined
  description: string;
}
