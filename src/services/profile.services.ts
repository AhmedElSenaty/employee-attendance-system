import axiosInstance from "../config/axios.config";
import { ProfileCredentials } from "../interfaces";
import { BaseService } from "./base.services";

export class ProfileService extends BaseService {

  fetchAll = async (
    page?: number,
    pageSize?: number,
    searchType?: string,
    searchQuery?: string
  ) => {
    try {
      const params = this.buildParams({
        PageIndex: page ?? 1,
        PageSize: pageSize,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });
      const response = await axiosInstance.get("/Profiles", {
        params,
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      console.error("Error fetching profiles:", error);
      throw error;
    }
  };

  fetchByID = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/Profiles/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error(`Error fetching profile with ID ${id}:`, error);
      throw error;
    }
  };

  create = (profile: ProfileCredentials) => {
    return axiosInstance.post("/Profiles", profile, {
      headers: this.getAuthHeaders(),
    });
  };

  update = (profile: ProfileCredentials) => {
    return axiosInstance.put("/Profiles", profile, {
      headers: this.getAuthHeaders(),
    });
  };

  delete = (id: string) => {
    return axiosInstance.delete(`/Profiles/${id}`, {
      headers: this.getAuthHeaders(),
    });
  };

  fetchList = async () => {
    try {
      const response = await axiosInstance.get("/Profiles/List", {
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching profiles list:", error);
      throw error;
    }
  };

  fetchPermissions = async (id: number) => {
    try {
      const response = await axiosInstance.get(`/Profiles/${id}/permissions`, {
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error(`Error fetching permissions for profile ID ${id}:`, error);
      throw error;
    }
  };
}
