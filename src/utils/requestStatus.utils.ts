import { VariantProps } from "class-variance-authority";
import { RequestStatusType } from "../enums";
import { StatusBadge } from "../components/ui";

export const getRequestStatusVariant = (
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

export const getRequestBgColorClass = (status: RequestStatusType): string => {
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