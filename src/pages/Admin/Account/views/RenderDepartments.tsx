import { useTranslation } from "react-i18next";
import { Collapsible, SectionHeader } from "../../../../components/ui";

const TRANSLATION_NAMESPACE = "adminAccount";

interface IProps {
  departments: []
}

const RenderDepartments = ({ departments = [] }: IProps) => {
  const { t } = useTranslation(["common", TRANSLATION_NAMESPACE]);

  // Render departments dynamically
  const renderDepartments = departments.map((department: string, index: number) => (
    <div
      key={index}
      className="p-3 bg-primary text-white shadow-md rounded-lg flex gap-4 justify-between items-center"
    >
      <div className="flex-1">
        <h3 className="text-base font-semibold">{department}</h3>
      </div>
    </div>
  ));

  return (
      <Collapsible title={"Departments"} open={true}>
        <SectionHeader
          title={t(`profile.departmentsSection.title`, { ns: TRANSLATION_NAMESPACE })}
          description={t(`profile.departmentsSection.description`, { ns: TRANSLATION_NAMESPACE })}
        />
        <div className="flex flex-wrap gap-5 mt-4 w-fit">{renderDepartments}</div>
      </Collapsible>
  )
}

export default RenderDepartments
