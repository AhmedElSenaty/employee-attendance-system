import { useTranslation } from "react-i18next";

interface AttendanceCardProps {
  avatarUrl: string;
  name: string;
  role: string;
  type: string;
  loginTime: string | null;
  logoutTime: string | null;
  bgColor: string
}

const AttendanceCard = ({
  avatarUrl,
  name,
  role,
  type,
  loginTime,
  logoutTime,
  bgColor = ""
}: AttendanceCardProps) => {
  
  const { t } = useTranslation(["common", "dashboard"]);
  
  return (
    <div className={`flex items-start justify-between border-1 border-[#272727] ${bgColor} p-4 rounded-xl shadow w-full`}>
      {/* Left side: avatar + info */}
      <div className="flex items-start space-x-4">
        <img
          src={avatarUrl}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h2 className="text-base font-semibold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-500">
            {role} <span className="mx-1">|</span> {type}
          </p>
          {
            loginTime != "" &&
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-medium">{t("login", { ns: "dashboard" })}</span> – {loginTime}
            </p>
          }
          {
            logoutTime != "" &&
            <p className="text-sm text-gray-700">
              <span className="font-medium">{t("logout", { ns: "dashboard" })}</span> – {logoutTime}
            </p>
          }
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;
