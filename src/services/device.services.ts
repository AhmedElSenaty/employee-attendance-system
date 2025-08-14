import axiosInstance from "../config/axios.config";
import {
  DeviceCredentials,
  RefetchAllPayload,
  RefetchPayload,
} from "../interfaces";
import { BaseService } from "./base.services";

export class DeviceService extends BaseService {
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
      const response = await axiosInstance.get("/Devices", {
        params,
        headers: this.getAuthHeaders(),
      });

      return response;
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

      return response;
    } catch (error) {
      console.error(`Error fetching device with ID ${id}:`, error);
      throw error;
    }
  };

  fetchList = async () => {
    try {
      const response = await axiosInstance.get("/Devices/List", {
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      console.error("Error fetching devices list:", error);
      throw error;
    }
  };

  create = (device: DeviceCredentials) => {
    const payload = {
      ...device,
      port: device.port || 4370,
    };

    return axiosInstance.post("/Devices", payload, {
      headers: this.getAuthHeaders(),
    });
  };

  update = (device: DeviceCredentials) => {
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

  refetchAttendance = (payload: RefetchPayload) => {
    console.log(payload);
    return axiosInstance.post(`/aa`, payload, {
      headers: this.getAuthHeaders(),
    });
  };

  refetchAllAttendance = (payload: RefetchAllPayload) => {
    console.log(payload);
    return axiosInstance.post(`/aa`, payload, {
      headers: this.getAuthHeaders(),
    });
  };

  fetchAllDeviceUsers = async (
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
      const response = await axiosInstance.get("/DeviceUsers", {
        params,
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching all Device Users:", error);
      throw error;
    }
  };

  toggleRole = async (
    ip: string,
    uid: number,
    employeeID: number,
    newRole: number
  ) => {
    try {
      const response = await axiosInstance.post(
        `http://193.227.34.53:3001/Machine_Controller/api/UpdateUserRole`,
        {
          ip: ip,
          uid: uid,
          employeeID: employeeID,
          newRole: newRole,
          name: "",
        }
      );
      return response;
    } catch (error) {
      console.error("Error toggling role:", error);
      throw error;
    }
  };
}
