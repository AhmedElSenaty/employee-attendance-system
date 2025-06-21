import axiosInstance from "../config/axios.config";
import { EntityCredentials } from "../interfaces";
import { BaseService } from "./base.services";

export class EntityService extends BaseService {
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
      
      const response = await axiosInstance.get(`/Entities`, {
        params,
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      console.error("Error fetching all entities:", error);
      throw error;
    }
  };

  fetchList = async () => {
    try {
      const response = await axiosInstance.get(`/Entities/List`, {
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching all devices:", error);
      throw error;
    }
  };

  fetchByID = async (entityID: number) => {
    try {
      const response = await axiosInstance.get(`/Entities/${entityID}`, {
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error(`Error fetching entity with ID ${entityID}:`, error);
      throw error;
    }
  };

  create = (entity: EntityCredentials) => {
    return axiosInstance.post(`/Entities`, entity, {
      headers: this.getAuthHeaders(),
    });
  };
  
  update = (entity: EntityCredentials) => {
    return axiosInstance.put(`/Entities`, entity, {
      headers: this.getAuthHeaders(),
    });
  };
  
  delete = (entityID: number) => {
    return axiosInstance.delete(`/Entities/${entityID}`, {
      headers: this.getAuthHeaders(),
    });
  };
}
