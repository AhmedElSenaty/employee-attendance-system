import { Route } from "react-router";
import { LoginPage, ResetAccountPage } from "../pages/Auth/";
import { RootLayout } from "../pages/Layouts";
import ErrorHandler from "../components/errors/ErrorHandler";
import { ProtectedRoute } from "../components/auth";
import ResetPasswordPage from "../pages/Auth/views/ResetPassword";

export const authRoutes = (isLoggedIn: boolean) => (
  <>
    <Route 
      path="/"
      element={
        <ProtectedRoute isAllowed={!isLoggedIn} redirectPath="/">
          <RootLayout />
        </ProtectedRoute>
      } 
      errorElement={<ErrorHandler />}
  >
    <Route path="/login" element={<LoginPage />} />
    <Route path="/reset-account" element={<ResetAccountPage />} />
    <Route path="/reset-password/" element={<ResetPasswordPage />} />
  </Route>
  </>
);
