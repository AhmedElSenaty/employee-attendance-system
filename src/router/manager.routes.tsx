import { Route } from "react-router";
import { DashboardPage } from "../pages/common/Dashboard";
import { RootLayout } from "../pages/Layouts";
import { ProtectedRoute } from "../components/auth";
import ManagerAccountPage from "../pages/Manager/Account";
import {
  RequestsPage,
  OrdinaryRequestsPage,
  AttendanceOverviewPage,
  AttendanceVacationsPage,
  ManageAttendancePage,
  CalendarPage,
  MissionRequestsPage,
  CasualLeaveRequestsPage,
  SickLRequestsPage,
  LeaveRequestsPage,
  LeaveRequestsWithAttendance,
  MissionRequestsWithAttendance,
  ManageSubDepartmentsPage,
  ManageEmployeesPage,
  AddEmployeePage,
  EditEmployeePage,
  ManageManagersPage,
  AddManagerPage,
  EditManagerPage,
  WorkingSchedulePage,
} from "../pages/Manager";
import AllRequestsPage from "../pages/Manager/requests/AllRequests";
import GenaricRequestsPage from "../pages/Manager/requests/GenaricRequests";
import HomeVisitRequestsPage from "../pages/Manager/home-visit-requests";
import RequestsSummary from "../pages/Manager/RequestsSummary/RequestsSummary";
import AllVacationSaverPage from "../pages/Manager/VacationSaver/AllVacationSaverPage";
import AllManagerReports from "../pages/Manager/AllManagerReports/AllManagerReports";
import ManageChangeVacationRequestsPage from "../pages/Manager/change-vacation-requests/ChangeVacationRequests";
import ManageWorkoverTimePage from "../pages/common/workOvertime/ManageWorkoverTimePage";

export const managerRoutes = (isLoggedIn: boolean, userRole: string) => (
  <Route
    path="/manager/"
    element={
      <ProtectedRoute
        isAllowed={isLoggedIn && userRole === "manager"}
        redirectPath="/"
      >
        <RootLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<DashboardPage />} />

    <Route path="account/" element={<ManagerAccountPage />} />

    {/* Manager Routes */}
    <Route path="manage-managers/" element={<ManageManagersPage />} />
    <Route path="add-manager/" element={<AddManagerPage />} />
    <Route path="edit-manager/:id" element={<EditManagerPage />} />

    {/* Employee Routes */}
    <Route path="manage-employees/" element={<ManageEmployeesPage />} />
    <Route path="add-employee/" element={<AddEmployeePage />} />
    <Route path="edit-employee/:id" element={<EditEmployeePage />} />
    <Route path="manage-employee/:id/calender" element={<CalendarPage />} />

    <Route
      path="manage-sub-departments/"
      element={<ManageSubDepartmentsPage />}
    />

    {/* Attendance Routes */}
    <Route path="manage-attendance" element={<ManageAttendancePage />} />
    <Route
      path="manage-attendance/overview/"
      element={<AttendanceOverviewPage />}
    />
    <Route
      path="manage-attendance/vacations/:type?"
      element={<AttendanceVacationsPage />}
    />

    <Route path="leave-requests" element={<LeaveRequestsPage />} />
    <Route
      path="leave-requests-with-attendance"
      element={<LeaveRequestsWithAttendance />}
    />
    <Route path="mission-requests" element={<MissionRequestsPage />} />
    <Route
      path="mission-requests-with-attendance"
      element={<MissionRequestsWithAttendance />}
    />
    <Route path="ordinary-requests" element={<OrdinaryRequestsPage />} />

    <Route path="casual-requests" element={<CasualLeaveRequestsPage />} />

    <Route path="sick-requests" element={<SickLRequestsPage />} />

    <Route path="pending-requests" element={<RequestsPage />} />
    <Route path="all-requests" element={<AllRequestsPage />} />
    <Route path="genaric-requests" element={<GenaricRequestsPage />} />
    <Route path="home-visit-requests" element={<HomeVisitRequestsPage />} />

    <Route path="requestsSummary" element={<RequestsSummary />} />
    <Route path="allReports" element={<AllManagerReports />} />

    <Route path="vacation-saver" element={<AllVacationSaverPage />} />

    <Route
      path="change-vacation-requests/"
      element={<ManageChangeVacationRequestsPage />}
    />

    <Route path="work-overtime/" element={<ManageWorkoverTimePage />} />

    {/* Working Schedule Routes */}
    <Route path="working-schedule/" element={<WorkingSchedulePage />} />
  </Route>
);
