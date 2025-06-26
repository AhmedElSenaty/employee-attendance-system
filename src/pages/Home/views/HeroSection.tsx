import { useState } from 'react'
import { Header } from '../../../components/ui/Header'
import { Button } from '../../../components/ui/Button'
import { Popup } from '../../../components/ui/Popup'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'
import { useUserStore } from '../../../store/user.store'
import { helwanImage } from '../../../assets'

const HeroSection = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const { t } = useTranslation(["home"]);

  const userRole = useUserStore((state) => state.role);
  const token = useUserStore((state) => state.token);

  return (
    <>
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat h-[700px] flex items-center justify-center text-white"
        style={{ backgroundImage: `url('${helwanImage}')` }}
      >
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black opacity-50"
        ></div>

        {/* Content */}
        <div 
          className="relative z-10 flex flex-col gap-10 items-center justify-center px-6 md:px-12"
        >
            <Header 
              heading={t("heroSection.header.heading")} 
              subtitle={t("heroSection.header.subtitle")} 
              headingColor="text-white"
              subtitleColor="text-white"
            />
            {/* <Button variant={"secondary"} type="button" size={'lg'} onClick={() => setIsPopupOpen(true)}>
              {t("heroSection.buttons.getStarted")}
            </Button> */}
        </div>
      </div>

      {/* Popup Animation with Flip Effect */}
      {isPopupOpen && (
        <div 
        >
          <Popup 
            isOpen={isPopupOpen} 
            closeModal={() => setIsPopupOpen(false)}
            title={t("heroSection.popup.title")}
            description={t("heroSection.popup.description")}
          >
            <div className="flex items-center space-x-3 mt-4">
              <Button variant="cancel" type="button" fullWidth onClick={() => setIsPopupOpen(false)}>
                {t("heroSection.buttons.close")}
              </Button>
              {
                !token ? (
                  <NavLink
                    to={
                      userRole == "admin"
                        ? "/admin"
                        : userRole == "manager"
                        ? "/manager"
                        : userRole == "employee"
                        ? "/employee"
                        : "/"
                    }
                    className="w-full"
                  >
                    <Button variant="secondary" type="button" fullWidth>
                      {t("heroSection.buttons.dashboard")}
                    </Button>
                  </NavLink>
                ) : (
                  <NavLink to={"/login"} className={"w-full"}>
                    <Button variant="secondary" type="button" fullWidth>
                      {t("heroSection.buttons.login")}
                    </Button>
                  </NavLink>
                )
              }
            </div>
          </Popup>
        </div>
      )}
    </>
  )
}

export default HeroSection;
