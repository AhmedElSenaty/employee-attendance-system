import { Route } from "react-router";
import { RootLayout } from "../pages/Layouts";
import { ProtectedRoute } from "../components/auth";
import { CalendarPage } from "../pages/Employee/Calender";
import EmpolyeeAccountPage from "../pages/Employee/Account";
import { DashboardEmployee, LeaveRequestsPage } from "../pages/Employee";
import { MissionRequestsPage } from "../pages/Employee/mission-requests";

export const employeeRoutes = (isLoggedIn: boolean, userRole: string) => (
  <Route 
    path="/employee/"
    element={
      <ProtectedRoute isAllowed={isLoggedIn && userRole === "employee"} redirectPath="/">
        <RootLayout />
      </ProtectedRoute>
    } 
  >
    <Route index element={<DashboardEmployee />} />

    <Route path="account/" element={<EmpolyeeAccountPage />} />

    <Route path="calendar/" element={<CalendarPage />} />

    <Route path="leave-requests/" element={<LeaveRequestsPage />} />

    <Route path="mission-requests/" element={<MissionRequestsPage />} />
  </Route>
);
