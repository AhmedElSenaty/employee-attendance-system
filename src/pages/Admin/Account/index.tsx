import { Header } from "../../../components/ui";
import { useTranslation } from "react-i18next";
import { RenderDepartments, RenderPermissions, UpdateInformationsSection, UpdatePasswordSection } from "./views";
import { useFetchMe } from "../../../hooks";
import { ADMIN_ACCOUNT_PAGE } from "../../../constants";

const AdminAccountPage = () => {
  const { me } = useFetchMe();
  const { t } = useTranslation([ADMIN_ACCOUNT_PAGE]);



  return (
    <div className="sm:p-5 p-3 space-y-5">
      <Header
        heading={t(`header.heading`)}
        subtitle={t(`header.subtitle`)}
      />

      <UpdateInformationsSection informations={me} />

      <UpdatePasswordSection />

      <RenderDepartments departments={me?.departments} />
      
      <RenderPermissions permissions={me?.permissions} />
    </div>
  );
};

export default AdminAccountPage;
