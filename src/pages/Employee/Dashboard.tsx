import { UserCog, CalendarCheck, Clipboard } from 'lucide-react';  // Importing Lucid icons
import { StatCard } from '../../components/ui/StatCard';
import { Header } from '../../components/ui/Header';
import { NavLink } from 'react-router';  // Ensure to use NavLink from react-router-dom
import { useFetchMe } from '../../hooks/me.hooks';

const Dashboard = () => {
  // Fetching user data
  const { me } = useFetchMe();

  // Extracting user details
  const userName = me?.fullName || 'User';
  const departmentName = me?.departmentName || 'No Department';
  const subDepartmentName = me?.subDepartmentName || 'No Sub-Department';

  return (
    <div className="px-6 py-8 min-h-screen">
      {/* Header with greeting and department info */}
      <Header
        heading={`Welcome, ${userName}`}
        subtitle={`Department: ${departmentName} - Sub-Department: ${subDepartmentName}`}
      />

      {/* Grid for the StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Go to your account */}
        <NavLink
          to="/employee/account/"
        >
          <StatCard
            icon={<UserCog />}  // Lucid icon for user settings
            amount="Go to Your Account"
            description="Manage your profile and settings."
            note="Click here to view your account."
            iconColor="text-white"
            iconBg="bg-blue-600"
            cardBg="bg-blue-50"
          />
        </NavLink>

        {/* Show attendance */}
        <NavLink
          to="/employee/calendar/"
        >
          <StatCard
            icon={<CalendarCheck />}  // Lucid icon for attendance
            amount="View Your Attendance"
            description="Check your attendance records."
            note="Click here to view your attendance."
            iconColor="text-white"
            iconBg="bg-green-600"
            cardBg="bg-green-50"
          />
        </NavLink>

        {/* Request Leave (Coming Soon) */}
        <div>
          <StatCard
            icon={<Clipboard />}  // Lucid icon for leave request
            amount="Request Leave (Coming Soon)"
            description="This feature will be available soon."
            note="Stay tuned for updates on requesting time off."
            iconColor="text-white"
            iconBg="bg-yellow-600"
            cardBg="bg-yellow-50"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
