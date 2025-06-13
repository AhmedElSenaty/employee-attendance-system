import { RequestStatusType } from "../../../enums";
import { StatusBadge } from "../StatusBadge";
import { FilePenLine, Info, MessageSquare, Eye } from "lucide-react";
import { Button } from "../Button";
import { Tooltip } from "../Tooltip"; // Assuming you have this
import { getRequestBgColorClass, getRequestStatusVariant, truncateText } from "../../../utils";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../store/language.store";
import { IOrdinaryRequestData } from "../../../interfaces";
import { TRANSLATION_NAMESPACE } from "../../../pages/Employee/ordinary-requests";

type Props = {
  data: IOrdinaryRequestData;
  handleShow: (id: number) => void;
  handleEdit: (id: number) => void;
};

const OrdinaryRequestCard = ({ data, handleShow, handleEdit }: Props) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);
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
            {t("ordinaryRequestCard.date", {
              start: new Date(data?.startDate || "").toLocaleDateString(
                language === "ar" ? "ar-EG" : "en-CA"
              ),
              end: new Date(data?.endDate || "").toLocaleDateString(
                language === "ar" ? "ar-EG" : "en-CA"
              ),
            })}
          </h3>

          <p className="text-base text-gray-500">
            {t("ordinaryRequestCard.requestedAt")}{" "}
            {new Date(data?.requestedAt || "").toLocaleDateString(
              language === "ar" ? "ar-EG" : "en-CA"
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
          content={t("ordinaryRequestCard.toolTipViewButton")}
          placement="top"
        >
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleShow(data.id)}
            icon={<Eye className="w-full h-full" />}
          />
        </Tooltip>
        {data.status == RequestStatusType.Pending && (
          <Tooltip
            content={t("ordinaryRequestCard.toolTipEditButton")}
            placement="top"
          >
            <Button
              variant="info"
              size="sm"
              onClick={() => handleEdit(data.id)}
              icon={<FilePenLine className="w-full h-full" />}
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default OrdinaryRequestCard;
