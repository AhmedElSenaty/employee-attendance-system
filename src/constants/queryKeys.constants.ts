export const QueryKeys = {
  HomeVisits: {
    All: "home-visits-all", // All requests (manager)
    My: "home-visits-my", // My requests (employee)
    Details: "home-visit-details", // Specific request (manager)
    MyDetails: "home-visit-my-details", // Specific request (employee)
  },
  Devices: {
    All: "devices",
    Details: "deviceDetails",
    List: "devicesList",
    DeviceUsers: "deviceUsers",
  },
  SystemData: {
    All: "systemData",
  },
  Logs: {
    All: "logs",
    Details: "logDetails",
  },
  Profiles: {
    All: "profiles",
    List: "profilesList",
    Details: "profileDetails",
    Permissions: "profilePermissions",
  },
  Permissions: {
    All: "Permissions",
  },
  OfficialVacations: {
    All: "officialVacations",
    Details: "officialVacationDetails",
  },
  Entities: {
    All: "entities",
    Details: "entityDetails",
    List: "entitiesList",
  },
  Departments: {
    All: "departments",
    Details: "departmentDetails",
    List: "departmentsList",
  },
  SubDepartments: {
    All: "subDepartments",
    Details: "subDepartmentDetails",
    List: "subDepartmentsList",
  },
  Attendance: {
    All: "attendances",
    Details: "attendanceDetails",
    Calendar: "attendanceCalendar",
    Summary: "attendanceSummary",
    Overview: "attendanceOverview",
    Latest: "latestAttendance",
    DepartmentOverview: "departmentAttendanceOverview",
    Vacations: "attendanceWithVacations",
    EmployeeToday: "EmployeeTodayAttendance",
  },
  Export: {
    Excel: "exportEmployeeAttendance",
    PDF: "exportEmployeeAttendancePDF",
  },

  Employees: {
    All: "employees",
    Details: "employeeDetails",
    Count: "employeesCount",
    List: "employeesList",
    MyVacations: "employeeMyVacations",
    Vacations: "employeeVacations",
  },
  WorkingDays: {
    Me: ["WorkingDays", "Me"],
    ByID: "WorkingDaysByID",
  },
  Managers: {
    All: "managers",
    Details: "managerDetails",
    Count: "managersCount",
  },
  Admins: {
    All: "admins",
    Details: "adminDetails",
  },
  FETCH_ME: "me",
  LeaveRequests: {
    All: "leaveRequests",
    My: "myLeaveRequests",
    Details: "leaveRequestDetails",
    MyDetails: "myLeaveRequestDetails",
    WithAttendance: "leaveRequestsWithAttendance",
  },
  MissionRequests: {
    All: "missionRequests",
    My: "myMissionRequests",
    Details: "missionRequestDetails",
    MyDetails: "myMissionRequestDetails",
    WithAttendance: "missionRequestsWithAttendance",
  },
  OrdinaryRequests: {
    All: "ordinaryRequests",
    My: "myOrdinaryRequests",
    Details: "ordinaryRequestDetails",
    MyDetails: "myOrdinaryRequestDetails",
  },
  SickRequests: {
    All: ["sickLeaveRequests", "all"],
    My: ["sickLeaveRequests", "my"],
    Details: "sickLeaveRequestDetails", // + requestId
    MyDetails: "mySickLeaveRequestDetails", // + requestId
  },
  CasualLeaveRequests: {
    All: "casualLeaveRequests",
    My: "myCasualLeaveRequests",
    Details: "casualLeaveRequestDetails",
    MyDetails: "myCasualLeaveRequestDetails",
  },
  Requests: {
    All: "requests",
    Single: "Single",
  },
  ChangeVacationRequests: {
    All: "changeVacationRequests",
    Details: "changeVacationRequestDetails",
  },
  WorkingSchedule: {
    Employee: "WorkingScheduleEmployee",
    All: "WorkingScheduleAll",
  },
  YearlyOverview: "yearly-overview",
  WorkingScheduleEmployee: "WorkingScheduleEmployee",
  na: "",
  na1: "",
  na2: "",

  // Add more domains/modules here
};
