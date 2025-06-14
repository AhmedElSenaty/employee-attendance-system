/**
 * Represents a minimal Official Vacation (used in dropdowns or list items).
 */
export interface IOfficialVacation {
  id: number;
  name: string;
}

/**
 * Represents the input payload for creating/updating an official vacation.
 */
export interface IOfficialVacationCredentials {
  id?: number; // Optional for create
  name: string;
  startDate: string;
  endDate: string;
}

/**
 * Represents a full official vacation object returned from the API.
 */
export interface IOfficialVacationData {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}