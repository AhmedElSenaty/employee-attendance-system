import { Download, Smartphone, QrCode } from "lucide-react";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { Image } from "../../../components/ui/Image";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

// Replace with your real mockup image
import { MobileImage as mobileMockup } from "../../../assets";

const MobileAppSection = () => {
  const { t } = useTranslation(["home"]);

  // APK link from i18n (set in en/ar home.json as mobileAppSection.apk.url)
  const apkUrl = t("mobileAppSection.apk.url") as string;

  return (
    <section className="relative bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10" />

      <div className="container mx-auto px-6 lg:px-12 py-16">
        <SectionHeader
          title={t("mobileAppSection.sectionHeader.title")}
          description={t("mobileAppSection.sectionHeader.description")}
        />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: mockup */}
          <div className="flex justify-center">
            <div className="relative max-w-md w-full">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 blur opacity-60" />
              <div className="relative rounded-3xl bg-white p-4 shadow-xl">
                <div className="flex items-center gap-2 text-gray-500 px-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm">
                    {t("mobileAppSection.mockup.caption")}
                  </span>
                </div>
                <div className="mt-3 rounded-2xl overflow-hidden">
                  <Image
                    width="w-full"
                    height="h-full"
                    src={mobileMockup}
                    alt={t("mobileAppSection.mockup.alt")}
                    rounded="rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: copy + download */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold">
              {t("mobileAppSection.title")}
            </h3>
            <p className="text-gray-600">{t("mobileAppSection.body")}</p>

            {/* Direct APK download button */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={apkUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm hover:shadow transition"
                aria-label={t("mobileAppSection.apk.button")}
                title={apkUrl}
              >
                <Download className="w-5 h-5" />
                <span className="font-semibold">
                  {t("mobileAppSection.apk.button")}
                </span>
                <span className="text-xs text-gray-500">
                  {t("mobileAppSection.apk.tag")}
                </span>
              </a>
            </div>

            {/* QR code that encodes the same APK URL */}
            <div className="flex items-center gap-4 pt-4">
              <a
                href={apkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-24 h-24 rounded-xl border bg-white p-2"
                aria-label={t("mobileAppSection.qr.alt")}
                title={apkUrl}
              >
                <QRCode value={apkUrl} size={88} />
              </a>
              <div>
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                  <QrCode className="w-5 h-5" />
                  {t("mobileAppSection.qr.scan")}
                </div>
                <p className="text-sm text-gray-500">
                  {t("mobileAppSection.qr.helper")}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t("mobileAppSection.androidOnly")}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              {t("mobileAppSection.apk.note")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;
