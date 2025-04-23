import { createBrowserRouter, createRoutesFromElements } from "react-router";
import { publicRoutes } from "./public.routes";
import { authRoutes } from "./auth.routes";
import { adminRoutes } from "./admin.routes";
import { errorRoutes } from "./error.routes";
import { managerRoutes } from "./manager.routes";
import { employeeRoutes } from "./employee.routes";

const createAppRouter = (isLoggedIn: boolean, userRole: string ) =>
  createBrowserRouter(
    createRoutesFromElements(
      <>
        {publicRoutes}
        {authRoutes(isLoggedIn)}
        {adminRoutes(isLoggedIn, userRole)}
        {managerRoutes(isLoggedIn, userRole)}
        {employeeRoutes(isLoggedIn, userRole)}
        {errorRoutes}
      </>
    )
  );

export default createAppRouter;
