import { useTranslation } from "react-i18next";
import { Header } from "../../../components/ui/Header";
import { RootState } from "../../../context/store";
import { useSelector } from "react-redux";
import { CountCard } from "../../../components/ui/CountCard";
import { formatValue } from "../../../utils";
import { Signature } from "lucide-react";
import { IPermissionsData } from "../../../interfaces";
import { useGetAllPermissions } from "../../../hooks/usePermissionHook";
import { HasPermission } from "../../../components/auth";
import { selectPermissions } from "../../../context/slices/userSlice";

export const PERMISSION_TRANSLATION_NAMESPACE = "permissionPages";

export const ManagePermissionsPage = () => {
  const { t } = useTranslation(["common", PERMISSION_TRANSLATION_NAMESPACE]);
  const { language } = useSelector((state: RootState) => state.language);
  const { permissions, totalPermissions } = useGetAllPermissions();
  const myPermissions = useSelector(selectPermissions);

  const renderPermissions = permissions?.map(({ id, nameAr, nameEn }: IPermissionsData) => {
    const hasAccess = myPermissions.includes(nameEn); // Adjust based on how your permission matching works
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
        heading={t("header.heading", { ns: PERMISSION_TRANSLATION_NAMESPACE })}
        subtitle={t("header.subtitle", { ns: PERMISSION_TRANSLATION_NAMESPACE })}
      />
      <div className="w-[500px] max-md:w-full">
        <CountCard
          title={t("CountCard.title", { ns: PERMISSION_TRANSLATION_NAMESPACE })}
          description={t("CountCard.description", { ns: PERMISSION_TRANSLATION_NAMESPACE })}
          count={formatValue(totalPermissions, language)}
          icon={<Signature size={28} />}
          bgColor="bg-[#b38e19]"
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-600" />
          <p className="text-sm text-gray-700">{t("yourPermissions", { ns: PERMISSION_TRANSLATION_NAMESPACE })}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <p className="text-sm text-gray-700">{t("notYourPermissions", { ns: PERMISSION_TRANSLATION_NAMESPACE })}</p>
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
