export interface ChangeVacationCountsRequestDto {
  id: number;

  totalCasual?: number | null;
  availableCasual?: number | null;
  totalOrdinary?: number | null;
  availableOrdinary?: number | null;
  totalLeaveRequest?: number | null;
  availableLeaveRequest?: number | null;

  reportImageUrl: string;
  managerName: string;
  status: number;

  description?: string | null;
  comment?: string | null;

  emplyeeName: string;
  emplyeeId: number;
}

export interface AddChangeVacationsDto {
  employeeId: number;

  totalCasual?: number | null;
  availableCasual?: number | null;

  totalOrdinary?: number | null;
  availableOrdinary?: number | null;

  totalLeaveRequest?: number | null;
  availableLeaveRequest?: number | null;

  description?: string | null;
  comment?: string | null;

  medicalReportImageUrl: Array<File>;
}
