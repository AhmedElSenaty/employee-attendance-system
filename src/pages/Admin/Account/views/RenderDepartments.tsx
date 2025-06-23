import { useTranslation } from "react-i18next";
import { SectionHeader } from "../../../../components/ui";
import { ADMIN_ACCOUNT_PAGE } from "../../../../constants";

interface IProps {
  departments: []
}

const RenderDepartments = ({ departments = [] }: IProps) => {
  const { t } = useTranslation([ADMIN_ACCOUNT_PAGE]);

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
    <div className="bg-white shadow-md space-y-5 p-5 rounded-lg w-full">
      <SectionHeader
        title={t(`departmentsSection.title`)}
        description={t(`departmentsSection.description`)}
      />
      <div className="flex flex-wrap gap-5 mt-4 w-fit">{renderDepartments}</div>
    </div>
  )
}

export default RenderDepartments
