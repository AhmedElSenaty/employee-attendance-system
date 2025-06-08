import axiosInstance from "../config/axios.config";
import { IManagerCredentials } from "../interfaces";
import { BaseService } from "./base.services";

export class ManagerService extends BaseService {
  fetchAll = async (
    page?: number,
    pageSize?: number,
    searchType?: string,
    searchQuery?: string
  ) => {
    try {
      const params = this.buildParams(page, pageSize, searchType, searchQuery);

      const response = await axiosInstance.get("/Manager", {
        params,
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching all managers:", error);
      throw error;
    }
  };

  fetchByID = async (managerID: string) => {
    try {
      const response = await axiosInstance.get(`/Manager/${managerID}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching manager with ID ${managerID}:`, error);
      throw error;
    }
  };

  fetchCount = async () => {
    try {
      const response = await axiosInstance.get("/Manager/Count", {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching managers count:", error);
      throw error;
    }
  };

  create = (managerData: IManagerCredentials) => {
    return axiosInstance.post("/Account/RegisterManager", managerData, {
      headers: this.getAuthHeaders(),
    });
  };

  update = (managerData: IManagerCredentials) => {
    return axiosInstance.put("/Manager", managerData, {
      headers: this.getAuthHeaders(),
    });
  };

  delete = (managerID: string) => {
    return axiosInstance.delete(`/Manager/${managerID}`, {
      headers: this.getAuthHeaders(),
    });
  };
}
