import { useTranslation } from "react-i18next"; // Import translation hook
import { Building2, Calendar, CalendarCog, CalendarSearch, Contact, ContactRound, Home, LayoutDashboard, TentTree, User, UserCog, UserPlus, UserRoundPlus, Users } from "lucide-react";
import { Sidebar, SidebarDropdown, SidebarItem } from "../../components/ui/Sidebar";
import { useUserStore } from "../../store/user.store";

export const ManagerSidebar = () => {
  const { t } = useTranslation(["sidebarItems"]); // Initialize the translation hook
  const permissions = useUserStore((state) => state.permissions);

  return (
    <Sidebar title={t("welcomeBack")} subtitle={t("manager")}>
      <SidebarItem icon={<Home size={23} />} name={t("home")} to="/" />

      <SidebarItem icon={<LayoutDashboard size={23} />} name={t("dashboard")} to="/manager" />

      {(permissions.includes("View Manager") || permissions.includes("View Employee")) && (
        <SidebarDropdown icon={<User size={23} />} name={t("manageUsers")} open={true}>
          {/* Manage Manager */}
          {permissions.includes("View Manager") && (
            <SidebarDropdown icon={<Contact size={23} />} name={t("managers")}>
              {permissions.includes("View Manager") && (
                <SidebarItem icon={<UserCog size={23} />} name={t("manageManagers")} to="/manager/manage-managers" />
              )}
              {permissions.includes("Add Manager") && (
                <SidebarItem icon={<UserPlus size={23} />} name={t("addManager")} to="/manager/add-manager" />
              )}
            </SidebarDropdown>
          )}

          {/* Manage Employees */}
          {permissions.includes("View Employee") && (
            <SidebarDropdown icon={<ContactRound size={23} />} name={t("employees")}>
              {permissions.includes("View Employee") && (
                <SidebarItem icon={<Users size={23} />} name={t("manageEmployees")} to="/manager/manage-employees" />
              )}
              {permissions.includes("Add Employee") && (
                <SidebarItem icon={<UserRoundPlus size={23} />} name={t("addEmployee")} to="/manager/add-employee" />
              )}
            </SidebarDropdown>
          )}
        </SidebarDropdown>
      )}

      {permissions.includes("View SubDepartments") && (
        <SidebarItem icon={<Building2 size={23} />} name={t("subDepartments")} to="/manager/manage-sub-departments" />
      )}

      {/* Manage Attendances */}
      {permissions.includes("View Attendances") && (
        <SidebarDropdown icon={<CalendarCog size={23} />} name={t("attendance")}>
          <SidebarItem icon={<CalendarSearch size={23} />} name={t("attendanceDetails")} to="/manager/manage-attendance" />
          <SidebarItem icon={<Calendar size={23} />} name={t("attendanceSummary")} to="/manager/manage-attendance/overview" />
        </SidebarDropdown>
      )}

      <SidebarItem icon={<TentTree size={23} />} name={t("leaveRequests")} to="/manager/leave-requests" />

    </Sidebar>
  );
};
