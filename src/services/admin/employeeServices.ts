import axiosInstance from "../../config/axios.config";
import { IEmployee, IEmployeeCredentials } from "../../interfaces";

// Fetch all employees with pagination and search query
export const fetchAllEmployees = async (page: number, pageSize: number, searchType: string, searchQuery: string, token: string) => {
  try {
    const response = await axiosInstance.get(`/Employee`, {
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
    console.error("Error fetching employees:", error);
    throw error; // Rethrow or handle as needed
  }
};

// Fetch a list of employees
export const fetchEmployeesList = async (token: string): Promise<IEmployee[]> => {
  try {
    const response = await axiosInstance.get(`/Employee/List`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching employees list:", error);
    throw error;
  }
};

// Fetch the count of employees
export const fetchEmployeesCount = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/Employee/Count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching employees count:", error);
    throw error;
  }
};

// Fetch employee details by ID
export const fetchEmployeeByID = async (employeeID: string, token: string) => {
  try {
    const response = await axiosInstance.get(`/Employee/${employeeID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee by ID (${employeeID}):`, error);
    throw error;
  }
};

// Create a new employee
export const createEmployee = async (employeeData: IEmployeeCredentials, token: string) => {
  try {
    const response = await axiosInstance.post("/Account/RegisterEmployee", employeeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

// Update an existing employee's data
export const updateEmployee = async (employeeData: IEmployeeCredentials, token: string) => {
  try {
    const response = await axiosInstance.put("/Employee", employeeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

// Delete an employee by ID
export const deleteEmployee = async (employeeID: string, token: string) => {
  try {
    const response = await axiosInstance.delete(`/Employee/${employeeID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error(`Error deleting employee (${employeeID}):`, error);
    throw error;
  }
};
