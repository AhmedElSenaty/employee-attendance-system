import axiosInstance from "../config/axios.config";
import { BaseService } from "./base.services";

export class ReportsService extends BaseService {
  fetchEmployeeAttendanceReport = async (
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    startTime?: string,
    endTime?: string,
    status?: string,
    checked?: boolean,
    searchByDeptartmentId?: number,
    searchBySubDeptartmentId?: number
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        StartTime: startTime,
        EndTime: endTime,
        Status: status,
        IncludeSubDepartments: checked,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        `/Reports/EmployeeAttendanceReport/Excel`,
        {
          params,
          headers: this.getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching employee attendance report:", error);
      throw error;
    }
  };
  fetchEmployeeAttendanceReportPDF = async (
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    startTime?: string,
    endTime?: string,
    status?: string,
    checked?: boolean,
    searchByDeptartmentId?: number,
    searchBySubDeptartmentId?: number
  ) => {
    console.log("aaaaaaaaaaaaaaaaaaaaaaa");
    console.log(checked);
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        StartTime: startTime,
        EndTime: endTime,
        Status: status,
        IncludeSubDepartments: checked,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      console.log(params);
      const response = await axiosInstance.get(
        `/Reports/EmployeeAttendanceReport/PDF`,
        {
          params,
          headers: this.getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching employee attendance report:", error);
      throw error;
    }
  };
}
