import axiosInstance from "../../config/axios.config";
import { IOfficialVacationCredentials } from "../../interfaces";

export const fetchAllOfficialVacations = async (
  page: number,
  pageSize: number,
  searchType: string,
  searchQuery: string,
  token: string
) => {
  try {
    const response = await axiosInstance.get(`/OfficialVacation`, {
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
    console.error("Error fetching all official vacations:", error);
    return null;
  }
};

export const fetchOfficialVacationByID = async (id: number, token: string) => {
  try {
    const response = await axiosInstance.get(`/OfficialVacation/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching official vacation with ID ${id}:`, error);
    return null;
  }
};

export const createOfficialVacation = async (
  data: IOfficialVacationCredentials,
  token: string
) => {
  try {
    const response = await axiosInstance.post("/OfficialVacation", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error creating official vacation:", error);
    throw error;
  }
};

export const updateOfficialVacation = async (
  data: IOfficialVacationCredentials,
  token: string
) => {
  try {
    const response = await axiosInstance.put("/OfficialVacation", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error updating official vacation:", error);
    throw error;
  }
};

export const deleteOfficialVacation = async (id: number, token: string) => {
  try {
    return await axiosInstance.delete(`/OfficialVacation/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(`Error deleting official vacation with ID ${id}:`, error);
    throw error;
  }
};
