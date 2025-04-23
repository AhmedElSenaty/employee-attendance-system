import axiosInstance from "../../config/axios.config";
import { IEntity, IEntityCredentials } from "../../interfaces/entityInterfaces";

export const fetchAllEntities = async (
  page: number,
  pageSize: number,
  searchType: string,
  searchQuery: string,
  token: string
) => {
  try {
    const response = await axiosInstance.get(`/Entities`, {
      params: {
        PageIndex: page,
        PageSize: pageSize,
        [searchType]: searchQuery,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all entities:", error);
    return null;
  }
};

export const fetchEntitiesList = async (token: string): Promise<IEntity[]> => {
  try {
    const response = await axiosInstance.get(`/Entities/List`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching entities list:", error);
    return [];
  }
};

export const fetchEntityByID = async (entityID: number, token: string) => {
  try {
    const response = await axiosInstance.get(`/Entities/${entityID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching entity with ID ${entityID}:`, error);
    return null;
  }
};

export const createEntity = async (entity: IEntityCredentials, token: string) => {
  try {
    const response = await axiosInstance.post("/Entities", entity, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error creating entity:", error);
    throw error;
  }
};

export const updateEntity = async (entity: IEntityCredentials, token: string) => {
  try {
    const response = await axiosInstance.put("/Entities", entity, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error updating entity:", error);
    throw error;
  }
};

export const deleteEntityByID = async (EntityID: number, token: string) => {
  try {
    return await axiosInstance.delete(`/Entities/${EntityID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error(`Error deleting entity with ID ${EntityID}:`, error);
    throw error;
  }
};
