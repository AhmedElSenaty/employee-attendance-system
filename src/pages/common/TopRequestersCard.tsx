// components/TopRequestersCard.tsx

import { useTranslation } from "react-i18next";
import { useGetTopRequesters } from "../../hooks/request.hook";

// type Props = {
//   startDate?: string;
//   endDate?: string;
//   topN?: number;
// };

// export default function TopRequestersCard({
//   startDate,
//   endDate,
//   topN = 5,
// }: Props) {
//   const { topRequesters, isLoading, isError, error } = useGetTopRequesters({
//     startDate,
//     endDate,
//     topN,
//   });

export default function TopRequestersCard() {
  const { topRequesters, isLoading } = useGetTopRequesters();
  const { t } = useTranslation(["dashboard"]);
  return (
    <div className="bg-white rounded-lg p-5 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("title")}</h3>

      {isLoading && <p>{t("loading")}</p>}

      {!isLoading && topRequesters.length === 0 && (
        <div className="text-sm text-gray-600">{t("empty")}</div>
      )}

      {!isLoading && topRequesters.length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {topRequesters.map((requester, index) => (
            <div
              key={`${requester.name}-${index}`}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-800">{requester.name}</p>
                <p className="text-sm text-gray-600">{requester.department}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  {requester.requests}{" "}
                  {requester.requests === 1 ? t("request") : t("requests")}
                </p>
                <p className="text-sm text-green-600">
                  {requester.accepted} {t("accepted")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
