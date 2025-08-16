import axiosInstance from "../config/axios.config";
import { EmployeeWorkingScheduleCredentials } from "../interfaces/workingDays.interfaces";
import { BaseService } from "./base.services";

export class WorkingScheduleService extends BaseService {
  // Get employee working schedule
  getEmployeeSchedule = async (employeeId: string) => {
    try {
      const response = await axiosInstance.get(
        `/EmployeeWorkingSchedule/${employeeId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error(
        `Error fetching employee schedule with ID ${employeeId}:`,
        error
      );
      throw error;
    }
  };

  // Update employee working schedule
  updateEmployeeSchedule = async (data: EmployeeWorkingScheduleCredentials) => {
    try {
      const response = await axiosInstance.put(
        "/EmployeeWorkingSchedule",
        data,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating employee schedule:", error);
      throw error;
    }
  };

  // Get all employees schedules for manager
  getAllEmployeesSchedules = async () => {
    try {
      const response = await axiosInstance.get("/EmployeeWorkingSchedule/all", {
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching all employees schedules:", error);
      throw error;
    }
  };

  // Delete employee working schedule
  deleteEmployeeSchedule = async (employeeId: string, scheduleId: string) => {
    try {
      const response = await axiosInstance.delete(
        `/EmployeeWorkingSchedule/${employeeId}/${scheduleId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error(`Error deleting employee schedule:`, error);
      throw error;
    }
  };
}
