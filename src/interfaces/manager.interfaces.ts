
/**
 * Represents the structure of a single manager.
 */
export interface ManagerData {
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
export interface ManagerCredentials {
  id?: string;
  username: string;
  email?: string;
  password?: string;
  permissions?: string[];
  departmentId?: number;
}