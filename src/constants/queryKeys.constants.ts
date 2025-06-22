export const QueryKeys = {
  Devices: {
    All: "devices",
    Details: "deviceDetails",
    List: "devicesList",
  },
  SystemData: {
    All :"systemData",
  },
  Logs: {
    All :"logs",
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

  FETCH_ME: "me",
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
    All: ['sickLeaveRequests', 'all'],
    My: ['sickLeaveRequests', 'my'],
    Details: 'sickLeaveRequestDetails',        // + requestId
    MyDetails: 'mySickLeaveRequestDetails',    // + requestId
  },
  CasualLeaveRequests: {
    All: "casualLeaveRequests",
    My: "myCasualLeaveRequests",
    Details: "casualLeaveRequestDetails",
    MyDetails: "myCasualLeaveRequestDetails",
  },
  WorkingDays: {
    Me: ["WorkingDays", "Me"],
    ByID: "WorkingDaysByID",
  },
  // Add more domains/modules here
};
