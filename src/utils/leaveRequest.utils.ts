import { AttendanceStatus, LeaveRequestType } from "../enums";
import { StatusBadgeType } from "../types";

/**
 * Maps an `AttendanceStatus` to a user-friendly label.
 *
 * @param status - The attendance status (Absent or Attend).
 * @returns A string label representing the attendance status.
 *
 * @example
 * getAttendanceStatusLabel(AttendanceStatus.Attend); // "Attend"
 */
export const getAttendanceStatusLabel = (status: AttendanceStatus): string => {
  switch (status) {
    case AttendanceStatus.Attend:
      return "Attend";
    case AttendanceStatus.Absent:
      return "Absent";
    default:
      return "Unknown";
  }
};

export const getLeaveRequestTypeVariant = (
  status: LeaveRequestType
): StatusBadgeType => {
  switch (status) {
    case LeaveRequestType.Morning:
      return "warning";
    case LeaveRequestType.Evening:
      return "neutral";
    default:
      return "neutral";
  }
};


/**
 * Returns a Tailwind CSS background color class based on the attendance status.
 *
 * @param status - The attendance status (Absent or Attend).
 * @returns A Tailwind CSS class for background color.
 *
 * @example
 * getAttendanceStatusBgColor(AttendanceStatus.Absent); // "bg-red-50"
 */
export const getAttendanceStatusBgColor = (status: AttendanceStatus): string => {
  switch (status) {
    case AttendanceStatus.Attend:
      return "bg-green-50";
    case AttendanceStatus.Absent:
      return "bg-red-50";
    default:
      return "bg-gray-100";
  }
};
