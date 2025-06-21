import axiosInstance from "../config/axios.config";
import { BaseService } from "./base.services";

export class PermissionService extends BaseService {

  fetchAll = async () => {
    try {
      const response = await axiosInstance.get(`/Permissions/`, {
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      console.error("Error fetching all permissions:", error);
      // Log error and rethrow for caller to handle
      console.error("Error fetching all logs:", error);
      throw error;
    }
  };

  fetchAuthorizedUserPermissions = async ()=> {
    try {
      const response = await axiosInstance.get(`/Permissions/me`, {
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      console.error("Error fetching authorized user permissions:", error);
      // Log error and rethrow for caller to handle
      console.error("Error fetching all logs:", error);
      throw error;
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
