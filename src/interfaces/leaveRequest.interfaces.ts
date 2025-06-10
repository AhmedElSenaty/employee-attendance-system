import { LeaveRequestStatusType, LeaveRequestTimeType } from "../enums";

export interface ILeaveRequestCredentials {
  requestId?: number;
  type: LeaveRequestTimeType;
  date: string;
  description: string;
}

export interface ILeaveRequestData {
  id: number;
  date: string;
  requestedAt: string;
  type: LeaveRequestTimeType;
  status: LeaveRequestStatusType;
  description: string;
  comment: string | null;
  employeeId: number,
  employeeName: string
}

export interface IRejectLeaveRequestCredentials {
  requestId: number;
  comment: string;
}