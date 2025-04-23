import { ContactRound, Fingerprint, Shield, Users } from "lucide-react"
import { FutureCard } from "../../../components/ui/FutureCard"
import { SectionHeader } from "../../../components/ui/SectionHeader"
import { Image } from "../../../components/ui/Image"
import { useTranslation } from "react-i18next"

const SystemFeaturesSection = () => {
  const { t } = useTranslation(["home"]);

  return (
    <>
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 lg:px-12 space-y-6">
          {/* Section Header */}
            <SectionHeader 
              title={t("systemFeaturesSection.sectionHeader.title")}
              description={t("systemFeaturesSection.sectionHeader.description")}
            />

          <div className="flex flex-col-reverse items-end lg:flex-row lg:justify-between gap-12">
            {/* Left Section - Cards */}
            <div 
              className="lg:w-1/2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FutureCard
                    icon={<Shield size={40} />}
                    title={t("systemFeaturesSection.futureCards.adminInterface.title")}
                    description={t("systemFeaturesSection.futureCards.adminInterface.description")}
                  />
                
                
                  <FutureCard
                    icon={<Users size={40} />}
                    title={t("systemFeaturesSection.futureCards.managerInterface.title")}
                    description={t("systemFeaturesSection.futureCards.managerInterface.description")}
                  />
                  <FutureCard
                    icon={<ContactRound size={40} />}
                    title={t("systemFeaturesSection.futureCards.employeeInterface.title")}
                    description={t("systemFeaturesSection.futureCards.employeeInterface.description")}
                  />
                
                
                  <FutureCard
                    icon={<Fingerprint size={40} />}
                    title={t("systemFeaturesSection.futureCards.biometricIntegration.title")}
                    description={t("systemFeaturesSection.futureCards.biometricIntegration.description")}
                  />
              </div>
            </div>

            {/* Right Section - Image */}
            <div 
              className="lg:w-1/2 flex items-center justify-center"
            >
              <div className="relative">
                <Image
                  width="w-full"
                  height="h-full"
                  src="/images/biometric-fingerprint-scanning.webp"
                  alt="Attendance System"
                  rounded="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SystemFeaturesSection
