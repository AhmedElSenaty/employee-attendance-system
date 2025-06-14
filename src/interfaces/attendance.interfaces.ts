import { DayType } from "../types";

export interface IAttendanceEntry {
  checkIn: string;
  checkOut: string;
  dayType: DayType;
}

export interface IAttendanceCredentials {
  id?: number
  deviceId: number,
  employeeId: number,
  attendanceDate: string,
  attendanceTime: string,
  status: string
}

export interface IAttendanceData {
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

export interface IAttendanceSummaryData {
  employeeId: string,
  employeeName: string,
  department: string,
  subDepartment: string,
  checkedInOnlyDays: number,
  checkedOutOnlyDays: number,
  attendanceDays: number,
  absenceDays: number,
  totalWorkingHours: number
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