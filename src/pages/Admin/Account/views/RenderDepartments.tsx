import { useTranslation } from "react-i18next";
import { SectionHeader } from "../../../../components/ui";
import { ADMIN_ACCOUNT_PAGE } from "../../../../constants";

interface IProps {
  departments: string[];
}

const RenderDepartments = ({ departments = [] }: IProps) => {
  const { t } = useTranslation([ADMIN_ACCOUNT_PAGE]);

  return (
    <div className="bg-white shadow-md space-y-5 p-5 rounded-lg w-full">
      <SectionHeader
        title={t(`departmentsSection.title`)}
        description={t(`departmentsSection.description`)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border border-black">
        {departments.map((department: string, index: number) => (
          <div
            key={index}
            className="border border-black px-4 py-2 text-center"
          >
            {department}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenderDepartments;
