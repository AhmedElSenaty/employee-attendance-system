/**
 * Enum representing the status of a leave request.
 *
 * @enum {number}
 * @property {number} Pending - The request has been submitted and is awaiting review.
 * @property {number} Accepted - The request has been reviewed and approved.
 * @property {number} Rejected - The request has been reviewed and denied.
 * @property {number} Ignored - The request was neither accepted nor rejected, and has been ignored.
 */
export enum RequestStatusType {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Ignored = 3,
  AssignedManually = 4,
  Deleted = 5,
  Edited = 6,
}
