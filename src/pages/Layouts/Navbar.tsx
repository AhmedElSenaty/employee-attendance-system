import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import {
  Bell,
  Menu,
  X,
  LogOut,
  HomeIcon,
  Briefcase,
  User,
  LogIn,
} from "lucide-react";
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
import { WEB_BASE_URL } from "../../constants";
import { HasPermission } from "../../components/auth";
import { useGetNotificationCount } from "../../hooks/notification.hook";
import { useNotificationStore } from "../../store/notification.store";

import mobile from "../../assets/images/mobile-solid.svg";

import { Capacitor } from '@capacitor/core';

export const Navbar = () => {
  const { t } = useTranslation(["common", "navbar"]);
  const { setLanguage, flag, flags } = useLanguageStore();
  const { role: userRole, token, logoutUser, imageUrl, id } = useUserStore();
  const isLoggedIn = Boolean(token);
  const { isOpen: sidebarisOpen, toggleSidebar } = useSidebarStore();
  // const [notificationCount, setNotificationCount] = useState(0);
  const { countt, setCount, increment } = useNotificationStore();

  const service = new AuthService();

  const { count, isLoading } = useGetNotificationCount();

  useEffect(() => {
    if (!isLoading && count >= 0) {
      setCount(count);
    }
  }, [count, isLoading, setCount]);

  // ✅ SignalR connection for manager
  useEffect(() => {
    if (token || userRole === "manager") {
      const data = service.parseToken(token);
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${WEB_BASE_URL}NotificationHub`, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();

      connection.start().then().catch();
      connection.on("ReceiveNotification", (message: INotification) => {
        if (data.departmentId === String(message.deptId)) {
          const sound = new Audio("/public/new-notification.mp3");
          sound.play();
          //    setNotificationCount((prev) => prev + 1);
          increment(); // ✅ update global count
        }
      });
      return () => {
        connection.stop().then();
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
            {sidebarisOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        )}

              <div className="flex items-center gap-5">
                <NavLink to="/">
                <Logo width="w-15" height="h-15" />
                </NavLink>  
              </div>
              

        {/* Right Icons */}
        <div className="flex items-center gap-5">
          {/* 🔔  Bell with Badge */}

          <HasPermission permission="View Requests">
            {isLoggedIn && userRole === "manager" && (
              <NavLink to={"/manager/pending-requests"}>
                <button
                  className="relative cursor-pointer inline-flex items-center justify-center p-2 text-white bg-secondary hover:bg-secondary-hover rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  aria-label="Notifications"
                  // onClick={() => setNotificationCount(notificationCount)} // Reset on click if desired
                              >
                                  
                  <Bell className="w-7 h-7" />
                  {countt > 0 && (
                    <div className="absolute -top-1 -right-1">
                      <Badge count={countt} bgColor="bg-red-600" pulse />
                    </div>
                  )}
                </button>
              </NavLink>
            )}
          </HasPermission>

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
                  <NavLink
                    to="/"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5"
                  >
                    <HomeIcon className="text-black" />
                    <div>
                      <p className="font-semibold text-black">
                        {t("userLinks.home.title", { ns: "navbar" })}
                      </p>
                      <p className="text-black/50 text-base">
                        {t("userLinks.home.description", { ns: "navbar" })}
                      </p>
                    </div>
                  </NavLink>

                  {userRole === "employee" && (
                    <>
                      <NavLink
                        to="/employee"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5"
                      >
                        <Briefcase className="text-black" />
                        <div>
                          <p className="font-semibold text-black">
                            {t("userLinks.employeeDashboard.title", {
                              ns: "navbar",
                            })}
                          </p>
                          <p className="text-black/50 text-base">
                            {t("userLinks.employeeDashboard.description", {
                              ns: "navbar",
                            })}
                          </p>
                        </div>
                      </NavLink>
                      <NavLink
                        to={`/employee/calendar/${id}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5"
                      >
                        <User className="text-black" />
                        <div>
                          <p className="font-semibold text-black">
                            {t("userLinks.calendar.title", { ns: "navbar" })}
                          </p>
                          <p className="text-black/50 text-base">
                            {t("userLinks.calendar.description", {
                              ns: "navbar",
                            })}
                          </p>
                        </div>
                      </NavLink>
                    </>
                  )}

                  <NavLink
                    to={`/${userRole}/account/`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5"
                  >
                    <User className="text-black" />
                    <div>
                      <p className="font-semibold text-black">
                        {t("userLinks.profile.title", { ns: "navbar" })}
                      </p>
                      <p className="text-black/50 text-base">
                        {t("userLinks.profile.description", { ns: "navbar" })}
                      </p>
                    </div>
                  </NavLink>
                              </div>
                              {Capacitor.getPlatform() == 'web' && (
                        <NavLink to="/">
                            <Button variant="secondary" type="button" fullWidth={true} onClick={() => {
                                const link = document.createElement('a');
                                link.href = 'https://github.com/AhmedElSenaty/employee-attendance-system/releases/download/Attendance.apk/Attendance.apk';
                                link.setAttribute('download', 'Attendance.apk');
                                link.style.display = 'none';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                        }}>
                                          <img src={mobile} width="15px" />
                                          <p className="ml-2">{t("buttons.downloadMobileApp",{
                              ns: "navbar",
                            })}</p>
                        </Button>
                        </NavLink>
                  )}

                <div className="p-3 border-t border-gray-200">
                  <button
                    onClick={logoutUser}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-100 hover:bg-red-200"
                  >
                    <LogOut className="text-red-600" />
                    <div>
                      <p className="font-semibold text-black">
                        {t("userLinks.logout.title", { ns: "navbar" })}
                      </p>
                      <p className="text-black/50 text-base">
                        {t("userLinks.logout.description", { ns: "navbar" })}
                      </p>
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
