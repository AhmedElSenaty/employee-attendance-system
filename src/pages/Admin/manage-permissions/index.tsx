import { useTranslation } from "react-i18next";
import { CountCard, Header, InfoPopup } from "../../../components/ui";
import { formatValue } from "../../../utils";
import { Signature } from "lucide-react";
import { PermissionsData } from "../../../interfaces";
import { useGetPermissions } from "../../../hooks/";
import { HasPermission } from "../../../components/auth";
import { useLanguageStore, useUserStore } from "../../../store";
import { PERMISSION_NS, PERMISSION_VIDEO } from "../../../constants";


const ManagePermissionsPage = () => {
  const { t } = useTranslation([PERMISSION_NS]);
  const language = useLanguageStore((state) => state.language);
  const myPermissions = useUserStore((state) => state.permissions);

  const { permissions, totalPermissions } = useGetPermissions();

  const renderPermissions = permissions?.map(({ id, nameAr, nameEn }: PermissionsData) => {
    const hasAccess = myPermissions.includes(nameEn);
    return (
      <div
        key={id}
        className={`p-5 ${hasAccess ? "bg-green-600" : "bg-primary"} text-white shadow-md rounded-lg flex gap-4 justify-between items-center`}
      >
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{language === "en" ? nameEn : nameAr}</h3>
        </div>
      </div>
    );
  });

  return (
    <div className="sm:p-5 p-3 space-y-5 flex flex-col items-center">
      <Header
        heading={t("header.heading")}
        subtitle={t("header.subtitle")}
      />
      <div className="w-full flex items-center justify-center">
        <InfoPopup
          title={t("infoPopup.title")}
          description={t("infoPopup.description")}
          videoUrl={PERMISSION_VIDEO}
        />
      </div>
      <div className="w-[500px] max-md:w-full">
        <CountCard
          title={t("CountCard.title")}
          description={t("CountCard.description")}
          count={formatValue(totalPermissions, language)}
          icon={<Signature size={28} />}
          bgColor="bg-[#b38e19]"
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-600" />
          <p className="text-sm text-gray-700">{t("yourPermissions")}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <p className="text-sm text-gray-700">{t("notYourPermissions")}</p>
        </div>
      </div>

      {/* Permissions */}
      <div className="flex flex-wrap gap-5 mt-4 w-fit justify-center">
        <HasPermission permission="View Permissions">
          {renderPermissions}
        </HasPermission>
      </div>
    </div>
  );
};

export default ManagePermissionsPage