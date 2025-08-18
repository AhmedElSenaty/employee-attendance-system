export interface MoveUserAttendanceRequest {
  employeeIds: number[];
  sourceDeviceIds: number[];
  targetDeviceIds: number[];
}

export interface MoveUserAttendanceResponse {
  success: boolean;
  message: string;
  movedEmployees: number;
  sourceDevices: number;
  targetDevices: number;
  timestamp: string;
}

export interface MoveUserAttendanceStatus {
  isProcessing: boolean;
  progress?: number;
  currentStep?: string;
  error?: string;
}
