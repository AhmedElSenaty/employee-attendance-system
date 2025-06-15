import { Route } from "react-router";
import { DashboardPage } from "../pages/common/Dashboard";
import { RootLayout } from "../pages/Layouts";
import { AttendanceOverviewPage, ManageAttendancePage } from "../pages/common/manage-attendance";
import { ProtectedRoute } from "../components/auth";
import { ManagePermissionsPage } from "../pages/Admin/manage-permissions";
import { AddProfilePage, EditProfilePage, ManageProfilesPage } from "../pages/Admin/manage-profiles";
import { AddAdminPage, EditAdminPage, ManageAdminsPage } from "../pages/Admin/manage-admins";
import { AddEmployeePage, EditEmployeePage, ManageEmployeesPage } from "../pages/common/manage-employees";
import { ManageOfficialVacationsPage } from "../pages/Admin/manage-official-vacation";
import { AddManagerPage, EditManagerPage, ManageManagersPage } from "../pages/common/manage-managers";
import { CalendarPage } from "../pages/common/Calender";
import { ManageEntitiesPage } from "../pages/Admin/manage-entities";
import { ManageDevicesPage } from "../pages/Admin/manage-devices";
import { ManageDepartmentsPage } from "../pages/Admin/manage-departments";
import { ManageSubDepartmentsPage } from "../pages/common/manage-sub-departments";
import AdminAccountPage from "../pages/Admin/Account";
import LogsPage from "../pages/Admin/manage-logs";
import SystemDataPage from "../pages/Admin/manage-system-data";

export const adminRoutes = (isLoggedIn: boolean, userRole: string) => (
  <Route 
    path="/admin/"
    element={
      <ProtectedRoute isAllowed={isLoggedIn && userRole === "admin"} redirectPath="/">
        <RootLayout />
      </ProtectedRoute>
    } 
  >
    <Route index element={<DashboardPage />} />

    <Route path="account/" element={<AdminAccountPage />} />

    {/* Admin Routes */}
    <Route path="manage-admins/" element={<ManageAdminsPage />} />
    <Route path="add-admin/" element={<AddAdminPage />} />
    <Route path="edit-admin/:id" element={<EditAdminPage />} />

    {/* Manager Routes */}
    <Route path="manage-managers/" element={<ManageManagersPage />} />
    <Route path="add-manager/" element={<AddManagerPage />} />
    <Route path="edit-manager/:id" element={<EditManagerPage />} />

    {/* Employee Routes */}
    <Route path="manage-employees/" element={<ManageEmployeesPage />} />
    <Route path="add-employee/" element={<AddEmployeePage />} />
    <Route path="edit-employee/:id" element={<EditEmployeePage />} />
    <Route path="manage-employee/:id/calender" element={<CalendarPage />} />

    {/* Attendance Routes */}
    <Route path="manage-attendance" element={<ManageAttendancePage />} />
    <Route path="manage-attendance/overview/" element={<AttendanceOverviewPage />} />
    
    {/* Department Routes */}
    <Route path="manage-departments/" element={<ManageDepartmentsPage />} />
    
    {/* Sub-Department Routes */}
    <Route path="manage-sub-departments/" element={<ManageSubDepartmentsPage />} />

    {/* Device Routes */}
    <Route path="manage-devices/" element={<ManageDevicesPage />} />

    {/* Entity Routes */}
    <Route path="manage-entities/" element={<ManageEntitiesPage />} />

    {/* Permission Routes */}
    <Route path="permissions/" element={<ManagePermissionsPage />} />

    {/* Official Vacation Routes */}
    <Route path="manage-official-vacation/" element={<ManageOfficialVacationsPage />} />

    {/* Profile Routes */}
    <Route path="manage-profiles/" element={<ManageProfilesPage />} />
    <Route path="add-profile/" element={<AddProfilePage />} />
    <Route path="edit-profile/:id" element={<EditProfilePage />} />

    <Route path="logs" element={<LogsPage />} />
    <Route path="system-data" element={<SystemDataPage />} />
  </Route>
);
