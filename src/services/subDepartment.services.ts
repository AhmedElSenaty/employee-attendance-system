import axiosInstance from "../config/axios.config";
import { ISubDepartment, ISubDepartmentCredentials } from "../interfaces";
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

      return response.data;
    } catch (error) {
      console.error("Error fetching all sub-departments:", error);
      throw error;
    }
  };

  fetchList = async (): Promise<ISubDepartment[]> => {
    try {
      const response = await axiosInstance.get(`/SubDepartment/List`, {
        headers: this.getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching sub-departments list:", error);
      return [];
    }
  };

  fetchByID = async (subDepartmentID: number) => {
    try {
      const response = await axiosInstance.get(`/SubDepartment/${subDepartmentID}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching sub-department with ID ${subDepartmentID}:`, error);
      throw error;
    }
  };

  create = (subDepartment: ISubDepartmentCredentials) => {
    return axiosInstance.post(`/SubDepartment`, subDepartment, {
      headers: this.getAuthHeaders(),
    });
  };

  update = (subDepartment: ISubDepartmentCredentials) => {
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
  ): Promise<ISubDepartment[]> => {
    try {
      const response = await axiosInstance.get(`/SubDepartment/list/${departmentID}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching sub-departments for department ${departmentID}:`, error);
      return [];
    }
  };
}
