import { RequestStatusType } from "../../../enums";
import { StatusBadge } from "../StatusBadge";
import { FilePenLine, Info, MessageSquare, Eye } from "lucide-react";
import { Button } from "../Button";
import { Tooltip } from "../Tooltip"; // Assuming you have this
import {
  formatValue,
  getRequestBgColorClass,
  getRequestStatusVariant,
  truncateText,
} from "../../../utils";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../store/language.store";
import { ISickRequestData } from "../../../interfaces";
import { SICK_REQUESTS_NS } from "../../../constants";

type Props = {
  data: ISickRequestData;
  handleShow: (id: number) => void;
  handleEdit: (id: number) => void;
};

const SickRequestCard = ({ data, handleShow, handleEdit }: Props) => {
  const { t } = useTranslation(SICK_REQUESTS_NS);
  const { language } = useLanguageStore();

  return (
    <div
      className={`w-full sm:w-[600px] min-h-[220px] rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 space-y-4
      ${getRequestBgColorClass(data.status)}`}
    >
      {/* Header: Date and Status */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {t("sickRequestCard.numberOfDays", {
              number: formatValue(data?.numberOfDays),
            })}
          </h3>

          <p className="text-base text-gray-500">
            {t("sickRequestCard.startDate")}{" "}
            {new Date(data?.startDate || "").toLocaleDateString(
              language === "ar" ? "ar-EG" : "en-CA"
            )}
          </p>

          <p className="text-base text-gray-500">
            {t("sickRequestCard.endDate")}{" "}
            {new Date(data?.endDate || "").toLocaleDateString(
              language === "ar" ? "ar-EG" : "en-CA"
            )}
          </p>

          <p className="text-base text-gray-500">
            {t("sickRequestCard.requestedAt")}{" "}
            {new Date(data?.requestedAt || "").toLocaleString(
              language === "ar" ? "ar-EG" : "en-CA",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
          </p>
        </div>
        <StatusBadge
          variant={getRequestStatusVariant(data.status)}
          size="medium"
          shape="rounded"
        >
          {t(`status.${data.status as number}`)}
        </StatusBadge>
      </div>

      {/* Info Section */}
      <div className="space-y-3 text-base text-gray-700">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-gray-500 mt-0.5" />
          <span className="text-gray-800">
            {truncateText(data.description, 40)}
          </span>
        </div>

        {data.comment && (
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
            <span className="italic text-gray-600">{data.comment}</span>
          </div>
        )}
      </div>

      {/* Action Buttons with Tooltips */}
      <div className="flex gap-3 justify-end">
        <Tooltip
          content={t("sickRequestCard.toolTipViewButton")}
          placement="top"
        >
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleShow(data.requestId)}
            icon={<Eye className="w-full h-full" />}
          />
        </Tooltip>
        {data.status == RequestStatusType.Pending && (
          <Tooltip
            content={t("sickRequestCard.toolTipEditButton")}
            placement="top"
          >
            <Button
              variant="info"
              size="sm"
              onClick={() => handleEdit(data.requestId)}
              icon={<FilePenLine className="w-full h-full" />}
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default SickRequestCard;
