import axiosInstance from "../config/axios.config";
import { IDevice, IDeviceCredentials } from "../interfaces";
import { BaseService } from "./BaseService";

export class DeviceService extends BaseService {
  fetchAll = async (
    page?: number,
    pageSize?: number,
    searchType?: string,
    searchQuery?: string
  ) => {
    try {
      const params = this.buildParams(page, pageSize, searchType, searchQuery);

      const response = await axiosInstance.get("/Devices", {
        params,
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching all devices:", error);
      throw error;
    }
  };

  fetchByID = async (id: number) => {
    try {
      const response = await axiosInstance.get(`/Devices/${id}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching device with ID ${id}:`, error);
      throw error;
    }
  };

  fetchList = async (): Promise<IDevice[] | null> => {
    try {
      const response = await axiosInstance.get("/Devices/List", {
        headers: this.getAuthHeaders(),
      });

      return response.data.data;
    } catch (error) {
      console.error("Error fetching devices list:", error);
      throw error;
    }
  };

  create = (device: IDeviceCredentials) => {
    const payload = {
      ...device,
      port: device.port || 4370,
    };
  
    return axiosInstance.post("/Devices", payload, {
      headers: this.getAuthHeaders(),
    });
  };
  
  update = (device: IDeviceCredentials) => {
    const payload = {
      ...device,
      port: device.port || 4370,
    };
  
    return axiosInstance.put("/Devices", payload, {
      headers: this.getAuthHeaders(),
    });
  };
  
  delete = (id: number) => {
    return axiosInstance.delete(`/Devices/${id}`, {
      headers: this.getAuthHeaders(),
    });
  };
}
