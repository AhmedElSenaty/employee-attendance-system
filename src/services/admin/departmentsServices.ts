import axiosInstance from "../../config/axios.config";
import { IDepartment, IDepartmentCredentials } from "../../interfaces";

export const fetchAllDepartments = async (
  page: number,
  pageSize: number,
  searchType: string,
  searchQuery: string,
  token: string
) => {
  try {
    const response = await axiosInstance.get(`/Department`, {
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
    console.error("Error fetching all departments:", error);
    throw error;
  }
};

export const fetchDepartmentByID = async (departmentID: number, token: string) => {
  try {
    const response = await axiosInstance.get(`/Department/${departmentID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching department with ID ${departmentID}:`, error);
    throw error;
  }
};

export const fetchDepartmentsList = async (token: string): Promise<IDepartment[] | null> => {
  try {
    const response = await axiosInstance.get(`/Department/List`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching departments list:", error);
    throw error;
  }
};

export const createDepartment = async (department: IDepartmentCredentials, token: string) => {
  try {
    const response = await axiosInstance.post("/Department", department, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error creating department:", error);
    throw error;
  }
};

export const updateDepartment = async (department: IDepartmentCredentials, token: string) => {
  try {
    return await axiosInstance.put("/Department", department, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error updating department:", error);
    throw error;
  }
};

export const deleteDepartmentByID = async (departmentID: number, token: string) => {
  try {
    return await axiosInstance.delete(`/Department/${departmentID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error(`Error deleting department with ID ${departmentID}:`, error);
    throw error;
  }
};

export const updateUserDepartments = async (
  data: { userId: string; departmentsIds: number[] },
  token: string
) => {
  try {
    const response = await axiosInstance.put(`/Department/UpdateUserDepartments`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error updating user departments:", error);
    throw error;
  }
};
