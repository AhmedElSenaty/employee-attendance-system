import axiosInstance from "../config/axios.config";
import { UpdateWorkingDays } from "../interfaces";
import { BaseService } from "./base.services";

export class WorkingDaysService extends BaseService {
  fetchMe = async () => {
    try {
      const response = await axiosInstance.get("/EmployeeWorkingDays/me", {
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching all working days:", error);
      throw error;
    }
  };

  fetchByID = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `/EmployeeWorkingDays/GetEmployeeWorkingDays/${id}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      throw error;
    }
  };

  restorePreviousSchedule = async (id: string) => {
    try {
      const response = await axiosInstance.delete(
        `EmployeeWorkingDays/GoToPreviousSchedule/${id}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error(`Error fetching employee schedule with ID ${id}:`, error);
      throw error;
    }
  };

  update = (data: UpdateWorkingDays) => {
    return axiosInstance.put("/EmployeeWorkingDays", data, {
      headers: this.getAuthHeaders(),
    });
  };
}
