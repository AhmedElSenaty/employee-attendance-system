/**
 * Enum representing the time of day for a leave request.
 * 
 * @enum {number}
 * @property {number} Morning - Leave requested for the morning.
 * @property {number} Evening - Leave requested for the evening.
 */
export enum LeaveRequestTimeType {
  Morning = 0,
  Evening = 1,
}

/**
 * Enum representing the status of a leave request.
 * 
 * @enum {number}
 * @property {number} Pending - The request has been submitted and is awaiting review.
 * @property {number} Accepted - The request has been reviewed and approved.
 * @property {number} Rejected - The request has been reviewed and denied.
 * @property {number} Ignored - The request was neither accepted nor rejected, and has been ignored.
 */
export enum LeaveRequestStatusType {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
  Ignored = 3,
}
