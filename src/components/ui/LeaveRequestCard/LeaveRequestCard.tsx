import { VariantProps } from "class-variance-authority";
import { LeaveRequestStatusType, LeaveRequestTimeType } from "../../../enums";
import { ILeaveRequestData } from "../../../interfaces/leaveRequest.interfaces";
import { StatusBadge } from "../StatusBadge";
import { Clock, FilePenLine, Info, MessageSquare, Eye } from "lucide-react";
import { Button } from "../Button";
import { Tooltip } from "../Tooltip";  // Assuming you have this
import { truncateText } from "../../../utils";

type Props = {
  data: ILeaveRequestData;
  handleShow: (id: number) => void;
  handleEdit: (id: number) => void;
};

const LeaveRequestCard = ({ data, handleShow, handleEdit }: Props) => {
  const getStatusVariant = (
    status: LeaveRequestStatusType
  ): VariantProps<typeof StatusBadge>["variant"] => {
    switch (status) {
      case LeaveRequestStatusType.Accepted:
        return "success";
      case LeaveRequestStatusType.Rejected:
        return "error";
      case LeaveRequestStatusType.Ignored:
        return "neutral";
      case LeaveRequestStatusType.Pending:
      default:
        return "warning";
    }
  };

  const getStatusLabel = (status: LeaveRequestStatusType): string => {
    switch (status) {
      case LeaveRequestStatusType.Accepted:
        return "Accepted";
      case LeaveRequestStatusType.Rejected:
        return "Rejected";
      case LeaveRequestStatusType.Ignored:
        return "Ignored";
      case LeaveRequestStatusType.Pending:
      default:
        return "Pending";
    }
  };

  const getTimeLabel = (type: LeaveRequestTimeType): string => {
    return type === LeaveRequestTimeType.Morning ? "Morning Permit" : "Evening Permit";
  };

  const getBgColorClass = (status: LeaveRequestStatusType): string => {
    switch (status) {
      case LeaveRequestStatusType.Accepted:
        return "bg-green-50";
      case LeaveRequestStatusType.Rejected:
        return "bg-red-50";
      case LeaveRequestStatusType.Ignored:
        return "bg-gray-100";
      case LeaveRequestStatusType.Pending:
      default:
        return "bg-yellow-50";
    }
  };

  return (
    <div
      className={`w-full sm:w-[450px] min-h-[220px] rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 space-y-4
      ${getBgColorClass(data.status)}
      `}
    >
      {/* Header: Date and Status */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Leave on <span className="text-gray-900">{data.date}</span>
          </h3>
          <p className="text-base text-gray-500">Requested at {data.requestedAt}</p>
        </div>
        <StatusBadge
          variant={getStatusVariant(data.status)}
          size="medium"
          shape="rounded"
        >
          {getStatusLabel(data.status)}
        </StatusBadge>
      </div>

      {/* Info Section */}
      <div className="space-y-3 text-base text-gray-700">
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
          <span className="text-gray-800">{getTimeLabel(data.type)}</span>
        </div>

        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-gray-500 mt-0.5" />
          <span className="text-gray-800">{truncateText(data.description, 40)}</span>
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
        <Tooltip content="View Leave Request Details" placement="top">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleShow(data.id)}
            icon={<Eye className="w-full h-full" />}
          />
        </Tooltip>
        {data.status == LeaveRequestStatusType.Pending &&
          <Tooltip content="Edit Leave Request" placement="top">
            <Button
              variant="info"
              size="sm"
              onClick={() => handleEdit(data.id)}
              icon={<FilePenLine className="w-full h-full" />}
            />
          </Tooltip>
        }
      </div>
    </div>
  );
};

export default LeaveRequestCard;
