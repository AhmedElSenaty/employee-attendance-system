import { Route } from "react-router";
import { HomePage } from "../pages/Home";
import { RootLayout } from "../pages/Layouts";
import ErrorHandler from "../components/errors/ErrorHandler";
import ComponentsPage from "../pages/ComponentsPage";

export const publicRoutes = (
  <Route path="/" element={<RootLayout />}  errorElement={<ErrorHandler />}>
    <Route index element={<HomePage />} />
    <Route path="/components" element={<ComponentsPage />} />
  </Route>
);