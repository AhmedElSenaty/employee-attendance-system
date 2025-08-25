import { useTranslation } from "react-i18next"; // Import translation hook
import {
  Archive,
  BarChart2,
  Briefcase,
  Building2,
  Calendar,
  CalendarCog,
  CalendarDays,
  CalendarSearch,
  ClipboardList,
  Clock,
  Coffee,
  Contact,
  ContactRound,
  FileBarChart2,
  FileChartColumn,
  FileEdit,
  FileText,
  Home,
  LayoutDashboard,
  MapPinHouse,
  Monitor,
  Moon,
  Thermometer,
  TicketsPlane,
  User,
  UserCog,
  UserPlus,
  UserRoundPlus,
  Users,
  Venus,
} from "lucide-react";
import {
  Sidebar,
  SidebarDropdown,
  SidebarItem,
} from "../../components/ui/Sidebar";
import { useUserStore } from "../../store/user.store";
import { HasPermission } from "../../components/auth";

export const ManagerSidebar = () => {
  const { t } = useTranslation(["sidebarItems"]); // Initialize the translation hook
  const permissions = useUserStore((state) => state.permissions);

  return (
    <>
      <Sidebar title={t("welcomeBack")} subtitle={t("manager")}>
        <SidebarItem icon={<Home size={23} />} name={t("home")} to="/" />

        {/* reports */}
        <SidebarDropdown
          icon={<FileChartColumn size={23} />}
          name={t("reports")}
        >
          <SidebarItem
            icon={<FileBarChart2 size={23} />}
            name={t("allReports")}
            to="/manager/allReports"
          />

          <HasPermission
            permission={[
              "Export Overtime report Excel",
              "Export Overtime report PDF",
            ]}
          >
            <SidebarItem
              icon={<Moon size={23} />}
              name={t("overtime")}
              to="/manager/work-overtime"
            />
          </HasPermission>

          <HasPermission permission={"see vacations summary"}>
            <SidebarItem
              icon={<ClipboardList size={23} />}
              name={t("vacationSaver")}
              to="/manager/vacation-saver"
            />
          </HasPermission>

          <HasPermission permission={"see vacations summary"}>
            <SidebarItem
              icon={<Archive size={23} />}
              name={t("allRequests")}
              to="/manager/all-requests"
            />
          </HasPermission>

          <HasPermission permission={"see vacations summary"}>
            <SidebarItem
              icon={<BarChart2 size={23} />}
              name={t("requestsSummary")}
              to="/manager/requestsSummary"
            />
          </HasPermission>

          <HasPermission
            permission={[
              "Export Ordinary Deduction PDF",
              "Export Ordinary Deduction Excel",
            ]}
          >
            <SidebarItem
              icon={<BarChart2 size={23} />}
              name={t("OrdinaryDeduction")}
              to="/manager/ordinary-deduction"
            />
          </HasPermission>
        </SidebarDropdown>

        {/* systemManagement */}
        <SidebarDropdown
          icon={<Monitor size={23} />}
          name={t("systemManagement")}
        >
          <SidebarItem
            icon={<LayoutDashboard size={23} />}
            name={t("dashboard")}
            to="/manager"
          />

          <HasPermission permission={"View SubDepartments"}>
            <SidebarItem
              icon={<Building2 size={23} />}
              name={t("subDepartments")}
              to="/manager/manage-sub-departments"
            />
          </HasPermission>
        </SidebarDropdown>

        {(permissions.includes("View Manager") ||
          permissions.includes("View Employee")) && (
          <SidebarDropdown
            icon={<User size={23} />}
            name={t("manageUsers")}
            open={true}
          >
            {/* Manage Manager */}
            {permissions.includes("View Manager") && (
              <SidebarDropdown
                icon={<Contact size={23} />}
                name={t("managers")}
              >
                {permissions.includes("View Manager") && (
                  <SidebarItem
                    icon={<UserCog size={23} />}
                    name={t("manageManagers")}
                    to="/manager/manage-managers"
                  />
                )}
                {permissions.includes("Add Manager") && (
                  <SidebarItem
                    icon={<UserPlus size={23} />}
                    name={t("addManager")}
                    to="/manager/add-manager"
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
                    to="/manager/manage-employees"
                  />
                )}
                {permissions.includes("Add Employee") && (
                  <SidebarItem
                    icon={<UserRoundPlus size={23} />}
                    name={t("addEmployee")}
                    to="/manager/add-employee"
                  />
                )}
                <HasPermission permission={"Manage Vacation Adjustment"}>
                  <SidebarItem
                    icon={<FileEdit size={23} />}
                    name={t("vacationAdjustment")}
                    to="/manager/change-vacation-requests"
                  />
                </HasPermission>
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
              to="/manager/manage-attendance"
            />
            <SidebarItem
              icon={<Calendar size={23} />}
              name={t("attendanceSummary")}
              to="/manager/manage-attendance/overview"
            />
            <SidebarItem
              icon={<TicketsPlane size={23} />}
              name={t("attendanceVacation")}
              to="/manager/manage-attendance/vacations"
            />
          </SidebarDropdown>
        )}

        <HasPermission permission={["View Requests", "see sick leaves"]}>
          <SidebarDropdown
            icon={<CalendarCog size={23} />}
            name={t("manageRequests")}
          >
            <HasPermission permission={"View Requests"}>
              <SidebarItem
                icon={<FileText size={23} />}
                name={t("leaveRequests")}
                to="/manager/leave-requests"
              />
            </HasPermission>
            <HasPermission permission={"View Requests"}>
              <SidebarItem
                icon={<Briefcase size={23} />}
                name={t("missionRequests")}
                to="/manager/mission-requests"
              />
            </HasPermission>
            <HasPermission permission={"View Requests"}>
              <SidebarItem
                icon={<Clock size={23} />}
                name={t("ordinaryRequests")}
                to="/manager/ordinary-requests"
              />
            </HasPermission>
            <HasPermission permission={"View Requests"}>
              {" "}
              <SidebarItem
                icon={<Coffee size={23} />}
                name={t("casualLeaveRequests")}
                to="/manager/casual-requests"
              />
            </HasPermission>
            <HasPermission permission={"see sick leaves"}>
              <SidebarItem
                icon={<Thermometer size={23} />}
                name={t("sickRequests")}
                to="/manager/sick-requests"
              />
            </HasPermission>
            <HasPermission permission={"View Requests"}>
              <SidebarItem
                icon={<Venus size={23} />}
                name={t("genaricRequests")}
                to="/manager/genaric-requests"
              />
            </HasPermission>
            <HasPermission permission={"View Requests"}>
              <SidebarItem
                icon={<MapPinHouse size={23} />}
                name={t("homeVisitRequests")}
                to="/manager/home-visit-requests"
              />
            </HasPermission>
          </SidebarDropdown>
        </HasPermission>

        {/* <HasPermission permission="View Employee">
          <SidebarItem
            icon={<CalendarDays size={23} />}
            name={t("workingSchedule")}
            to="/manager/working-schedule"
          />
        </HasPermission> */}
      </Sidebar>
    </>
  );
};
