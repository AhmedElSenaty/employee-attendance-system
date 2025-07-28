import { HeroSection, SystemFeaturesSection } from "./views"
import { Capacitor } from '@capacitor/core';
import { useNavigate } from "react-router";
export const HomePage = () => {

    const navigate = useNavigate();

    if (Capacitor.getPlatform() === 'android') {
        navigate("/login");
        return;
    }
    
  return (
    <>
      <HeroSection />
      <SystemFeaturesSection />
    </>
  )
}
