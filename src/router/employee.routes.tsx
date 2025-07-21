import { Route } from "react-router";
import { RootLayout } from "../pages/Layouts";
import { ProtectedRoute } from "../components/auth";
import EmpolyeeAccountPage from "../pages/Employee/Account";
import { CalendarPage, CasualLeaveRequestsPage, DashboardEmployee, HomeVisitRequestsPage, LeaveRequestsPage, MissionRequestsPage, OrdinaryRequestsPage, SickLRequestsPage } from "../pages/Employee";

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

    <Route path="casual-requests/" element={<CasualLeaveRequestsPage />} />

    <Route path="mission-requests/" element={<MissionRequestsPage />} />
    
    <Route path="ordinary-requests/" element={<OrdinaryRequestsPage />} />

    <Route path="sick-requests/" element={<SickLRequestsPage />} />

    <Route path="home-visit-requests/" element={<HomeVisitRequestsPage />} />
  </Route>
);
