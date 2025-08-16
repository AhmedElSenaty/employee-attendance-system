// components/RecentRequestsCard.tsx

import { useTranslation } from "react-i18next";
import { useRecentRequests } from "../../hooks/request.hook";

// type Props = {
//   startDate?: string;
//   endDate?: string;
//   topN?: number;
// };

const statusClasses: Record<string, string> = {
  accepted: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
};

// export default function RecentRequestsCard({
//   startDate,
//   endDate,
//   topN = 5,
// }: Props) {
//   const { recentRequests, isLoading, isError, error } = useRecentRequests({
//     startDate,
//     endDate,
//     topN,
//   });
export default function RecentRequestsCard() {
  const { t } = useTranslation("dashboard");
  const { recentRequests, isLoading } = useRecentRequests();

  return (
    <div className="bg-white rounded-lg p-5 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {t("recentTitle")}
      </h3>

      {isLoading && <p>{t("recent.Loading")}</p>}

      {!isLoading && recentRequests.length === 0 && (
        <div className="text-sm text-gray-600">{t("recent.Empty")}</div>
      )}

      {!isLoading && recentRequests.length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {recentRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-800">{request.employee}</p>
                <p className="text-sm text-gray-600">{request.department}</p>
                <p className="text-sm text-gray-600">
                  {t(`leaveType.${request.type}`)}• {request.days}{" "}
                  {request.days === 1 ? t("day") : t("days")}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600">{request.date}</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusClasses[request.status] ?? "bg-gray-100 text-gray-800"
                  }`}
                >
                  {t(`status.${request.status}`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
