import axiosInstance from "../../config/axios.config";
import { IDevice, IDeviceCredentials } from "../../interfaces";

export const fetchAllDevices = async (
  page: number,
  pageSize: number,
  searchType: string,
  searchQuery: string,
  token: string
) => {
  try {
    const response = await axiosInstance.get(`/Devices`, {
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
    console.error("Error fetching all devices:", error);
    throw error;
  }
};

export const fetchDeviceByID = async (deviceID: number, token: string) => {
  try {
    const response = await axiosInstance.get(`/Devices/${deviceID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching device with ID ${deviceID}:`, error);
    throw error;
  }
};

export const fetchDevicesList = async (token: string): Promise<IDevice[] | null> => {
  try {
    const response = await axiosInstance.get(`/Devices/List`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching devices list:", error);
    throw error;
  }
};

export const createDevice = async (device: IDeviceCredentials, token: string) => {
  try {
    device.port = device.port ? device.port : 4370;
    const response = await axiosInstance.post("/Devices", device, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating device:", error);
    throw error;
  }
};

export const updateDevice = async (device: IDeviceCredentials, token: string) => {
  try {
    device.port = device.port || 4370;
    return await axiosInstance.put("/Devices", device, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error updating device:", error);
    throw error;
  }
};

export const deleteDeviceByID = async (deviceID: number, token: string) => {
  try {
    return await axiosInstance.delete(`/Devices/${deviceID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(`Error deleting device with ID ${deviceID}:`, error);
    throw error;
  }
};
