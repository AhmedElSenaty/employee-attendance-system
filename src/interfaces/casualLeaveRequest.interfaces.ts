import { RequestStatusType } from "../enums";

export interface ICasualLeaveRequestCredentials {
  requestId?: number;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ICasualLeaveRequestData {
  id: number;
  startDate: string;
  endDate: string;
  requestedAt: string;
  status: RequestStatusType;
  description: string;
  comment: string | null;
  employeeId?: number,
  employeeName?: string
}

export interface IRejectCasualLeaveRequestCredentials {
  requestId: number;
  comment: string;
}

export interface IAssignCasualLeaveRequestCredentials {
  employeeId: string;
  startTime: string;
  endTime: string;
  description: string;
}
