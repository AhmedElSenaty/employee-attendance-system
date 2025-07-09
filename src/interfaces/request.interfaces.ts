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