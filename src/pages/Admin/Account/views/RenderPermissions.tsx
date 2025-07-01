import { useTranslation } from "react-i18next";
import { SectionHeader } from "../../../../components/ui";
import { PermissionsData } from "../../../../interfaces";
import { useLanguageStore } from "../../../../store/language.store";
import { ADMIN_ACCOUNT_PAGE } from "../../../../constants";

interface IProps {
  permissions: PermissionsData[];
}

const RenderPermissions = ({ permissions = [] }: IProps) => {
  const { t } = useTranslation([ADMIN_ACCOUNT_PAGE]);
  const { language } = useLanguageStore();

  return (
    <div className="bg-white shadow-md space-y-5 p-5 rounded-lg w-full">
      <SectionHeader
        title={t(`permissionsSection.title`)}
        description={t(`permissionsSection.description`)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border border-black">
        {permissions.map(({ id, nameAr, nameEn }) => (
          <div
            key={id}
            className="border border-black px-4 py-2 text-center"
          >
            {language === "en" ? nameEn : nameAr}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenderPermissions;
