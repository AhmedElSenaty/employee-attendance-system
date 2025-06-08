import axiosInstance from "../config/axios.config";
import { BaseService } from "./base.services";

export class ReportsService extends BaseService {
  fetchEmployeeAttendanceReport = async (
    searchType: string,
    searchQuery: string,
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string,
    status: string,
    searchByDeptartmentId: number,
    searchBySubDeptartmentId: number
  ) => {
    try {
      const params: Record<string, string | number> = {
        StartDate: startDate,
        EndDate: endDate,
        StartTime: startTime,
        EndTime: endTime,
        Status: status,
        [searchType]: searchQuery,
        SearchByDeptartmentId: searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId: searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
      };

      const response = await axiosInstance.get(`/Reports/EmployeeAttendanceReport`, {
        params,
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching employee attendance report:", error);
      throw error;
    }
  };
}
