import React from "react";
import { Button } from "../Button";
import { StatusBadge } from "../StatusBadge";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { EMPLOYEE_TRANSLATION_NAMESPACE } from "../../../pages/common/manage-employees";
import { NavLink } from "react-router";
import { IEmployeeData } from "../../../interfaces";
import { useUserStore } from "../../../store/user.store";

type UserProps = {
  user: IEmployeeData;
};

const UserProfileCard: React.FC<UserProps> = ({ user }) => {
  const { t } = useTranslation(["common", EMPLOYEE_TRANSLATION_NAMESPACE]);
  const userRole = useUserStore((state) => state.role);

  return (
    <div className="max-w-[1000px] h-fit mx-auto bg-white shadow rounded-lg overflow-hidden flex flex-wrap items-center justify-center gap-4 p-6 space-x-6">
      <img
        src={user.profileImage || "/images/default-user-image.webp"}
        alt="Profile"
        className="w-40 h-full rounded-xl object-cover border"
      />

      <div className="flex-1 space-y-2">
        <div className="flex justify-between flex-wrap items-start">
          <div>
            <h2 className="text-xl font-semibold">{user.fullName}</h2>
            <p className="text-gray-500">{user.departmentName}, {user.subDepartmentName}</p>
          </div>
          <NavLink to={`/${userRole}/edit-employee/${user.id}`}>
            <Button variant={"info"} size={"md"}>
              {t("buttons.edit")} 
            </Button>
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <p><span className="font-medium">{t("manageEmployeesPage.table.columns.email", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}:</span> {user.email}</p>
          <p><span className="font-medium">{t("manageEmployeesPage.table.columns.username", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}:</span> {user.username}</p>
          <p><span className="font-medium">{t("manageEmployeesPage.table.columns.phoneNumber", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}:</span> {user.phoneNumber ?? "N/A"}</p>
          <p><span className="font-medium">{t("manageEmployeesPage.table.columns.ssn", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}:</span> {user.ssn}</p>
          <p><span className="font-medium">{t("manageEmployeesPage.table.columns.dateOfBirth", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}:</span> {user.dateOfBirth}</p>
          <p><span className="font-medium">{t("manageEmployeesPage.table.columns.hiringDate", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}:</span> {user.hiringDate}</p>
          <p><span className="font-medium">{t("manageEmployeesPage.table.columns.delegateDepartmentName", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}:</span> {user.delegeteName}</p>
          <p><span className="font-medium">{t("manageEmployeesPage.table.columns.delegateSubDepartmentName", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}:</span> {user.delegeteSubDepartmentName}</p>
        </div>

        <div className="flex space-x-8 pt-4 text-center">
          <div className="block">
          <p className="text-gray-400 text-sm mb-2">{t("manageEmployeesPage.table.columns.accountStatus", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</p>
            <StatusBadge
              variant={user.isActive ? "success" : "warning"}
              size="medium"
              icon={user.isActive ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            >
              {user.isActive
                ? t("manageEmployeesPage.table.status.active", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })
                : t("manageEmployeesPage.table.status.notActive", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
            </StatusBadge>
          </div>
            <div className="block">
              <p className="text-gray-400 text-sm mb-2">{t("manageEmployeesPage.table.columns.isBlocked", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}</p>
              <StatusBadge
                variant={user.isBlocked ? "neutral" : "info"}
                size="medium"
                icon={user.isActive ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              >
                {user.isActive
                  ? t("manageEmployeesPage.table.status.blocked", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })
                  : t("manageEmployeesPage.table.status.active", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
              </StatusBadge>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
