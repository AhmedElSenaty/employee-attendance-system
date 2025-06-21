import axiosInstance from "../config/axios.config";
import { OfficialVacationCredentials } from "../interfaces";
import { BaseService } from "./base.services";

export class OfficialVacationService extends BaseService {

  fetchAll = async (
    page?: number,
    pageSize?: number,
    startDate?: string,
    endDate?: string,
    searchType?: string,
    searchQuery?: string,
  ) => {
    try {
      const params = this.buildParams({
        PageIndex: page ?? 1,
        PageSize: pageSize,
        StartDate: startDate,
        EndDate: endDate,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });
      const response = await axiosInstance.get(`/OfficialVacation`, {
        params,
        headers: this.getAuthHeaders(),
      });
  
      return response;
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
      return response;
    } catch (error) {
      console.error(`Error fetching official vacation with ID ${id}:`, error);
      throw error;
    }
  };

  create = (officialVacation: OfficialVacationCredentials) => {
    return axiosInstance.post("/OfficialVacation", officialVacation, {
      headers: this.getAuthHeaders()
    });
  };

  update = (officialVacation: OfficialVacationCredentials) => {
    return axiosInstance.put("/OfficialVacation", officialVacation, {
      headers: this.getAuthHeaders()
    });
  };
  
  delete = (id: number) => {
    return axiosInstance.delete(`/OfficialVacation/${id}`, {
      headers: this.getAuthHeaders()
    });
  };
}