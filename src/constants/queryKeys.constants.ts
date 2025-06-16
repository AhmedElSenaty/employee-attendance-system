export const QueryKeys = {
  Devices: {
    All: "devices",
    Details: "deviceDetails",
    List: "devicesList",
  },
  Logs: {
    All :"logs",
    Details: "logDetails",
  },
  SystemData: {
    All :"systemData",
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
  LeaveRequests: {
    All: "leaveRequests",
    My: "myLeaveRequests",
    Details: "leaveRequestDetails",
    MyDetails: "myLeaveRequestDetails",
  },
  MissionRequests: {
    All: "missionRequests",
    My: "myMissionRequests",
    Details: "missionRequestDetails",
    MyDetails: "myMissionRequestDetails",
  },
  OrdinaryRequests: {
    All: "ordinaryRequests",
    My: "myOrdinaryRequests",
    Details: "ordinaryRequestDetails",
    MyDetails: "myOrdinaryRequestDetails",
  },
  SickLeaveRequests: {
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
  // Add more domains/modules here
};
