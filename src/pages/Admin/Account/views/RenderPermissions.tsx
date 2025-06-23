import { useTranslation } from "react-i18next";
import { SectionHeader } from "../../../../components/ui";
import { PermissionsData } from "../../../../interfaces";
import { useLanguageStore } from "../../../../store/language.store";
import { ADMIN_ACCOUNT_PAGE } from "../../../../constants";

interface IProps {
  permissions: []
}

const RenderPermissions = ({ permissions = [] }: IProps) => {
  const { t } = useTranslation([ADMIN_ACCOUNT_PAGE]);
  const { language } = useLanguageStore();

  // Render permissions dynamically
  const renderPermissions = permissions?.map(({ id, nameAr, nameEn }: PermissionsData) => (
    <div
      key={id}
      className="p-3 bg-green-600 text-white shadow-md rounded-lg flex gap-4 justify-between items-center"
    >
      <div className="flex-1">
        <h3 className="text-base font-semibold">{language === "en" ? nameEn : nameAr}</h3>
      </div>
    </div>
  ));

  return (
    <div className="bg-white shadow-md space-y-5 p-5 rounded-lg w-full">
      <SectionHeader
        title={t(`permissionsSection.title`)}
        description={t(`permissionsSection.description`)}
      />
      <div className="flex flex-wrap gap-5 mt-4 w-fit">{renderPermissions}</div>
    </div>
  )
}

export default RenderPermissions
