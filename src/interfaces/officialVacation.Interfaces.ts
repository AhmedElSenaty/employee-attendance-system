import { IMetadata } from "./metaDataInterface";

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

/**
 * Return type for the useGetAllOfficialVacations hook.
 */
export interface UseGetAllOfficialVacationsReturn {
  officialVacations: IOfficialVacationData[];
  metadata: IMetadata;
  totalOfficialVacations: number;
  isOfficialVacationsDataLoading: boolean;
}

/**
 * Return type for the useGetOfficialVacationByID hook.
 */
export interface UseGetOfficialVacationByIDReturn {
  officialVacation: IOfficialVacationData | null;
  isOfficialVacationDataLoading: boolean;
}
