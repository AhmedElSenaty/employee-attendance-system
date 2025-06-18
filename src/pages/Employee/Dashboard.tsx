import { CalendarDays, User, FileText, Coffee, Clock, Thermometer, Briefcase } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Header } from '../../components/ui/Header';
import { NavLink } from 'react-router'; // Ensure to use react-router-dom
import { useLanguageStore, useUserStore } from '../../store';
import { EMPLOYEE_DASHBOARD_NS } from '../../constants';
import { useTranslation } from 'react-i18next';
import { useGetMyWorkingDays } from '../../hooks';
import { IDaydata } from '../../interfaces';

const Dashboard = () => {
  const { t } = useTranslation(EMPLOYEE_DASHBOARD_NS);
  const { language } = useLanguageStore();

  const id = useUserStore((state) => state.id);

  const { myWorkingDays = [], isLoadingMyWorkingDays } = useGetMyWorkingDays();

  return (
    <div className="px-6 py-8 min-h-screen">
      {/* Header */}
      <Header
        heading={t('header.heading')}
        subtitle={t('header.subtitle')}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <NavLink to="/employee/account/">
          <StatCard
            icon={<User />}
            amount={t('profile.amount')}
            description={t('profile.description')}
            note={t('profile.note')}
            iconColor="text-white"
            iconBg="bg-gray-600"
            cardBg="bg-gray-100"
          />
        </NavLink>

        <NavLink to={`/employee/calendar/${id}`}>
          <StatCard
            icon={<CalendarDays />}
            amount={t('calendar.amount')}
            description={t('calendar.description')}
            note={t('calendar.note')}
            iconColor="text-white"
            iconBg="bg-indigo-600"
            cardBg="bg-indigo-50"
          />
        </NavLink>

        <NavLink to="/employee/leave-requests">
          <StatCard
            icon={<FileText />}
            amount={t('leave.amount')}
            description={t('leave.description')}
            note={t('leave.note')}
            iconColor="text-white"
            iconBg="bg-blue-600"
            cardBg="bg-blue-50"
          />
        </NavLink>

        <NavLink to="/employee/casual-requests">
          <StatCard
            icon={<Coffee />}
            amount={t('casual.amount')}
            description={t('casual.description')}
            note={t('casual.note')}
            iconColor="text-white"
            iconBg="bg-yellow-500"
            cardBg="bg-yellow-50"
          />
        </NavLink>

        <NavLink to="/employee/ordinary-requests">
          <StatCard
            icon={<Clock />}
            amount={t('ordinary.amount')}
            description={t('ordinary.description')}
            note={t('ordinary.note')}
            iconColor="text-white"
            iconBg="bg-amber-600"
            cardBg="bg-amber-50"
          />
        </NavLink>

        <NavLink to="/employee/sick-requests">
          <StatCard
            icon={<Thermometer />}
            amount={t('sick.amount')}
            description={t('sick.description')}
            note={t('sick.note')}
            iconColor="text-white"
            iconBg="bg-red-600"
            cardBg="bg-red-50"
          />
        </NavLink>

        <NavLink to="/employee/mission-requests/">
          <StatCard
            icon={<Briefcase />}
            amount={t('mission.amount')}
            description={t('mission.description')}
            note={t('mission.note')}
            iconColor="text-white"
            iconBg="bg-purple-600"
            cardBg="bg-purple-50"
          />
        </NavLink>
      </div>

      {isLoadingMyWorkingDays ? (
        <p className="text-green-700">{t('allowedDays.loading')}</p>
      ) : (
        <div className="mt-6 px-4 py-3 bg-green-50 border border-green-200 rounded-xl shadow-sm text-green-900 text-2xl sm:text-base">
          <p className="font-semibold mb-2">{t('allowedDays.title')}</p>
          <div className="flex flex-wrap gap-2">
            {myWorkingDays.map((day: IDaydata) => (
              <span
                key={day.dayId}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full border border-green-300 text-base"
              >
                {language === "ar" ? day.dayArabicName : day.dayEnglishName}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
