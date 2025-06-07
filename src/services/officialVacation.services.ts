import axiosInstance from "../config/axios.config";
import { IOfficialVacationCredentials } from "../interfaces";
import { BaseService } from "./BaseService";

export class OfficialVacationService extends BaseService {

  fetchAll = async (
    page?: number,
    pageSize?: number,
    searchType?: string,
    searchQuery?: string
  ) => {
    try {
      const params = this.buildParams(page, pageSize, searchType, searchQuery);
  
      const response = await axiosInstance.get(`/OfficialVacation`, {
        params,
        headers: this.getAuthHeaders(),
      });
  
      return response.data;
    } catch (error) {
      console.error("Error fetching all official vacations:", error);
      throw error;
    }
  };
  
  fetchByID = async (id: number) => {
    try {
      const response = await axiosInstance.get(`/OfficialVacation/${id}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching official vacation with ID ${id}:`, error);
      throw error;
    }
  };

  create = (data: IOfficialVacationCredentials) => {
    return axiosInstance.post("/OfficialVacation", data, {
      headers: this.getAuthHeaders()
    });
  };

  update = (data: IOfficialVacationCredentials) => {
    return axiosInstance.put("/OfficialVacation", data, {
      headers: this.getAuthHeaders()
    });
  };
  
  delete = (id: number) => {
    return axiosInstance.delete(`/OfficialVacation/${id}`, {
      headers: this.getAuthHeaders()
    });
  };
}