// Common base for date-related requests
interface BaseRequest {
  startDate: string; // ISO date string
  numberOfDays: number;
  description: string;
}

export interface HomeVisitDetails {
  id: number;
  employeeId: number;
  employeeName: string;       // format: YYYY-MM-DD
  startDate: string;       // format: YYYY-MM-DD
  endDate: string;         // format: YYYY-MM-DD
  description: string;
  status: number;
  requestedAt: string;     // ISO datetime string
  comment: string | null;
}


// Extend for create (employee) request
export interface CreateRequest extends BaseRequest {}

// Extend for assign (manager) request
export interface AssignRequest extends BaseRequest {
  employeeId: number;
}

// Extend for update requests (both employee and manager)
export interface UpdateRequest extends BaseRequest {
  id: number;
}

// Common base for sick request
export interface BaseSickRequest {
  Id: number;
  PermitApproval: string;
  Description: string;
  MedicalReport: File;
}