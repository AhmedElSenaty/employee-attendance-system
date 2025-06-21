/**
 * Interface representing the structure of system data used for employee attendance and leave policies.
 */
export interface SystemDataCredentials {
  /** Unique identifier for the system data entry */
  id?: number;

  /** Maximum allowed time (as string, e.g. "09:00") by which an employee must check-in */
  max_time_To_attend: string;

  /** Minimum allowed time (as string, e.g. "17:00") before an employee can check-out */
  min_time_To_Go: string;

  /** Annual vacation days for employees with up to 10 years of service */
  annualVacationMax10Years: number;

  /** Annual vacation days for employees aged up to 50 years */
  annualVacationTillAgeIs50Years: number;

  /** Annual vacation days for employees aged above 50 years */
  annualVacationAfterAgeIs50Years: number;

  /** Maximum number of leave requests an employee can make per month */
  maxNumberOfLeavesRequestPerMonth: number;

  /** Maximum number of casual leave days allowed per year */
  maxDaysInCasulVaccationPerYear: number;
}

/**
 * Initial/default values for the system data object.
 * Useful as a placeholder before actual system configuration data is loaded.
 */
export const initialSystemData: SystemDataCredentials = {
  id: 0,
  max_time_To_attend: "",
  min_time_To_Go: "",
  annualVacationMax10Years: 0,
  annualVacationTillAgeIs50Years: 0,
  annualVacationAfterAgeIs50Years: 0,
  maxNumberOfLeavesRequestPerMonth: 0,
  maxDaysInCasulVaccationPerYear: 0
};
