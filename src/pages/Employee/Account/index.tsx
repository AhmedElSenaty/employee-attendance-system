import { useTranslation } from "react-i18next";
import { useFetchMe } from "../../../hooks/";
import { Header, SectionHeader } from "../../../components/ui";
import { UpdateInformationSection, UpdateImageSection, UpdatePasswordSection } from "./views";
import { EMPLOYEE_PROFILE_NS } from "../../../constants";

const EmpolyeeAccountPage = () => {
  const { me } = useFetchMe();
  const { t } = useTranslation([EMPLOYEE_PROFILE_NS]);


  return (
    <div className="sm:p-6 p-4 space-y-5">
      <Header
        heading={t(`header.heading`)}
        subtitle={t(`header.subtitle`)}
      />

      <div className="w-full max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-6 sm:p-8 transition-all duration-300 ease-in-out hover:shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
            <img
              src={me?.profileImage ?? "/images/default-user-image.webp"}
              alt="User Avatar"
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>

          {/* User Details */}
          <div className="flex-1 space-y-3 text-center sm:text-right">
            <h1 className="text-2xl font-bold text-gray-900">{me?.fullName}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
              <p><span className="font-medium">{t("columns.hiringDate")}:</span> {me?.hiringDate}</p>
              <p><span className="font-medium">{t("columns.dateOfBirth")}:</span> {me?.dateOfBirth}</p>
              <p><span className="font-medium">{t("columns.phoneNumber")}:</span> {me?.phoneNumber == null ? t("table.NA"): me.phoneNumber}</p>
              <p><span className="font-medium">{t("columns.department")}:</span> {me?.departmentName}, {me?.subDepartmentName}</p>
              <p><span className="font-medium">{t("columns.delegate")}:</span> {me?.delegeteName}, {me?.delegeteSubDepartmentName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Information Section */}
      <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
        <SectionHeader
          title={t(`updateSection.title`)}
          description={t(`updateSection.description`)}
        />

        <UpdateImageSection />
        
        <UpdateInformationSection employeeData={me} /> 
      </div>

      {/* Update Password Form */}
      <UpdatePasswordSection />
    </div>
  );
};

export default EmpolyeeAccountPage;
