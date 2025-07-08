import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import * as signalR from '@microsoft/signalr';
import { Bell, Menu, X, LogOut, HomeIcon, Briefcase, User, LogIn } from "lucide-react";
import { NavLink } from "react-router";
import { Logo } from "../../components/ui/Logo";
import { Flyout, FlyoutMenu } from "../../components/ui/Flyout";
import { Image } from "../../components/ui/Image";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui"; // ✅ Make sure path is correct
import { useUserStore } from "../../store/user.store";
import { useSidebarStore } from "../../store/sidebar.store";
import { useLanguageStore } from "../../store/language.store";
import { defaultUsertImage } from "../../assets";
import { AuthService } from "../../services";
import { INotification } from "../../hooks";
import { showToast } from "../../utils";

export const Navbar = () => {
  const { t } = useTranslation(["common", "navbar"]);
  const { setLanguage, flag, flags } = useLanguageStore();
  const { role: userRole, token, logoutUser, imageUrl, id } = useUserStore();
  const isLoggedIn = Boolean(token);
  const { isOpen: sidebarisOpen, toggleSidebar } = useSidebarStore();

  const [notificationCount, setNotificationCount] = useState(0);
const service = new AuthService()



// ✅ SignalR connection for manager
useEffect(() => {
  if (token || userRole === "manager") 
    {
      const data =service.parseToken(token)
      const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7268/NotificationHub", {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();
  
      connection.start()
        .then(() => console.log("✅ SignalR connected"))
        .catch((e) => console.log(e)
        )
        connection.on("ReceiveNotification", (message: INotification) => {
          if(data.departmentId === String(message.deptId))
          {
            const sound = new Audio('/public/new-notification.mp3');
            sound.play();
            // showToast("success", message.message, 1000)
            console.log("📢 Notification:", message);
            setNotificationCount(prev => prev + 1);
          }
        });
        return () => {
          connection.stop().then(() => console.log("🔌 SignalR disconnected"));
        };
    }
  }, [token, userRole]);



  return (
    <header className="z-30 shadow-lg sticky top-0 py-3 w-full h-fit bg-[var(--color-primary)]">
      <nav className="sm:mx-16 mx-3 flex justify-between items-center">

        {/* Sidebar toggle */}
        {isLoggedIn && userRole !== "employee" && (
          <button
            onClick={toggleSidebar}
            className="cursor-pointer inline-flex items-center justify-center p-2 text-white bg-secondary hover:bg-secondary-hover rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            aria-label="Toggle Sidebar"
          >
            {sidebarisOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        )}

        <NavLink to="/"><Logo width="w-15" height="h-15" /></NavLink>

        {/* Right Icons */}
        <div className="flex items-center gap-5">

          {/* 🔔 Notification Bell with Badge */}
          {isLoggedIn && userRole === "manager" && (
            <NavLink to={"/manager/pending-requests"}>
              <button
                className="relative cursor-pointer inline-flex items-center justify-center p-2 text-white bg-secondary hover:bg-secondary-hover rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                aria-label="Notifications"
                onClick={() => setNotificationCount(0)} // Reset on click if desired
              >
                <Bell className="w-7 h-7" />
                {notificationCount > 0 && (
                  <div className="absolute -top-1 -right-1">
                    <Badge count={notificationCount} bgColor="bg-red-600" pulse />
                  </div>
                )}
              </button>
            </NavLink>
          )}

          {/* 🌐 Language Selector */}
          <Flyout
            icon={<Logo src={flag} width="sm:w-10 w-8" height="sm:h-10 h-8" />}
            className="flex items-center justify-center focus:outline-none cursor-pointer"
          >
            <FlyoutMenu className="w-45 border-0.5 bg-white shadow-md rounded-2xl text-base">
              <div className="flex flex-col gap-2 p-3">
                {Object.entries(flags).map(([lang, icon]) => {
                  return (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className="flex items-center gap-6 p-2 rounded-lg transition hover:bg-black/5"
                    >
                      <Logo src={icon} width="w-6" height="h-6" />
                      <p className="font-semibold text-black capitalize">
                        {t(`languages.${lang}`)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </FlyoutMenu>
          </Flyout>

          {/* 👤 User Menu */}
          {isLoggedIn ? (
            <Flyout
              icon={
                <Image
                  src={imageUrl ?? defaultUsertImage}
                  alt="User"
                  width="sm:w-12 w-10"
                  height="sm:h-12 h-10"
                  rounded="rounded-full"
                />
              }
              className="focus:outline-none cursor-pointer"
            >
              <FlyoutMenu className="border-0.5 w-[280px] bg-white shadow-md rounded-2xl text-lg">
                {/* Menu Links */}
                <div className="p-3">
                  <NavLink to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5">
                    <HomeIcon className="text-black" />
                    <div>
                      <p className="font-semibold text-black">{t("userLinks.home.title")}</p>
                      <p className="text-black/50 text-base">{t("userLinks.home.description")}</p>
                    </div>
                  </NavLink>

                  {userRole === "employee" && (
                    <>
                      <NavLink to="/employee" className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5">
                        <Briefcase className="text-black" />
                        <div>
                          <p className="font-semibold text-black">{t("userLinks.employeeDashboard.title")}</p>
                          <p className="text-black/50 text-base">{t("userLinks.employeeDashboard.description")}</p>
                        </div>
                      </NavLink>
                      <NavLink to={`/employee/calendar/${id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5">
                        <User className="text-black" />
                        <div>
                          <p className="font-semibold text-black">{t("userLinks.calendar.title")}</p>
                          <p className="text-black/50 text-base">{t("userLinks.calendar.description")}</p>
                        </div>
                      </NavLink>
                    </>
                  )}

                  <NavLink to={`/${userRole}/account/`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5">
                    <User className="text-black" />
                    <div>
                      <p className="font-semibold text-black">{t("userLinks.profile.title")}</p>
                      <p className="text-black/50 text-base">{t("userLinks.profile.description")}</p>
                    </div>
                  </NavLink>
                </div>

                <div className="p-3 border-t border-gray-200">
                  <button
                    onClick={logoutUser}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-100 hover:bg-red-200"
                  >
                    <LogOut className="text-red-600" />
                    <div>
                      <p className="font-semibold text-black">{t("userLinks.logout.title")}</p>
                      <p className="text-black/50 text-base">{t("userLinks.logout.description")}</p>
                    </div>
                  </button>
                </div>
              </FlyoutMenu>
            </Flyout>
          ) : (
            <NavLink to="/login">
              <Button variant="secondary" size="md" icon={<LogIn />}>
                {t("buttons.login")}
              </Button>
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};
