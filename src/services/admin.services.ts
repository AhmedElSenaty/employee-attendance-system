import axiosInstance from "../config/axios.config";
import { AdminProfileCredentials, IAdminCredentials } from "../interfaces";
import { BaseService } from "./base.services";

export class AdminService extends BaseService {
  fetchAll = async (
    page: number,
    pageSize: number,
    searchType: string,
    searchQuery: string
  ) => {
    try {
      const params = this.buildParams(page, pageSize, searchType, searchQuery);

      const response = await axiosInstance.get("/Admin", {
        params,
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching admins:", error);
      throw error;
    }
  };

  fetchByID = async (adminID: string) => {
    try {
      const response = await axiosInstance.get(`/Admin/${adminID}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching admin by ID:", error);
      throw error;
    }
  };

  create = (adminData: IAdminCredentials) => {
    return axiosInstance.post("/Account/RegisterAdmin", adminData, {
      headers: this.getAuthHeaders(),
    });
  };
  
  update = (adminData: IAdminCredentials) => {
    return axiosInstance.put("/Admin", adminData, {
      headers: this.getAuthHeaders(),
    });
  };
  
  delete = (adminID: string) => {
    return axiosInstance.delete(`/Admin/${adminID}`, {
      headers: this.getAuthHeaders(),
    });
  };

  updateMyProfile = async (adminData: AdminProfileCredentials) => {
    try {
      const response = await axiosInstance.put("/Admin/me", adminData, {
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      console.error("Error updating my profile:", error);
      throw error;
    }
  };
}
