import { MissionStatusType, RequestStatusType } from "../enums";

export interface IMissionCredentials {
    requestedId?: string;
    date: string;
    type: MissionStatusType;
    description: string;
}

export interface IRejectMissionCredentials {
    requestId: number;
    comment: string;
}

export interface IAssignMissionCredentials {
    employeeId: string;
    date: string;
    startTime: string;
    endTime: string;
    description: string;
}

export interface IMissionData{
    id: number;
    date: string;
    requestedAt: string;
    type: MissionStatusType;
    status: RequestStatusType;
    description: string;
    comment: string | null;
    employeeId: string;
    employeeName: string;
}

