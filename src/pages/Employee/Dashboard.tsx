import {
  CalendarDays,
  User,
  FileText,
  Coffee,
  Clock,
  Thermometer,
  Briefcase,
  Home,
} from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { Header } from "../../components/ui/Header";
import { NavLink } from "react-router"; // Ensure to use react-router-dom
import { useLanguageStore, useUserStore } from "../../store";
import { EMPLOYEE_DASHBOARD_NS } from "../../constants";
import { useTranslation } from "react-i18next";
import {
  useGetEmployeeMyVacations,
  useGetEmployeeTodayAttendance,
  useGetMyWorkingDays,
} from "../../hooks";
import { Daydata } from "../../interfaces";
import { HasPermission } from "../../components/auth";

const Dashboard = () => {
  const { t } = useTranslation(EMPLOYEE_DASHBOARD_NS);
  const { language } = useLanguageStore();

  const id = useUserStore((state) => state.id);

  const { myWorkingDays = [], isLoading: isLoadingMyWorkingDays } =
    useGetMyWorkingDays();
  const { myVacations, isLoading: isMyVacationsLoading } =
    useGetEmployeeMyVacations();
  const { todayAttendance, isLoading: isTodayAttendanceLoading } =
    useGetEmployeeTodayAttendance();

  console.log(isTodayAttendanceLoading);

  return (
    <div className="px-6 py-8 min-h-screen">
      {/* Header */}
      <Header heading={t("header.heading")} subtitle={t("header.subtitle")} />

      {isTodayAttendanceLoading ? (
        <div className="flex justify-center mt-10">
          <p className="text-purple-700 text-lg">{t("attendance.loading")}</p>
        </div>
      ) : todayAttendance ? (
        <div className="flex justify-center mt-10">
          <div
            className={`w-full max-w-md px-6 py-5 border rounded-2xl shadow-md text-white ${
              todayAttendance.dayType === "absent"
                ? "bg-red-500 border-red-800"
                : "bg-green-500 border-green-800"
            }`}
          >
            <p className="text-xl font-bold mb-4 text-center">
              {t("attendance.title")}
            </p>
            <ul className="space-y-2 text-xl">
              <li className="flex justify-between">
                <span className="font-medium">{t("attendance.checkIn")}:</span>
                <span>{todayAttendance.checkIn || "-"}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">{t("attendance.checkOut")}:</span>
                <span>{todayAttendance.checkOut || "-"}</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mt-10">
          <p className="text-purple-700 text-lg">
            {t("attendance.notAvailable")}
          </p>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <NavLink to="/employee/account/">
          <StatCard
            icon={<User />}
            amount={t("profile.amount")}
            description={t("profile.description")}
            note={t("profile.note")}
            iconColor="text-white"
            iconBg="bg-gray-600"
            cardBg="bg-gray-100"
          />
        </NavLink>

        <NavLink to={`/employee/calendar/${id}`}>
          <StatCard
            icon={<CalendarDays />}
            amount={t("calendar.amount")}
            description={t("calendar.description")}
            note={t("calendar.note")}
            iconColor="text-white"
            iconBg="bg-indigo-600"
            cardBg="bg-indigo-50"
          />
        </NavLink>
        <HasPermission permission="see sub department Requests for employee">
          <NavLink to="/employee/SubdepartmentRequests/">
            <StatCard
              icon={<Briefcase />}
              amount={t("SubdepartmentRequests.amount")}
              description={t("SubdepartmentRequests.description")}
              note={t("SubdepartmentRequests.note")}
              iconColor="text-white"
              iconBg="bg-purple-600"
              cardBg="bg-purple-50"
            />
          </NavLink>
        </HasPermission>

        <NavLink to="/employee/leave-requests">
          <StatCard
            icon={<FileText />}
            amount={t("leave.amount")}
            description={t("leave.description")}
            note={t("leave.note")}
            iconColor="text-white"
            iconBg="bg-blue-600"
            cardBg="bg-blue-50"
          />
        </NavLink>

        <NavLink to="/employee/casual-requests">
          <StatCard
            icon={<Coffee />}
            amount={t("casual.amount")}
            description={t("casual.description")}
            note={t("casual.note")}
            iconColor="text-white"
            iconBg="bg-yellow-500"
            cardBg="bg-yellow-50"
          />
        </NavLink>

        <NavLink to="/employee/ordinary-requests">
          <StatCard
            icon={<Clock />}
            amount={t("ordinary.amount")}
            description={t("ordinary.description")}
            note={t("ordinary.note")}
            iconColor="text-white"
            iconBg="bg-amber-600"
            cardBg="bg-amber-50"
          />
        </NavLink>

        <NavLink to="/employee/sick-requests">
          <StatCard
            icon={<Thermometer />}
            amount={t("sick.amount")}
            description={t("sick.description")}
            note={t("sick.note")}
            iconColor="text-white"
            iconBg="bg-red-600"
            cardBg="bg-red-50"
          />
        </NavLink>

        <NavLink to="/employee/mission-requests/">
          <StatCard
            icon={<Briefcase />}
            amount={t("mission.amount")}
            description={t("mission.description")}
            note={t("mission.note")}
            iconColor="text-white"
            iconBg="bg-purple-600"
            cardBg="bg-purple-50"
          />
        </NavLink>

        <NavLink to="/employee/home-visit-requests">
          <StatCard
            icon={<Home />} // تأكد من استيراد الأيقونة المناسبة
            amount={t("homeVisit.amount")}
            description={t("homeVisit.description")}
            note={t("homeVisit.note")}
            iconColor="text-white"
            iconBg="bg-green-600"
            cardBg="bg-green-50"
          />
        </NavLink>
      </div>

      {isLoadingMyWorkingDays ? (
        <p className="text-green-700">{t("allowedDays.loading")}</p>
      ) : (
        <div className="mt-6 px-4 py-3 bg-green-50 border border-green-200 rounded-xl shadow-sm text-green-900 text-3xl sm:text-base">
          <p className="font-semibold mb-2">{t("allowedDays.title")}</p>
          <div className="flex flex-wrap gap-2">
            {myWorkingDays.map((day: Daydata) => (
              <span
                key={day.dayId}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full border border-green-300 text-base"
              >
                {language === "ar" ? day.dayArabicName : day.dayEnglishName}
              </span>
            ))}

            {/* <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-1">
                ساعات العمل
              </h4>
              <p className="text-sm text-gray-700">
                من الساعة 8:00 صباحًا إلى الساعة 2:00 مساءً
              </p>
            </div> */}
          </div>
        </div>
      )}

      {isMyVacationsLoading ? (
        <p className="text-blue-700 mt-6">{t("vacations.loading")}</p>
      ) : (
        myVacations && (
          <div className="mt-6 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl shadow-sm text-blue-900 text-3xl sm:text-base">
            <p className="font-semibold mb-2">{t("vacations.title")}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 list-disc list-inside text-base text-blue-800">
              <li>
                {t("vacations.totalCasualLeaves")}:{" "}
                {myVacations.totalCasualLeaves}
              </li>
              <li>
                {t("vacations.availableLeaveRequests")}:{" "}
                {myVacations.availableLeaveRequests}
              </li>

              <li>
                {t("vacations.totalOrdinaryLeaves")}:{" "}
                {myVacations.totalOrdinaryLeaves}
              </li>

              <li>
                {t("vacations.availableCasualLeaves")}:{" "}
                {myVacations.availableCasualLeaves}
              </li>

              <li>
                {t("vacations.totalLeaveRequests")}:{" "}
                {myVacations.totalLeaveRequests}
              </li>

              <li>
                {t("vacations.availableOrdinaryLeaves")}:{" "}
                {myVacations.availableOrdinaryLeaves}
              </li>
              <li>
                {t("vacations.totalMissions")}: {myVacations.totalMissions}
              </li>

              <li>
                {t("vacations.totalSickLeave")}: {myVacations.totalSickLeave}
              </li>
            </ul>
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;
