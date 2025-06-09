import { UserCog, CalendarCheck, Clipboard } from 'lucide-react';  // Importing Lucid icons
import { StatCard } from '../../components/ui/StatCard';
import { Header } from '../../components/ui/Header';
import { NavLink } from 'react-router';  // Ensure to use NavLink from react-router-dom
import { useFetchMe } from '../../hooks/me.hooks';
import { Collapsible } from '../../components/ui';

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
      </div>

      <Collapsible title="Leave Requests" open={true}>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
          <StatCard
            icon={<Clipboard />}  // Lucid icon for leave request
            amount="My Leave Requests"
            description="View your submitted leave requests and their statuses."
            note="You can track your time off history here."
            iconColor="text-white"
            iconBg="bg-yellow-600"
            cardBg="bg-yellow-50"
          />
          <StatCard
            icon={<Clipboard />}  // Lucid icon for leave request
            amount="Request Leave"
            description="Submit a new leave request for approval."
            note="Fill out the form to request time off."
            iconColor="text-white"
            iconBg="bg-yellow-600"
            cardBg="bg-yellow-50"
          />
        </div>
      </Collapsible>
    </div>
  );
};

export default Dashboard;
