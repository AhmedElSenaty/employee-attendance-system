import { IMetadata } from "./metaDataInterface";

type DayType = "workday" | "holiday" | "weekend" | "absent" | "other";

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

export interface UseGetAllAttendanceReturn {
  attendancesData: IAttendanceData[], 
  totalAttendances: number, 
  metadata: IMetadata,
  isAttendancesDataLoading: boolean 
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

export interface UseGetAllAttendanceSummaryReturn {
  attendanceSummary: IAttendanceSummaryData[], 
  totalAttendanceSummary: number
  metadata: IMetadata
  isAttendanceSummaryLoading: boolean
}

export interface UseGetAttendanceCalenderByEmployeeIDReturn {
  calenderDays: {
    [date: string]: IAttendanceEntry;
  };
  isAttendanceCalenderLoading: boolean
}

export interface UseGetDetailedAttendanceReturn {
  detailedAttendance: IAttendanceData,
  isDetailedAttendanceLoading: boolean
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

export interface UseAttendanceDashboardResponse {
  dailyAttendanceDto: DailyAttendanceDto;
  attendanceOverviewDtos: AttendanceOverviewDto[];
  isAttendanceOverviewLoading: boolean
}

export interface AttendanceCardData {
  employeeName: string;
  departmentName: string;
  subDepartmentName: string;
  checkIn: string | null;
  checkOut: string | null;
  profileImage: string | null;
}

export interface UseGetLatestAttendance {
  latestAttendance: AttendanceCardData[];
  islatestAttendanceLoading: boolean
}
