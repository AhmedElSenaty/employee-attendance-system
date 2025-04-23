import { IMetadata } from "./metaDataInterface";

export interface IOfficialVacation {
  id: number;
  name: string
}
export interface IOfficialVacationCredentials {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
}

export interface IOfficialVacationData {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

export interface UseGetAllOfficialVacationsReturn {
  officialVacations: IOfficialVacationData[];
  metadata: IMetadata;
  isOfficialVacationsDataLoading: boolean;
  totalOfficialVacations: number
}

export interface UseGetOfficialVacationByIDReturn {
  officialVacation: IOfficialVacationData;
  isOfficialVacationDataLoading: boolean;
}