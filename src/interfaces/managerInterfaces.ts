import { IMetadata } from "./metaDataInterface";

/**
 * Represents the structure of a single manager.
 */
export interface IManagerData {
  id: string;
  username: string;
  email: string;
  isBlocked: boolean;
  createdAt: string;
  department: {
    id: number;
    name: string;
  };
  permissions: string[];
}

/**
 * Represents the credentials used when creating or updating a manager.
 */
export interface IManagerCredentials {
  id?: string;
  username: string;
  email?: string;
  password?: string;
  permissions?: string[];
  departmentId?: number;
}

/**
 * Return type for a hook that fetches all managers and metadata.
 */
export interface UseGetAllManagersReturn {
  managers: IManagerData[];
  metadata: IMetadata;
  isManagersDataLoading: boolean;
}

/**
 * Return type for a hook that fetches a single manager by ID.
 */
export interface UseGetManagerByIDReturn {
  manager: IManagerData;
  isManagerDataLoading: boolean;
}

/**
 * Return type for a hook that fetches various counts related to managers.
 */
export interface UseGetManagersCountReturn {
  totalCount: number;
  lockedCount: number;
  blockedCount: number;
  isManagersCountLoading: boolean;
}
