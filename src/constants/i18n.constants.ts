import { DEVICES_NS, LOGS_NS, OFFICIAL_VACATION_NS, PERMISSION_NS, PROFILE_NS, SICK_REQUESTS_NS, SYSTEM_DATA_NS } from "./namespaces.constants";

export const i18n_LOAD_PATH = "/locales/{{lng}}/{{ns}}.json";
export const FALLBACK_LANGUAGE = "ar";
export const SUPPORTED_LANGUAGES = ["en", "ar"];
export const i18n_DEBUG = false;
export const i18n_DEFAULT_NAMESPACE = "common";
export const i18n_NAMESPACES = [
  DEVICES_NS,
  SYSTEM_DATA_NS,
  LOGS_NS,
  PROFILE_NS,
  PERMISSION_NS,
  OFFICIAL_VACATION_NS,
  "dashboard",
  "adminPages",
  "attendancePages",
  "calenderPage",
  "common",
  "departmentPages",
  "employeePages",
  "entityPages",
  "footer",
  "home",
  "login",
  "managerPages",
  "navbar",
  "resetAccount",
  "sidebarItems",
  "subDepartmentPages",
  "adminAccount",
  "managerAccount",
  "empolyeeAccount",
  "LeaveRequests",
  "missionRequests",
  "ordinaryRequests",
  "casualLeaveRequests",
  SICK_REQUESTS_NS
];