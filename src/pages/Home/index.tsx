import { Capacitor } from "@capacitor/core";
import { HeroSection, SystemFeaturesSection } from "./views";
import MobileAppSection from "./views/MobileAppSection";
import ServicesSection from "./views/ServicesSection";
import { useUserStore } from "../../store";

export const HomePage = () => {
  const { role: userRole, token, logoutUser, imageUrl, id } = useUserStore();
  const isLoggedIn = Boolean(token);

  return (
    <>
      <HeroSection />
      <SystemFeaturesSection />
      {Capacitor.getPlatform() == "web" && <MobileAppSection />}
      <ServicesSection isLoggedIn={isLoggedIn} userRole={userRole} />

      {/* <ManagerServicesSection /> */}
    </>
  );
};
