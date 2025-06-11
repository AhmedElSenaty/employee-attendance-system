import { MissionRequestType, RequestStatusType } from "../enums";

export interface IMissionRequestCredentials {
    requestId?: number;
    type: MissionRequestType;
    date: string;
    description: string;
}

export interface IMissionRequestData{
    id: number;
    date: string;
    requestedAt: string;
    type: MissionRequestType;
    status: RequestStatusType;
    description: string;
    comment: string | null;
    employeeId?: string;
    employeeName?: string;
}

export interface IAssignMissionRequestCredentials {
    employeeId: string;
    date: string;
    startTime: string;
    endTime: string;
    description: string;
}

export interface IRejectMissionRequestCredentials {
    requestId: number;
    comment: string;
}