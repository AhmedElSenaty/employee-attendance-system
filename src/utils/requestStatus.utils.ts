import { RequestStatusType } from "../enums";
import { StatusBadgeType } from "../types/statusBadge.types";

/**
 * Maps a `RequestStatusType` to the corresponding visual variant of the `StatusBadge` component.
 *
 * @param status - The request status value (Accepted, Rejected, Ignored, or Pending).
 * @returns A string representing the visual variant for the badge (e.g., "success", "error").
 *
 * @example
 * getRequestStatusVariant(RequestStatusType.Accepted); // "success"
 */
export const getRequestStatusVariant = (
  status: RequestStatusType
): StatusBadgeType => {
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

/**
 * Returns a Tailwind CSS background color class based on the request status.
 *
 * @param status - The request status value (Accepted, Rejected, Ignored, or Pending).
 * @returns A Tailwind CSS class for background color.
 *
 * @example
 * getRequestBgColorClass(RequestStatusType.Rejected); // "bg-red-50"
 */
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
