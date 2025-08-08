import { useTranslation } from "react-i18next"; // Import translation hook
import {
  BookType,
  Building,
  Building2,
  Calendar,
  CalendarCog,
  CalendarSearch,
  ClipboardType,
  Contact,
  ContactRound,
  FileBarChart2,
  FileClock,
  FileEdit,
  Fingerprint,
  Home,
  Hotel,
  LayoutDashboard,
  Lock,
  MonitorCog,
  School,
  Shield,
  ShieldEllipsis,
  ShieldPlus,
  TicketsPlane,
  TreePalm,
  TypeOutline,
  User,
  UserCog,
  UserPlus,
  UserRoundPlus,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarDropdown,
  SidebarItem,
} from "../../components/ui/Sidebar";
import { useUserStore } from "../../store/user.store";
import { HasPermission } from "../../components/auth";

export const AdminSidebar = () => {
  const { t } = useTranslation(["sidebarItems"]); // Initialize the translation hook
  const permissions = useUserStore((state) => state.permissions);

  return (
    <Sidebar title={t("welcomeBack")} subtitle={t("administrator")}>
      <SidebarItem icon={<Home size={23} />} name={t("home")} to="/" />
      <SidebarItem
        icon={<LayoutDashboard size={23} />}
        name={t("dashboard")}
        to="/admin"
      />

      <SidebarItem
        icon={<FileBarChart2 size={23} />}
        name={t("جميع التقارير")}
        to="/admin/allReports"
      />

      {(permissions.includes("View Admin") ||
        permissions.includes("View Manager") ||
        permissions.includes("View Employee")) && (
        <SidebarDropdown
          icon={<User size={23} />}
          name={t("manageUsers")}
          open={true}
        >
          {/* Manage Admin */}
          {permissions.includes("View Admin") && (
            <SidebarDropdown icon={<Shield size={23} />} name={t("admins")}>
              {permissions.includes("View Admin") && (
                <SidebarItem
                  icon={<ShieldEllipsis size={23} />}
                  name={t("manageAdmins")}
                  to="/admin/manage-admins"
                />
              )}
              {permissions.includes("Add Admin") && (
                <SidebarItem
                  icon={<ShieldPlus size={23} />}
                  name={t("addAdmin")}
                  to="/admin/add-admin"
                />
              )}
            </SidebarDropdown>
          )}

          {/* Manage Manager */}
          {permissions.includes("View Manager") && (
            <SidebarDropdown icon={<Contact size={23} />} name={t("managers")}>
              {permissions.includes("View Manager") && (
                <SidebarItem
                  icon={<UserCog size={23} />}
                  name={t("manageManagers")}
                  to="/admin/manage-managers"
                />
              )}
              {permissions.includes("Add Manager") && (
                <SidebarItem
                  icon={<UserPlus size={23} />}
                  name={t("addManager")}
                  to="/admin/add-manager"
                />
              )}
            </SidebarDropdown>
          )}

          {/* Manage Employees */}
          {permissions.includes("View Employee") && (
            <SidebarDropdown
              icon={<ContactRound size={23} />}
              name={t("employees")}
            >
              {permissions.includes("View Employee") && (
                <SidebarItem
                  icon={<Users size={23} />}
                  name={t("manageEmployees")}
                  to="/admin/manage-employees"
                />
              )}
              {permissions.includes("Add Employee") && (
                <SidebarItem
                  icon={<UserRoundPlus size={23} />}
                  name={t("addEmployee")}
                  to="/admin/add-employee"
                />
              )}
            </SidebarDropdown>
          )}
        </SidebarDropdown>
      )}
      {/* Manage Attendances */}
      {permissions.includes("View Attendances") && (
        <SidebarDropdown
          icon={<CalendarCog size={23} />}
          name={t("attendance")}
        >
          <SidebarItem
            icon={<CalendarSearch size={23} />}
            name={t("attendanceDetails")}
            to="/admin/manage-attendance"
          />
          <SidebarItem
            icon={<Calendar size={23} />}
            name={t("attendanceSummary")}
            to="/admin/manage-attendance/overview"
          />
          <SidebarItem
            icon={<TicketsPlane size={23} />}
            name={t("attendanceVacation")}
            to="/admin/manage-attendance/vacations/"
          />
        </SidebarDropdown>
      )}
      {permissions.includes("View Devices") && (
        <SidebarItem
          icon={<Fingerprint size={23} />}
          name={t("devices")}
          to="/admin/manage-devices"
        />
      )}
      {permissions.includes("View Device Users") && (
        <SidebarItem
          icon={<UserCog size={23} />}
          name={t("deviceUses")}
          to="/admin/device-users"
        />
      )}

      {/* Manage Departments */}
      {(permissions.includes("View Departments") ||
        permissions.includes("View SubDepartments")) && (
        <SidebarDropdown
          icon={<School size={23} />}
          name={t("manageDepartments")}
        >
          {permissions.includes("View Departments") && (
            <SidebarItem
              icon={<Building size={23} />}
              name={t("departments")}
              to="/admin/manage-departments"
            />
          )}
          {permissions.includes("View SubDepartments") && (
            <SidebarItem
              icon={<Building2 size={23} />}
              name={t("subDepartments")}
              to="/admin/manage-sub-departments"
            />
          )}
        </SidebarDropdown>
      )}
      {permissions.includes("View Entities") && (
        <SidebarItem
          icon={<Hotel size={23} />}
          name={t("entities")}
          to="/admin/manage-entities"
        />
      )}

      <SidebarItem
        icon={<FileEdit size={23} />}
        name={t("manageVacationAdjustment")}
        to="/admin/change-vacation-requests"
      />
      {permissions.includes("View Official Vacations") && (
        <SidebarItem
          icon={<TreePalm size={23} />}
          name={t("officialVacation")}
          to="/admin/manage-official-vacation"
        />
      )}

      {/* {permissions.includes("View Permissions") && (
        <SidebarItem
          icon={<Lock size={23} />}
          name={t("permissions")}
          to="/admin/permissions"
        />
      )} */}

      {/* Manage Profiles */}

      <HasPermission
        permission={["View Profiles", "Add Profile", "Update User Permissions"]}
      >
        <SidebarDropdown
          icon={<BookType size={23} />}
          name={t("manageProfiles")}
        >
          {permissions.includes("View Profiles") && (
            <SidebarItem
              icon={<ClipboardType size={23} />}
              name={t("profiles")}
              to="/admin/manage-profiles"
            />
          )}
          {permissions.includes("Add Profile") && (
            <SidebarItem
              icon={<TypeOutline size={23} />}
              name={t("addProfile")}
              to="/admin/add-profile"
            />
          )}
          <HasPermission permission={"Update User Permissions"}>
            <SidebarItem
              icon={<UserCog size={23} />}
              name={t("manageAdminsManagersPermissions")}
              to="/admin/addOrRemovePermissions"
            />
          </HasPermission>
        </SidebarDropdown>
      </HasPermission>

      {permissions.includes("View Logs") && (
        <SidebarItem
          icon={<FileClock size={23} />}
          name={t("logs")}
          to="/admin/logs"
        />
      )}

      {permissions.includes("View System Data") && (
        <SidebarItem
          icon={<MonitorCog size={23} />}
          name={t("systemData")}
          to="/admin/system-data"
        />
      )}
    </Sidebar>
  );
};
