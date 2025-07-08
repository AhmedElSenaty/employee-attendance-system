import { RequestStatusType } from "../enums";
import { StatusBadgeType } from "../types/statusBadge.types";

/**
 * Maps a `RequestStatusType` to the corresponding visual variant of the `StatusBadge` component.
 *
 * @param status - The request status value (Accepted, Rejected, Ignored, etc.).
 * @returns A string representing the visual variant for the badge (e.g., "success", "error").
 */
export const getRequestStatusVariant = (
  status: RequestStatusType
): StatusBadgeType => {
  switch (status) {
    case RequestStatusType.Accepted:
      return "success";
    case RequestStatusType.Rejected:
      return "warning";
    case RequestStatusType.Ignored:
      return "neutral";
    case RequestStatusType.AssignedManually:
      return "info";
    case RequestStatusType.Deleted:
      return "error";
    case RequestStatusType.Pending:
    default:
      return "warning";
  }
};

/**
 * Returns a Tailwind CSS background color class based on the request status.
 *
 * @param status - The request status value (Accepted, Rejected, Ignored, etc.).
 * @returns A Tailwind CSS class for background color.
 */
export const getRequestBgColorClass = (status: RequestStatusType): string => {
  switch (status) {
    case RequestStatusType.Accepted:
      return "bg-green-50";
    case RequestStatusType.Rejected:
      return "bg-red-50";
    case RequestStatusType.Ignored:
      return "bg-gray-100";
    case RequestStatusType.AssignedManually:
      return "bg-blue-50";
    case RequestStatusType.Deleted:
      return "bg-black/5";
    case RequestStatusType.Pending:
    default:
      return "bg-yellow-50";
  }
};
