import { Route } from "react-router";
import { RootLayout } from "../pages/Layouts";
import { ProtectedRoute } from "../components/auth";
import EmpolyeeAccountPage from "../pages/Employee/Account";
import { CalendarPage, DashboardEmployee, LeaveRequestsPage, MissionRequestsPage, OrdinaryRequestsPage, SickLRequestsPage } from "../pages/Employee";
import { CasualLeaveRequestsPage } from "../pages/Employee/casual-leave-requests";

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

    <Route path="calendar/:id" element={<CalendarPage />} />

    <Route path="leave-requests/" element={<LeaveRequestsPage />} />

    <Route path="mission-requests/" element={<MissionRequestsPage />} />
    
    <Route path="ordinary-requests/" element={<OrdinaryRequestsPage />} />
    
    <Route path="casual-leave-requests/" element={<CasualLeaveRequestsPage />} />

    <Route path="sick-requests/" element={<SickLRequestsPage />} />
  </Route>
);
