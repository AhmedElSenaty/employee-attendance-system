import axiosInstance from "../config/axios.config";
import { AttendanceCredentials } from "../interfaces";
import { BaseService } from "./base.services";

export class AttendanceService extends BaseService {
  uploadExcelFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("employeesFile", file); // Key name must match what your backend expects

      const response = await axiosInstance.post(
        `/Account/upload-excel`,
        formData,
        {
          headers: {
            ...this.getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response;
    } catch (error) {
      this.handleError(error, "Error uploading Excel file");
    }
  };

  fetchAll = async (
    page?: number,
    pageSize?: number,
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    startTime?: string,
    endTime?: string,
    status?: string,
    searchByDepartmentId?: number,
    searchBySubDepartmentId?: number
  ) => {
    try {
      const params = this.buildParams({
        PageIndex: page ?? 1,
        PageSize: pageSize,
        StartDate: startDate,
        EndDate: endDate,
        StartTime: startTime,
        EndTime: endTime,
        Status: status,
        SearchByDepartmentID:
          searchByDepartmentId === 0 ? "" : searchByDepartmentId,
        SearchBySubDeptartmentId:
          searchBySubDepartmentId === 0 ? "" : searchBySubDepartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(`/Attendance`, {
        params,
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching all attendance");
    }
  };

  fetchSummary = async (
    page?: number,
    pageSize?: number,
    startDate?: string,
    endDate?: string,
    searchType?: string,
    searchQuery?: string
  ) => {
    try {
      const params = this.buildParams({
        PageIndex: page ?? 1,
        PageSize: pageSize,
        StartDate: startDate,
        EndDate: endDate,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });
      const response = await axiosInstance.get(`/Attendance/summary`, {
        params,
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      this.handleError(error, `Error fetching attendance summary:`);
    }
  };

  fetchCalendar = async (
    employeeID?: string,
    startDate?: string,
    endDate?: string
  ) => {
    try {
      const params = this.buildParams({
        EmployeeId: employeeID,
        StartDate: startDate,
        EndDate: endDate,
      });
      const response = await axiosInstance.get(`/Attendance/calendar`, {
        params,
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching attendance calendar");
    }
  };

  fetchByID = async (attendanceID: number) => {
    try {
      const response = await axiosInstance.get(
        `/Attendance/GetDetailedAttendanceById/${attendanceID}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response;
    } catch (error) {
      this.handleError(
        error,
        `Error fetching detailed attendance by ID ${attendanceID}:`
      );
    }
  };

  fetchOverview = async () => {
    try {
      const response = await axiosInstance.get(`/Attendance/overview`, {
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      this.handleError(error, `Error fetching attendance overview:`);
    }
  };

  fetchLatest = async () => {
    try {
      const response = await axiosInstance.get(`/Attendance/LatestAttendance`, {
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      this.handleError(error, `Error fetching latest attendance:`);
    }
  };

  fetchDepartmentOverview = async (
    startDate?: string,
    endDate?: string,
    departmentID?: number
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        DepartmentId: departmentID === 0 ? "" : departmentID,
      });

      const response = await axiosInstance.get(
        `/Attendance/departmentOverView`,
        {
          headers: this.getAuthHeaders(),
          params,
        }
      );

      return response;
    } catch (error) {
      this.handleError(error, `Error fetching department attendance overview:`);
    }
  };

  create = (attendance: AttendanceCredentials) => {
    return axiosInstance.post(`/Attendance`, attendance, {
      headers: this.getAuthHeaders(),
    });
  };

  update = (attendance: AttendanceCredentials) => {
    return axiosInstance.put(`/Attendance`, attendance, {
      headers: this.getAuthHeaders(),
    });
  };

  delete = (attendanceID: number) => {
    return axiosInstance.delete(`/Attendance/${attendanceID}`, {
      headers: this.getAuthHeaders(),
    });
  };

  fetchWithVacations = async (
    page?: number,
    pageSize?: number,
    searchType?: string,
    searchQuery?: string,
    searchByDepartmentId?: number,
    searchBySubDepartmentId?: number
  ) => {
    try {
      const params = this.buildParams({
        PageIndex: page ?? 1,
        PageSize: pageSize,
        SearchByDeptartmentId:
          searchByDepartmentId === 0 ? "" : searchByDepartmentId,
        SearchBySubDeptartmentId:
          searchBySubDepartmentId === 0 ? "" : searchBySubDepartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        `/Attendance/AttendanceWithVacations`,
        {
          params,
          headers: this.getAuthHeaders(),
        }
      );

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching all attendance with vacations");
    }
  };

  fetchStatus = async (status: string) => {
    try {
      const response = await axiosInstance.get(`/Attendance/card/${status}`, {
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      this.handleError(error, "Error fetching all attendance with vacations");
    }
  };

  fetchEmployeeTodayAttendance = async () => {
    try {
      const response = await axiosInstance.get(
        `/Attendance/GetEmployeeTodayAttendance`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response;
    } catch (error) {
      this.handleError(error, "Error fetching Employee Today Attendance");
    }
  };
}
