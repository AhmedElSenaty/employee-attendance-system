import axiosInstance from "../../config/axios.config";
import { IPermissionsData } from "../../interfaces";

export const fetchAllPermissions = async (token: string): Promise<IPermissionsData[]> => {
  try {
    const response = await axiosInstance.get(`/Permissions/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data?.data?.permission || [];
  } catch (error) {
    console.error("Error fetching all permissions:", error);
    return []; // or throw error
  }
};

export const fetchAuthorizedUserPermissions = async (token: string): Promise<[]> => {
  try {
    const response = await axiosInstance.get(`/Permissions/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data?.data?.permission || [];
  } catch (error) {
    console.error("Error fetching authorized user permissions:", error);
    return []; // or throw error
  }
};

export const updateUserPermissions = async (
  data: { userId: string; permissionsIds: string[] },
  token: string
) => {
  try {
    const response = await axiosInstance.put(`/Permissions/UpdateUserPermissions`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error updating user permissions:", error);
    throw error; // you might want to propagate the error
  }
};
