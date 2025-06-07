import axiosInstance from "../config/axios.config";
import { IDepartment, IDepartmentCredentials } from "../interfaces/department.interfaces";
import { BaseService } from "./base.service";

export class DepartmentService extends BaseService {
  fetchAll = async (
    page?: number,
    pageSize?: number,
    searchType?: string,
    searchQuery?: string
  ) => {
    try {
      const params = this.buildParams(page, pageSize, searchType, searchQuery);

      const response = await axiosInstance.get(`/Department`, {
        params,
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching all departments:", error);
      throw error;
    }
  };

  fetchList = async (): Promise<IDepartment[]> => {
    try {
      const response = await axiosInstance.get(`/Department/List`, {
        headers: this.getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching departments list:", error);
      return [];
    }
  };

  fetchByID = async (departmentID: number) => {
    try {
      const response = await axiosInstance.get(`/Department/${departmentID}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching department with ID ${departmentID}:`, error);
      throw error;
    }
  };

  create = (department: IDepartmentCredentials) => {
    return axiosInstance.post(`/Department`, department, {
      headers: this.getAuthHeaders(),
    });
  };

  update = (department: IDepartmentCredentials) => {
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
