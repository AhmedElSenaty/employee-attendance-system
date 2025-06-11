import { RequestStatusType } from "../enums";

export interface IOrdinaryRequestCredentials {
    requestId?: number;
    startDate: string;
    endDate: string;
    description: string;
}

export interface IOrdinaryRequestData{
    id: number;
    date: string;
    requestedAt: string;
    status: RequestStatusType;
    description: string;
    comment: string | null;
    employeeId?: string;
    employeeName?: string;
}


export interface IRejectOrdinaryRequestCredentials {
    requestId: number;
    comment: string;
}