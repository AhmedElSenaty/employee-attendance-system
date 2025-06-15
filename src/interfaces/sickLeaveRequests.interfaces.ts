import { RequestStatusType } from "../enums";

export interface ISickLeaveRequestData {
  file?: string;
  requestId: number;
  description: string;
  permitApproval: string;
  numberOfDays: number;
  startDate: string;
  endDate: string;
  status: RequestStatusType;
  requestedAt: string;
  comment: string | null;
  employeeId?: number,
  employeeName?: string;
}

export interface ISickLeaveRequestCredentials {
  requestId?: number,
  description: string,
  permitApproval: string,
  numberOfDays: number,
  startDate: string
  medicalReport: File
}

export interface IAssignSickLeaveRequestCredentials extends ISickLeaveRequestCredentials {
  employeeId: number
}

export interface IRejectSickLeaveRequestCredentials {
  requestId: number;
  comment: string;
}