import axiosInstance from "../config/axios.config";
import {
  EmployeeProfileCredentials,
  IEmployee,
  IEmployeeCredentials,
} from "../interfaces";
import { BaseService } from "./base.services";

export class EmployeeService extends BaseService {
  fetchAll = async (
    page: number,
    pageSize: number,
    searchType: string,
    searchQuery: string
  ) => {
    try {
      const params = this.buildParams({
        PageIndex: page ?? 1,
        PageSize: pageSize,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });
      
      const response = await axiosInstance.get("/Employee", {
        params,
        headers: this.getAuthHeaders(),
      });
      console.log(response.data);
      
      return response.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  };

  fetchList = async (): Promise<IEmployee[]> => {
    try {
      const response = await axiosInstance.get("/Employee/List", {
        headers: this.getAuthHeaders(),
      });

      return response.data.data;
    } catch (error) {
      console.error("Error fetching employees list:", error);
      throw error;
    }
  };

  fetchCount = async () => {
    try {
      const response = await axiosInstance.get("/Employee/Count", {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching employees count:", error);
      throw error;
    }
  };

  fetchByID = async (employeeID: string) => {
    try {
      const response = await axiosInstance.get(`/Employee/${employeeID}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching employee by ID (${employeeID}):`, error);
      throw error;
    }
  };

  create = (employeeData: IEmployeeCredentials) => {
    return axiosInstance.post("/Account/RegisterEmployee", employeeData, {
      headers: this.getAuthHeaders(),
    });
  };

  update = (employeeData: IEmployeeCredentials) => {
    return axiosInstance.put("/Employee", employeeData, {
      headers: this.getAuthHeaders(),
    });
  };
  
  delete = (employeeID: string) => {
    return axiosInstance.delete(`/Employee/${employeeID}`, {
      headers: this.getAuthHeaders(),
    });
  };

  toggleReportStatus = (employeeID: string) => {
    return axiosInstance.put(`/Employee/toggle-report/${employeeID}`, {}, {
      headers: this.getAuthHeaders(),
    });
  };

  uploadImage = async (employeeId: string, imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append("NewImage", imageFile);

      const response = await axiosInstance.put(
        `/Employee/ChangeProfileImage?Id=${employeeId}`,
        formData,
        {
          headers: {
            ...this.getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Error uploading employee image:", error);
      throw error;
    }
  };

  updateMyProfile = async (employeeData: EmployeeProfileCredentials) => {
    try {
      const response = await axiosInstance.put("/Employee/me", employeeData, {
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      console.error("Error updating employee profile:", error);
      throw error;
    }
  };
}
