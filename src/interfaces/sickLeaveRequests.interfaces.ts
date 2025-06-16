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
  StartDate: string
  NumberOfDays: number,
  Description: string,
  PermitApproval: string,
  MedicalReport: File
}

export interface IAssignSickLeaveRequestCredentials extends ISickLeaveRequestCredentials {
  EmployeeId: number,
}

export interface IRejectSickLeaveRequestCredentials {
  requestId: number;
  comment: string;
}

export interface ISickLeaveRequestUpdateReportCredentials {
  RequestId?: number,
  MedicalReport: File
}
export interface ISickLeaveRequestUpdateTextCredentials {
  requestId?: string,
  description: string,
  permitApproval: string,
  numberOfDays: number,
  startDate: string
}