import { IPaginationData } from "./pagination.interface";

export interface IMetadata {
  pagination: IPaginationData;
  searchBy: string[]; // or a more specific type if needed
  dateRange: string[]; // or Date[] if you're working with actual dates
  timeRange: string[]; // or a custom time type
  options: {
    status: string[]; // or a union type like ("active" | "inactive")[]
  };
}

export const initialMetadata: IMetadata = {
  pagination: { pageIndex: 0, pageSize: 0, totalPages: 0, totalRecords: 0 },
  searchBy: [],
  dateRange: [],
  timeRange: [],
  options: {
    status: []
  }
};
