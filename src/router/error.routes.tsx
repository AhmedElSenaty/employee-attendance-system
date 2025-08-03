import { Route } from "react-router";
import { RootLayout } from "../pages/Layouts";
import {
  ErrorHandler,
  ForbiddenPage,
  NotFoundPage,
} from "../components/errors";

export const errorRoutes = (
  <Route path="/" element={<RootLayout />} errorElement={<ErrorHandler />}>
    <Route path="/forbidden" element={<ForbiddenPage />} />
    <Route path="/server-error" element={<ErrorHandler />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
);
