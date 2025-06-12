import { UserCog, CalendarDays, Plane, Briefcase } from 'lucide-react';  // Importing Lucid icons
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
        <NavLink to="/employee/account/">
          <StatCard
            icon={<UserCog />} // Lucide icon
            amount="Manage Account"
            description="Update your profile and preferences."
            note="Click to access your account."
            iconColor="text-white"
            iconBg="bg-blue-600"
            cardBg="bg-blue-50"
          />
        </NavLink>

        {/* Show attendance */}
        <NavLink to="/employee/calendar/">
          <StatCard
            icon={<CalendarDays />} // More distinct calendar icon
            amount="Attendance Calendar"
            description="Review your daily attendance logs."
            note="Click to view your attendance."
            iconColor="text-white"
            iconBg="bg-emerald-600"
            cardBg="bg-emerald-50"
          />
        </NavLink>

        {/* Leave Requests */}
        <NavLink to="/employee/leave-requests/">
          <StatCard
            icon={<Plane />} // Icon for leave or travel
            amount="Leave Requests"
            description="Submit and track your leave."
            note="Click to manage your leaves."
            iconColor="text-white"
            iconBg="bg-yellow-600"
            cardBg="bg-yellow-50"
          />
        </NavLink>

        {/* Mission Requests */}
        <NavLink to="/employee/mission-requests/">
          <StatCard
            icon={<Briefcase />} // Icon for missions/work
            amount="Mission Requests"
            description="Request and view your missions."
            note="Click to manage your missions."
            iconColor="text-white"
            iconBg="bg-purple-600"
            cardBg="bg-purple-50"
          />
        </NavLink>
      </div>

    </div>
  );
};

export default Dashboard;
