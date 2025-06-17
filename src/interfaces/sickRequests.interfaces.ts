import { RequestStatusType } from "../enums";

export interface ISickRequestData {
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

export interface ISickRequestCredentials {
  StartDate: string
  NumberOfDays: number,
  Description: string,
  PermitApproval: string,
  MedicalReport: File
}

export interface IAssignSickRequestCredentials extends ISickRequestCredentials {
  EmployeeId: number,
}

export interface IRejectSickRequestCredentials {
  requestId: number;
  comment: string;
}

export interface ISickRequestUpdateReportCredentials {
  RequestId?: number,
  MedicalReport: File
}
export interface ISickRequestUpdateTextCredentials {
  requestId?: string,
  description: string,
  permitApproval: string,
  numberOfDays: number,
  startDate: string
}