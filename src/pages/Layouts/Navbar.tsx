import { useTranslation } from "react-i18next";
import { Logo } from "../../components/ui/Logo";
import { Flyout, FlyoutMenu } from "../../components/ui/Flyout";
import { Image } from "../../components/ui/Image";
import { Briefcase, HomeIcon, LogIn, LogOut, Menu, User, X } from "lucide-react";
import { NavLink } from "react-router";
import { Button } from "../../components/ui/Button";
import { useLanguageStore } from "../../store/language.store";
import { LanguageType } from "../../types";
import { useUserStore } from "../../store/user.store";
import { useSidebarStore } from "../../store/sidebar.store";

export const Navbar = () => {
  const { setLanguage, flag, flags } = useLanguageStore();
  const { t } = useTranslation(["common", "navbar"]);

  const userRole = useUserStore((state) => state.role);
  const isLoggedIn = Boolean(useUserStore((state) => state.token));
  const imageUrl = useUserStore((state) => state.imageUrl);
  const logoutUser = useUserStore((state) => state.logoutUser);
  const id = useUserStore((state) => state.id);

  const sidebarisOpen = useSidebarStore((state) => state.isOpen);
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

  return (
    <header className="z-30 shadow-lg sticky top-0 py-3 w-full h-fit bg-[var(--color-primary)]">
      <nav className="sm:mx-16 mx-3 flex justify-between items-center">
        { isLoggedIn && userRole != "employee" &&
          <button
            onClick={toggleSidebar}
            className="cursor-pointer inline-flex items-center justify-center p-2 text-white bg-secondary hover:bg-secondary-hover  rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            aria-label="Toggle Sidebar"
          >
            {sidebarisOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        }
        <NavLink
          to="/"
        >
          <Logo width="w-15" height="h-15" />
        </NavLink>
        
        <div className="flex items-center gap-5">
          <Flyout icon={<Logo src={flag} width="sm:w-10 w-8" height="sm:h-10 h-8" />}
            className="flex items-center justify-center focus:outline-none cursor-pointer"
          >
            <FlyoutMenu 
              className="w-45 border-0.5 bg-white shadow-md rounded-2xl text-base transition duration-300 ease-in-out"
            >
              <div className="flex flex-col gap-2 p-3">
              {Object.entries(flags).map(([lang, icon]) => {
                const languageKey = lang as LanguageType;
                console.log(languageKey);
                
                return (
                  <button
                    key={languageKey}
                    className="flex items-center gap-6 p-2 rounded-lg transition hover:bg-black/5 cursor-pointer"
                    onClick={() => setLanguage(languageKey)}
                  >
                    <Logo src={icon} width="w-6" height="h-6" />
                    <p className="font-semibold text-black capitalize">{t(`languages.${languageKey}`)}</p>
                  </button>
                );
              })}
              </div>
            </FlyoutMenu>
          </Flyout>

          { isLoggedIn ?
            ( 
              <Flyout
                icon={<Image
                  src={imageUrl == null ? "/images/default-user-image.webp" : imageUrl}
                  alt="Description of image"
                  width="sm:w-12 w-10"
                  height="sm:h-12 h-10"
                  rounded="rounded-full"
                />}
                className="focus:outline-none cursor-pointer"
              >
                <FlyoutMenu 
                  className="border-0.5 w-[280px] bg-white shadow-md rounded-2xl text-lg transition duration-300 ease-in-out"
                >
                  <div className="p-3">
                    {/* Home Link */}
                    <NavLink
                      className="flex items-center gap-3 rounded-lg py-2 px-3 transition hover:bg-black/5"
                      to="/"
                    >
                      <HomeIcon className="text-black" />
                      <div>
                        <p className="font-semibold text-black">{ t('userLinks.home.title', { ns: "navbar" }) }</p>
                        <p className="text-black/50 text-base">{ t('userLinks.home.description', { ns: "navbar" }) }</p>
                      </div>
                    </NavLink>
                    {/* Employee Dashboard Link */}
                    {userRole == "employee" && (
                      <NavLink
                        className="flex items-center gap-3 rounded-lg py-2 px-3 transition hover:bg-black/5"
                        to="/employee"
                      >
                        <Briefcase className="text-black" />
                        <div>
                          <p className="font-semibold text-black">
                            {t('userLinks.employeeDashboard.title', { ns: 'navbar' })}
                          </p>
                          <p className="text-black/50 text-base">
                            {t('userLinks.employeeDashboard.description', { ns: 'navbar' })}
                          </p>
                        </div>
                      </NavLink>
                    )}
                    {/* Profile Link */}
                    <NavLink
                      className="flex items-center gap-3 rounded-lg py-2 px-3 transition hover:bg-black/5"
                      to={`/${userRole}/account/`}
                    >
                      <User className="text-black" />
                      <div>
                        <p className="font-semibold text-black">{ t('userLinks.profile.title', { ns: "navbar" }) }</p>
                        <p className="text-black/50 text-base">{ t('userLinks.profile.description', { ns: "navbar" }) }</p>
                      </div>
                    </NavLink>

                    {/* Profile Link */}
                    {userRole === "employee" ? (
                      <NavLink
                        className="flex items-center gap-3 rounded-lg py-2 px-3 transition hover:bg-black/5"
                        to={`/employee/calendar/${id}`}
                      >
                        <User className="text-black" />
                        <div>
                          <p className="font-semibold text-black">{ t('userLinks.calendar.title', { ns: "navbar" }) }</p>
                          <p className="text-black/50 text-base">{ t('userLinks.calendar.description', { ns: "navbar" }) }</p>
                        </div>
                      </NavLink>
                    ) : null}
                  </div>

                  {/* Logout Link */}
                  <div className="p-3 border-t-1 border-gray-200">
                    <button
                      className="w-full cursor-pointer flex items-center gap-3 rounded-lg py-2 px-3 transition bg-red-100 hover:bg-red-200"
                      onClick={() => logoutUser()}
                    >
                      <LogOut className="text-red-600" />
                      <div>
                        <p className="font-semibold text-black">{ t('userLinks.logout.title', { ns: "navbar" }) }</p>
                        <p className="text-black/50 text-base">{ t('userLinks.logout.description', { ns: "navbar" }) }</p>
                      </div>
                    </button>
                  </div>
                </FlyoutMenu>
              </Flyout>
            ) : (
              <NavLink
                to={'/login'}
              >
                <Button variant="secondary" size={"md"} icon={<LogIn />}>
                  {t("buttons.login")}
                </Button>
              </NavLink>
            )
          }
        </div>
      </nav>
    </header>
  )
}
