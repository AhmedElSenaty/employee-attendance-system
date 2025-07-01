import { DayType } from "../types";

export interface AttendanceEntry {
  checkIn: string;
  checkOut: string;
  dayType: DayType;
}

export interface AttendanceCredentials {
  id?: number
  deviceId: number,
  employeeId: number,
  attendanceDate: string,
  attendanceTime: string,
  status: string
}

export interface AttendanceData {
  id: number
  deviceId: number,
  employeeId: number,
  attendanceDate: string,
  attendanceTime: string,
  status: string
  deviceName?: string,
  empName?: string,
  department?: string,
  subdepartment?: string,
  delegeteDepartment?: string,
  delegeteSubdepartment?: string
}

export interface AttendanceSummaryData {
  employeeId: string,
  employeeName: string,
  department: string,
  subDepartment: string,
  checkedInOnlyDays: number,
  checkedOutOnlyDays: number,
  attendanceDays: number,
  absenceDays: number,
  totalWorkingHours: number,
  totalDelayHours:number
}

export interface DailyAttendanceDto {
  totalComplete: number;
  onlyCheckedIn: number;
  onlyCheckedOut: number;
  noCheckInOrOut: number;
}

export interface AttendanceOverviewDto {
  month: string;
  attendance: number;
  absence: number;
}

export interface AttendanceCardData {
  employeeName: string;
  departmentName: string;
  subDepartmentName: string;
  checkIn: string | null;
  checkOut: string | null;
  profileImage: string | null;
}

export interface AttendanceWithVacationsData {
  employeeId: number,
  employeeName: string,
  departmentName: string,
  checkIn: string,
  checkOut: string,
  notes: string
}


export const initialAttendanceEntry: AttendanceEntry = {
  checkIn: "",
  checkOut: "",
  dayType: "absent"
}