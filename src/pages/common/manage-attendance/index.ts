export { default as ManageAttendancePage } from "./ManageAttendance"
export { default as AttendanceOverviewPage } from "./AttendanceOverview"

export const ATTENDANCE_TRANSLATION_NAMESPACE = "attendancePages";

export const ATTENDANCE_TABLE_COLUMNS = [
  "table.columns.id",
  "table.columns.attendanceDate",
  "table.columns.attendanceTime",
  "table.columns.empName",
  "table.columns.status",
  "table.columns.department",
  "table.columns.subdepartment",
  "table.columns.actions",
]

export const ATTENDANCE_SUMMARY_TABLE_COLUMNS = [
  "tableSummary.columns.employeeName",
  "tableSummary.columns.department",
  "tableSummary.columns.subdepartment",
  "tableSummary.columns.checkedInOnlyDays",
  "tableSummary.columns.checkedOutOnlyDays",
  "tableSummary.columns.attendanceDays",
  "tableSummary.columns.absenceDays",
  "tableSummary.columns.totalWorkingHours",
  "tableSummary.columns.actions",
]