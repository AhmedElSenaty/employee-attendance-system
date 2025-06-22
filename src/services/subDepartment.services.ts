import axiosInstance from "../config/axios.config";
import { SubDepartmentFormValues } from "../validation";
import { BaseService } from "./base.services";

export class SubDepartmentService extends BaseService {
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
      
      const response = await axiosInstance.get(`/SubDepartment`, {
        params,
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      console.error("Error fetching all sub-departments:", error);
      throw error;
    }
  };

  fetchList = async () => {
    try {
      const response = await axiosInstance.get(`/SubDepartment/List`, {
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching sub-departments list:", error);
      throw error;
    }
  };

  fetchByID = async (subDepartmentID: number) => {
    try {
      const response = await axiosInstance.get(`/SubDepartment/${subDepartmentID}`, {
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error(`Error fetching sub-department with ID ${subDepartmentID}:`, error);
      throw error;
    }
  };

  create = (subDepartment: SubDepartmentFormValues) => {
    return axiosInstance.post(`/SubDepartment`, subDepartment, {
      headers: this.getAuthHeaders(),
    });
  };

  update = (subDepartment: SubDepartmentFormValues) => {
    return axiosInstance.put(`/SubDepartment`, subDepartment, {
      headers: this.getAuthHeaders(),
    });
  };

  delete = (subDepartmentID: number) => {
    return axiosInstance.delete(`/SubDepartment/${subDepartmentID}`, {
      headers: this.getAuthHeaders(),
    });
  };

  fetchDepartmentSubDepartments = async (
    departmentID: number
  ) => {
    try {
      const response = await axiosInstance.get(`/SubDepartment/list/${departmentID}`, {
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error(`Error fetching sub-departments for department ${departmentID}:`, error);
      throw error;
    }
  };
}
