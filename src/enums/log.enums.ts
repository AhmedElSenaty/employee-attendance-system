/**
 * Enum representing the different types of logs that can be recorded in the system.
 */
export enum LogType {
  /**
   * Informational log.
   * Used for general system messages that are not errors or user-triggered changes.
   */
  Create = 1,

  /**
   * Update log.
   * Represents changes or modifications made to existing data.
   */
  Update = 2,

  /**
   * Delete log.
   * Indicates the removal of data from the system.
   */
  Delete = 3,

  /**
   * Error log.
   * Captures unexpected issues or failures within the system.
   */
  Error = 4
}
