import { ToastContainer } from 'react-toastify';
import { Outlet, useLocation } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useSelector } from 'react-redux';
import { selectRole } from '../../context/slices/userSlice';
import { AdminSidebar } from './AdminSidebar';
import { ManagerSidebar } from './ManagerSidebar';
import BackButton from '../../components/ui/BackButton';
import ScrollToTop from '../../components/ui/ScrollToTop';

export const RootLayout = () => {
  const userRole = useSelector(selectRole());
  const location = useLocation();

  const isHomePage = location.pathname === '/'; // Adjust if your home route is different

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      {userRole === "admin" && <AdminSidebar />}
      {userRole === "manager" && <ManagerSidebar />}

      {/* Main Content Wrapper */}
      <div className="flex flex-col w-full">
        <Navbar />
        {/* Page Content + Footer */}
        <div className="w-full min-h-screen flex-grow bg-gray-50">
          {
            !isHomePage && (
            <div className="w-full h-fit p-5">
              <BackButton />
            </div>
          )}
          <Outlet />
        </div>

        <Footer />
      </div>
      <ScrollToTop />
      <ToastContainer />
    </div>
  );
};
