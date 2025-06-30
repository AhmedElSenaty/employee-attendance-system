import { JSX, useState } from "react";
import { Info, Edit3, Trash2, AlertCircle } from "lucide-react";
import { LogType } from "../../../enums";
import { cva } from "class-variance-authority";
import { Log } from "../../../interfaces/";
import { useLanguageStore } from "../../../store";
import { formatValue } from "../../../utils";
import { LOGS_NS } from "../../../constants";
import { useTranslation } from "react-i18next";

interface LogItemProps {
  logData: Log;
}

const cardStyles = cva(
  "border p-4 shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer rounded-md",
  {
    variants: {
      type: {
        [LogType.Create]: "bg-blue-50 border-blue-300 text-blue-900",
        [LogType.Update]: "bg-yellow-50 border-yellow-300 text-yellow-900",
        [LogType.Delete]: "bg-red-50 border-red-300 text-red-900",
        [LogType.Error]: "bg-rose-50 border-rose-300 text-rose-900",
      },
    },
    defaultVariants: {
      type: LogType.Create,
    },
  }
);

const logTypeIcons: Record<LogType, JSX.Element> = {
  [LogType.Create]: <Info className="w-8 h-8 text-blue-700" />,
  [LogType.Update]: <Edit3 className="w-8 h-8 text-yellow-700" />,
  [LogType.Delete]: <Trash2 className="w-8 h-8 text-red-700" />,
  [LogType.Error]: <AlertCircle className="w-8 h-8 text-rose-700" />,
};

const LogItem = ({ logData }: LogItemProps) => {
  const [collapsed, setCollapsed] = useState(true);
  const { t } = useTranslation([LOGS_NS]);
  const { language } = useLanguageStore();

  return (
    <div
      className={cardStyles({ type: logData.type })}
      onClick={() => setCollapsed((prev) => !prev)}
      aria-expanded={!collapsed}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setCollapsed((prev) => !prev);
        }
      }}
    >
      <div className="flex items-start gap-4">
        <div className="pt-1">{logTypeIcons[logData.type]}</div>
        <div className="flex-1 space-y-2">
          <h2 className="font-bold text-xl leading-tight">
            [{formatValue(logData.id, language)}] {logData.action}
          </h2>

          <div className="text-base text-gray-800 space-y-1">
            {logData.userID !== null ? (
              <p>
                <span className="font-bold">{t("userId")}:</span> {logData.userID}
              </p>
            ) : null}
            {logData.userName !== null ? (
              <p>
                <span className="font-bold">{t("userName")}:</span> {logData.userName}
              </p>
            ): null}
            <p>
              <span className="font-bold">{t("ipAddress")}:</span> {logData.ipAddress}
            </p>
            <p>
              <span className="font-bold">{t("logType")}:</span> {t(`types.${logData.type}`)}
            </p>
            <p>
              <span className="font-bold">{t("timestamp")}:</span>{" "}
              {new Date(logData.timeStamp).toLocaleString()}
            </p>
            <div>
              <p className="font-bold mb-1">{t("message")}:</p>
              {!collapsed && (
                <pre className="text-right font-cario whitespace-pre-wrap bg-gray-100 p-3 rounded-md text-base leading-relaxed text-gray-900">
                  {logData.message}
                </pre>
              )}
              {collapsed && (
                <p className="text-sm text-blue-600 font-semibold italic cursor-pointer">({t("click")})</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogItem
