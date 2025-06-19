import { Route } from "react-router";
import { DashboardPage } from "../pages/common/Dashboard";
import { RootLayout } from "../pages/Layouts";
import { ProtectedRoute } from "../components/auth";
import { AddEmployeePage, EditEmployeePage, ManageEmployeesPage } from "../pages/common/manage-employees";
import { AddManagerPage, EditManagerPage, ManageManagersPage } from "../pages/common/manage-managers";
import { ManageSubDepartmentsPage } from "../pages/common/manage-sub-departments";
import ManagerAccountPage from "../pages/Manager/Account";
import { OrdinaryRequestsPage, AttendanceOverviewPage, AttendanceVacationsPage, ManageAttendancePage, CalendarPage, MissionRequestsPage, CasualLeaveRequestsPage, SickLRequestsPage, LeaveRequestsPage, LeaveRequestsWithAttendance, MissionRequestsWithAttendance } from "../pages/Manager";

export const managerRoutes = (isLoggedIn: boolean, userRole: string) => (
  <Route 
    path="/manager/"
    element={
      <ProtectedRoute isAllowed={isLoggedIn && userRole === "manager"} redirectPath="/">
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


    <Route path="manage-sub-departments/" element={<ManageSubDepartmentsPage />} />

    {/* Attendance Routes */}
    <Route path="manage-attendance" element={<ManageAttendancePage />} />
    <Route path="manage-attendance/overview/" element={<AttendanceOverviewPage />} />
    <Route path="manage-attendance/vacations/" element={<AttendanceVacationsPage />} />

    <Route path="leave-requests" element={<LeaveRequestsPage />} />
    <Route path="leave-requests-with-attendance" element={<LeaveRequestsWithAttendance />} />
    <Route path="mission-requests" element={<MissionRequestsPage />} />
    <Route path="mission-requests-with-attendance" element={<MissionRequestsWithAttendance />} />
    <Route path="ordinary-requests" element={<OrdinaryRequestsPage />} />
    
    <Route path="casual-requests" element={<CasualLeaveRequestsPage />} />

    <Route path="sick-requests" element={<SickLRequestsPage />} />
  </Route>
);
