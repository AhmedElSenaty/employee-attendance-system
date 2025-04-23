import axiosInstance from "../../config/axios.config";
import { IManagerCredentials } from "../../interfaces";

/**
 * Fetches all managers with pagination and optional search filtering.
 */
export const fetchAllManagers = async (
  page: number,
  pageSize: number,
  searchType: string,
  searchQuery: string,
  token: string
) => {
  try {
    const response = await axiosInstance.get(`/Manager`, {
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
    console.error("Error fetching all managers:", error);
    throw error;
  }
};

/**
 * Fetches a single manager by their ID.
 */
export const fetchManagerByID = async (managerID: string, token: string) => {
  try {
    const response = await axiosInstance.get(`/Manager/${managerID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching manager with ID ${managerID}:`, error);
    throw error;
  }
};

/**
 * Retrieves the total count of managers.
 */
export const fetchManagersCount = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/Manager/Count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching managers count:", error);
    throw error;
  }
};

/**
 * Creates a new manager using registration endpoint.
 */
export const createManager = async (
  managerData: IManagerCredentials,
  token: string
) => {
  try {
    const response = await axiosInstance.post(
      "/Account/RegisterManager",
      managerData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  } catch (error) {
    console.error("Error creating manager:", error);
    throw error;
  }
};

/**
 * Updates an existing manager’s information.
 */
export const updateManager = async (
  managerData: IManagerCredentials,
  token: string
) => {
  try {
    const response = await axiosInstance.put("/Manager", managerData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error updating manager:", error);
    throw error;
  }
};

/**
 * Deletes a manager by ID.
 */
export const deleteManagerByID = async (managerID: string, token: string) => {
  try {
    const response = await axiosInstance.delete(`/Manager/${managerID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error(`Error deleting manager with ID ${managerID}:`, error);
    throw error;
  }
};
