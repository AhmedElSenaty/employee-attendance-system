import { RequestStatusType, LeaveRequestType } from "../enums";

export interface ILeaveRequestCredentials {
  requestId?: number;
  type: LeaveRequestType;
  date: string;
  description: string;
}

export interface ILeaveRequestData {
  id: number;
  date: string;
  requestedAt: string;
  type: LeaveRequestType;
  status: RequestStatusType;
  description: string;
  comment: string | null;
  employeeId?: number,
  employeeName?: string
}

export interface IRejectLeaveRequestCredentials {
  requestId: number;
  comment: string;
}

export interface ILeaveRequestsWithAttendance {
  employeeName: string,
  leaveType: number,
  checkIn: string,
  checkOut: string
}