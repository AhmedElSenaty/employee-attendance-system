import React from "react";
import { Button } from "../Button";
import { StatusBadge } from "../StatusBadge";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { EmployeeData } from "../../../interfaces";
import { useUserStore } from "../../../store/user.store";
import { EMPLOYEE_NS } from "../../../constants";

type UserProps = {
  user: EmployeeData;
};

const UserProfileCard: React.FC<UserProps> = ({ user }) => {
  const { t } = useTranslation([EMPLOYEE_NS]);

  const userRole = useUserStore((state) => state.role);
  console.log(user);
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
          <p><span className="font-medium">{t("table.columns.email")}:</span> {user.email}</p>
          <p><span className="font-medium">{t("table.columns.username")}:</span> {user.username}</p>
          <p><span className="font-medium">{t("table.columns.phoneNumber")}:</span> {user.phoneNumber ?? "N/A"}</p>
          <p><span className="font-medium">{t("table.columns.ssn")}:</span> {user.ssn}</p>
          <p><span className="font-medium">{t("table.columns.dateOfBirth")}:</span> {user.dateOfBirth}</p>
          <p><span className="font-medium">{t("table.columns.hiringDate")}:</span> {user.hiringDate}</p>
          <p><span className="font-medium">{t("table.columns.delegateDepartmentName")}:</span> {user.delegeteName}</p>
          <p><span className="font-medium">{t("table.columns.delegateSubDepartmentName")}:</span> {user.delegeteSubDepartmentName}</p>
        </div>

        <div className="flex space-x-8 pt-4 text-center">
          <div className="block">
          <p className="text-gray-400 text-sm mb-2">{t("table.columns.accountStatus")}</p>
            <StatusBadge
              variant={user.isActive ? "success" : "warning"}
              size="medium"
              icon={user.isActive ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            >
              {user.isActive
                ? t("table.status.active")
                : t("table.status.notActive")}
            </StatusBadge>
          </div>
            <div className="block">
              <p className="text-gray-400 text-sm mb-2">{t("table.columns.isBlocked")}</p>
              <StatusBadge
                variant={user.isBlocked ? "neutral" : "info"}
                size="medium"
                icon={user.isBlocked ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              >
                {user.isBlocked
                  ? t("table.status.blocked")
                  : t("table.status.active")}
              </StatusBadge>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
