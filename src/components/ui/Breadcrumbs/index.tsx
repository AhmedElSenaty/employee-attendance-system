import { Home } from "lucide-react";
import { Link, useLocation } from "react-router";
const breadcrumbNameMap: Record<string, string> = {
  "admin": "Dashboard",
  "manage-admins": "Admins",
  "add-admin": "Add Admin",
  "edit-admin": "Edit Admin",
  "manage-managers": "Managers",
  "add-manager": "Add Manager",
  "edit-manager": "Edit Manager",
  "manage-employees": "Employees",
  "add-employee": "Add Employee",
  "edit-employee": "Edit Employee",
  "manage-attendance": "Attendance",
  "overview": "Overview",
  "manage-departments": "Departments",
  "manage-sub-departments": "Sub-Departments",
  "manage-devices": "Devices",
  "manage-entities": "Entities",
  "permissions": "Permissions",
  "manage-official-vacation": "Official Vacation",
  "manage-profiles": "Profiles",
  "add-profile": "Add Profile",
  "edit-profile": "Edit Profile",
  "calender": "Calendar",
};
const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="text-md text-gray-500" aria-label="Breadcrumb">
      <ol className="inline-flex flex-wrap items-center space-x-1">
        <li>
          <Link to="/" className="text-secondary hover:underline">
            <Home className="w-4 h-4" />
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const label = breadcrumbNameMap[value] || value;

          return (
            <li key={to} className="flex items-center">
              <span className="mx-1">/</span>
              {isLast ? (
                <span className="text-primary font-semibold">{label}</span>
              ) : (
                <Link to={to} className="text-secondary hover:underline">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
