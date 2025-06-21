import axiosInstance from "../config/axios.config";
import { DepartmentCredentials } from "../interfaces";
import { BaseService } from "./base.services";

export class DepartmentService extends BaseService {
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

      const response = await axiosInstance.get(`/Department`, {
        params,
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      console.error("Error fetching all departments:", error);
      throw error;
    }
  };

  fetchList = async () => {
    try {
      const response = await axiosInstance.get(`/Department/List`, {
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching all departments:", error);
      throw error;
    }
  };

  fetchByID = async (departmentID: number) => {
    try {
      const response = await axiosInstance.get(`/Department/${departmentID}`, {
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error(`Error fetching department with ID ${departmentID}:`, error);
      throw error;
    }
  };

  create = (department: DepartmentCredentials) => {
    return axiosInstance.post(`/Department`, department, {
      headers: this.getAuthHeaders(),
    });
  };

  update = (department: DepartmentCredentials) => {
    return axiosInstance.put(`/Department`, department, {
      headers: this.getAuthHeaders(),
    });
  };

  delete = (departmentID: number) => {
    return axiosInstance.delete(`/Department/${departmentID}`, {
      headers: this.getAuthHeaders(),
    });
  };

  updateUserDepartments = (userId: string, departmentsIds: number[]) => {
    return axiosInstance.put(`/Department/UpdateUserDepartments`, {userId, departmentsIds}, {
      headers: this.getAuthHeaders(),
    });
  };
}
