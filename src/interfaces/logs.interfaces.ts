import { LogType } from "../enums";

/**
 * Interface representing the structure of a log entry.
 */
export interface ILogData {
  /** Unique identifier of the log entry */
  id: number;

  /** ID of the user who performed the action */
  userID: string;

  /** Type of log entry (e.g., Create, Update, Delete, Error) */
  type: LogType;

  /** Description of the action performed */
  action: string;

  /** Timestamp when the log was created (ISO string) */
  timeStamp: string;

  /** Detailed message or additional info related to the log entry */
  message: string;
}
