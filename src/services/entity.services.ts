import axiosInstance from "../config/axios.config";
import { IEntity, IEntityCredentials } from "../interfaces/entity.interfaces";
import { BaseService } from "./base.services";

export class EntityService extends BaseService {
  fetchAll = async (
    page?: number,
    pageSize?: number,
    searchType?: string,
    searchQuery?: string
  ) => {
    try {
      const params = this.buildParams(page, pageSize, searchType, searchQuery);

      const response = await axiosInstance.get(`/Entities`, {
        params,
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching all entities:", error);
      throw error;
    }
  };

  fetchList = async (): Promise<IEntity[]> => {
    try {
      const response = await axiosInstance.get(`/Entities/List`, {
        headers: this.getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching entities list:", error);
      return [];
    }
  };

  fetchByID = async (entityID: number) => {
    try {
      const response = await axiosInstance.get(`/Entities/${entityID}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching entity with ID ${entityID}:`, error);
      throw error;
    }
  };

  create = (entity: IEntityCredentials) => {
    return axiosInstance.post(`/Entities`, entity, {
      headers: this.getAuthHeaders(),
    });
  };
  
  update = (entity: IEntityCredentials) => {
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
