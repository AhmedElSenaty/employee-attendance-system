import axiosInstance from "../../config/axios.config";
import { ISubDepartment, ISubDepartmentCredentials } from "../../interfaces/";

export const fetchAllSubDepartments = async (
  page: number,
  pageSize: number,
  searchType: string,
  searchQuery: string,
  token: string
) => {
  try {
    const response = await axiosInstance.get(`/SubDepartment`, {
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
    console.error("Error fetching all sub-departments:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const fetchSubDepartmentsList = async (token: string): Promise<ISubDepartment[]> => {
  try {
    const response = await axiosInstance.get(`/SubDepartment/List`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching sub-departments list:", error);
    throw error;
  }
};

export const fetchSubDepartmentByID = async (subDepartmentID: number, token: string) => {
  try {
    const response = await axiosInstance.get(`/SubDepartment/${subDepartmentID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching sub-department with ID ${subDepartmentID}:`, error);
    throw error;
  }
};

export const createSubDepartment = async (subDepartment: ISubDepartmentCredentials, token: string) => {
  try {
    const response = await axiosInstance.post("/SubDepartment", subDepartment, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error creating sub-department:", error);
    throw error;
  }
};

export const updateSubDepartment = async (subDepartment: ISubDepartmentCredentials, token: string) => {
  try {
    const response = await axiosInstance.put("/SubDepartment", subDepartment, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error updating sub-department:", error);
    throw error;
  }
};

export const deleteSubDepartmentByID = async (subDepartmentID: number, token: string) => {
  try {
    const response = await axiosInstance.delete(`/SubDepartment/${subDepartmentID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error(`Error deleting sub-department with ID ${subDepartmentID}:`, error);
    throw error;
  }
};

export const fetchDepartmentSubDepartments = async (
  departmentID: number,
  token: string
): Promise<ISubDepartment[]> => {
  try {
    const response = await axiosInstance.get(`/SubDepartment/list/${departmentID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching sub-departments for department ${departmentID}:`, error);
    throw error;
  }
};
