import { useTranslation } from "react-i18next";
import { Collapsible, SectionHeader } from "../../../../components/ui";
import { IPermissionsData } from "../../../../interfaces";
import { useLanguageStore } from "../../../../store/language.store";

const TRANSLATION_NAMESPACE = "adminAccount";

interface IProps {
  permissions: []
}

const RenderPermissions = ({ permissions = [] }: IProps) => {
  const { t } = useTranslation(["common", TRANSLATION_NAMESPACE]);
  const { language } = useLanguageStore();

  // Render permissions dynamically
  const renderPermissions = permissions?.map(({ id, nameAr, nameEn }: IPermissionsData) => (
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
    <Collapsible title={"Permissions"} open={true}>
    <SectionHeader
      title={t(`profile.permissionsSection.title`, { ns: TRANSLATION_NAMESPACE })}
      description={t(`profile.permissionsSection.description`, { ns: TRANSLATION_NAMESPACE })}
    />
    <div className="flex flex-wrap gap-5 mt-4 w-fit">{renderPermissions}</div>
  </Collapsible>
  )
}

export default RenderPermissions
