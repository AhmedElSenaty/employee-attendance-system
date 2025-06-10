import { VariantProps } from "class-variance-authority";
import { RequestStatusType } from "../../../enums";
import { ILeaveRequestData } from "../../../interfaces/leaveRequest.interfaces";
import { StatusBadge } from "../StatusBadge";
import { Clock, FilePenLine, Info, MessageSquare, Eye } from "lucide-react";
import { Button } from "../Button";
import { Tooltip } from "../Tooltip"; // Assuming you have this
import { truncateText } from "../../../utils";
import { TRANSLATION_NAMESPACE } from "../../../pages/Employee";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../store/language.store";

type Props = {
  data: ILeaveRequestData;
  handleShow: (id: number) => void;
  handleEdit: (id: number) => void;
};

const LeaveRequestCard = ({ data, handleShow, handleEdit }: Props) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);
  const { language } = useLanguageStore();

  const getStatusVariant = (
    status: RequestStatusType
  ): VariantProps<typeof StatusBadge>["variant"] => {
    switch (status) {
      case RequestStatusType.Accepted:
        return "success";
      case RequestStatusType.Rejected:
        return "error";
      case RequestStatusType.Ignored:
        return "neutral";
      case RequestStatusType.Pending:
      default:
        return "warning";
    }
  };

  const getBgColorClass = (status: RequestStatusType): string => {
    switch (status) {
      case RequestStatusType.Accepted:
        return "bg-green-50";
      case RequestStatusType.Rejected:
        return "bg-red-50";
      case RequestStatusType.Ignored:
        return "bg-gray-100";
      case RequestStatusType.Pending:
      default:
        return "bg-yellow-50";
    }
  };

  return (
    <div
      className={`w-full sm:w-[450px] min-h-[220px] rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 space-y-4
      ${getBgColorClass(data.status)}`}
    >
      {/* Header: Date and Status */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {t("leaveRequestCard.leaveOn")}{" "}
            <span className="text-gray-900">
              {new Date(data?.date || "").toLocaleDateString(
                language === "ar" ? "ar-EG" : "en-CA"
              )}
            </span>
          </h3>
          <p className="text-base text-gray-500">
            {t("leaveRequestCard.requestedAt")}{" "}
            {new Date(data?.requestedAt || "").toLocaleDateString(
              language === "ar" ? "ar-EG" : "en-CA"
            )}
          </p>
        </div>
        <StatusBadge
          variant={getStatusVariant(data.status)}
          size="medium"
          shape="rounded"
        >
          {t(`status.${data.status as number}`)}
        </StatusBadge>
      </div>

      {/* Info Section */}
      <div className="space-y-3 text-base text-gray-700">
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
          <span className="text-gray-800">
            {t(`timeType.${data.type as number}`)}
          </span>
        </div>

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
          content={t("leaveRequestCard.toolTipViewButton")}
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
            content={t("leaveRequestCard.toolTipEditButton")}
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

export default LeaveRequestCard;
