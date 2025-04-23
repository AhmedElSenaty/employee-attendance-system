import axiosInstance from "../../config/axios.config";
import { IProfile, IProfileCredentials } from "../../interfaces";

export const fetchAllProfiles = async (
  page: number,
  pageSize: number,
  searchType: string,
  searchQuery: string,
  token: string
) => {
  try {
    const response = await axiosInstance.get(`/Profiles`, {
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
    console.error("Error fetching profiles:", error);
    throw error;
  }
};

export const fetchProfileByID = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.get(`/Profiles/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching profile with ID ${id}:`, error);
    throw error;
  }
};

export const createProfile = async (profile: IProfileCredentials, token: string) => {
  try {
    const response = await axiosInstance.post("/Profiles", profile, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
};

export const updateProfile = async (profile: IProfileCredentials, token: string) => {
  try {
    const response = await axiosInstance.put("/Profiles", profile, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const deleteProfileByID = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.delete(`/Profiles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error(`Error deleting profile with ID ${id}:`, error);
    throw error;
  }
};

export const fetchProfilesList = async (token: string): Promise<IProfile[]> => {
  try {
    const response = await axiosInstance.get(`/Profiles/List`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching profiles list:", error);
    throw error;
  }
};

export const fetchProfilePermissions = async (
  id: number,
  token: string
): Promise<string[]> => {
  try {
    const response = await axiosInstance.get(`/Profiles/${id}/permissions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.data?.permission;
  } catch (error) {
    console.error(`Error fetching permissions for profile ID ${id}:`, error);
    throw error;
  }
};
