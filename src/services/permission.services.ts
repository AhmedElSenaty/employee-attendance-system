import axiosInstance from "../config/axios.config";
import { IPermissionsData } from "../interfaces";
import { BaseService } from "./base.services";

export class PermissionService extends BaseService {

  fetchAll = async (): Promise<IPermissionsData[]> => {
    try {
      const response = await axiosInstance.get(`/Permissions/`, {
        headers: this.getAuthHeaders(),
      });

      return response?.data?.data?.permission || [];
    } catch (error) {
      console.error("Error fetching all permissions:", error);
      return [];
    }
  };

  fetchAuthorizedUserPermissions = async (): Promise<[]> => {
    try {
      const response = await axiosInstance.get(`/Permissions/me`, {
        headers: this.getAuthHeaders(),
      });

      return response?.data?.data?.permission || [];
    } catch (error) {
      console.error("Error fetching authorized user permissions:", error);
      return [];
    }
  };

  updateUserPermissions = async (userId: string, permissionsIds: string[]) => {
    try {
      const response = await axiosInstance.put(`/Permissions/UpdateUserPermissions`, {userId, permissionsIds}, {
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      console.error("Error updating user permissions:", error);
      throw error;
    }
  };
}
