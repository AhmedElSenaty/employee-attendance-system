import { Title } from "chart.js";
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
    searchBySubDeptartmentId?: number,
    absenceOnly?: boolean
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        StartTime: startTime,
        EndTime: endTime,
        Status: status,
        IncludeSubDepartments: checked,
        AbsenceOnly: absenceOnly,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

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
  fetchEmployeeAttendanceSummaryReport = async (
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
        `/Reports/EmployeeAttendanceSummaryReport/Excel`,
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
  fetchEmployeeAttendanceSummaryReportPDF = async (
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
        `/Reports/EmployeeAttendanceSummaryReport/PDF`,
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
  fetchEmployeeReport = async (
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    status?: string,
    type?: string,
    checked?: boolean,
    searchByDeptartmentId?: number,
    searchBySubDeptartmentId?: number
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        Status: status,
        Type: type,
        IncludeSubDepartments: checked,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        `/Reports/EmployeeRequestsReport/Excel`,
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

  fetchEmployeeReportPDF = async (
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    status?: string,
    type?: string,
    checked?: boolean,
    searchByDeptartmentId?: number,
    searchBySubDeptartmentId?: number
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        Status: status,
        Type: type,
        IncludeSubDepartments: checked,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        `/Reports/EmployeeRequestsReport/PDF`,
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

  fetchEmployeeRequestsSummaryReport = async (
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    status?: string,
    type?: string,
    checked?: boolean,
    searchByDeptartmentId?: number,
    searchBySubDeptartmentId?: number
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        Status: status,
        Type: type,
        IncludeSubDepartments: checked,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        `/Reports/EmployeeRequestsSummaryReport/Excel`,
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

  fetchEmployeeRequestsSummaryReportPDF = async (
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    status?: string,
    type?: string,
    checked?: boolean,
    searchByDeptartmentId?: number,
    searchBySubDeptartmentId?: number
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        Status: status,
        Type: type,
        IncludeSubDepartments: checked,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        `/Reports/EmployeeRequestsSummaryReport/PDF`,
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

  fetchVacationSaverReport = async (
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    checked?: boolean,
    searchByDeptartmentId?: number,
    searchBySubDeptartmentId?: number
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        IncludeSubDepartments: checked,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        `/Reports/EmployeeVacationsSaverReport/Excel`,
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

  fetchVacationSaverReportPDF = async (
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    checked?: boolean,
    searchByDeptartmentId?: number,
    searchBySubDeptartmentId?: number
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        IncludeSubDepartments: checked,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        `/Reports/EmployeeVacationsSaverReport/PDF`,
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

  fetchAbsenceFromWorkReportExcel = async (
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    checked?: boolean,
    searchByDeptartmentId?: number,
    searchBySubDeptartmentId?: number
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        IncludeSubDepartments: checked,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        `/Reports/EmployeeAbsenceFromWorkReport/Excel`,
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

  fetchAbsenceFromWorkReportPDF = async (
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    checked?: boolean,
    searchByDeptartmentId?: number,
    searchBySubDeptartmentId?: number,
    title?: string
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        IncludeSubDepartments: checked,
        Title: title,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });
      const response = await axiosInstance.get(
        `/Reports/EmployeeAbsenceFromWorkReport/PDF`,
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

  fetchWorkOvertimeReportPDF = async (
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    checked?: boolean,
    searchByDeptartmentId?: number,
    searchBySubDeptartmentId?: number
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        IncludeSubDepartments: checked,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        `/Reports/EmployeeWorkOvertimeReport/PDF`,
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

  fetchWorkOvertimeReportExcel = async (
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    checked?: boolean,
    searchByDeptartmentId?: number,
    searchBySubDeptartmentId?: number
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        IncludeSubDepartments: checked,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        `/Reports/EmployeeWorkOvertimeReport/Excel`,
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

  fetchSummaryWorkOvertimeReportPDF = async (
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    checked?: boolean,
    searchByDeptartmentId?: number,
    searchBySubDeptartmentId?: number
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        IncludeSubDepartments: checked,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        `/Reports/EmployeeWorkOvertimeSummaryReport/PDF`,
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

  fetchSummaryWorkOvertimeReportExcel = async (
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    checked?: boolean,
    searchByDeptartmentId?: number,
    searchBySubDeptartmentId?: number
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        IncludeSubDepartments: checked,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        `/Reports/EmployeeWorkOvertimeSummary/Excel`,
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

  GetEmployeesVerificationPDF = async (
    includeDept?: boolean,
    includeSubDept?: boolean
  ) => {
    try {
      const params = this.buildParams({
        includeDepartment: includeDept, // ✅ name matches backend: includeDepartment
        includeSubDepartment: includeSubDept, // ✅ name matches backend: includeSubDepartment
      });

      const response = await axiosInstance.get(
        `/Reports/GetEmployeesVerification/PDF`,
        {
          params,
          headers: this.getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching employee report:", error);
      throw error;
    }
  };

  GetEmployeesVerificationExcel = async (
    includeDept?: boolean,
    includeSubDept?: boolean
  ) => {
    try {
      const params = this.buildParams({
        includeDepartment: includeDept, // ✅ name matches backend: includeDepartment
        includeSubDepartment: includeSubDept, // ✅ name matches backend: includeSubDepartment
      });

      const response = await axiosInstance.get(
        `/Reports/GetEmployeesVerification/Excel`,
        {
          params,
          headers: this.getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching employee report:", error);
      throw error;
    }
  };

  fetchOrdinaryDeductionsReportPDF = async (
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    checked?: boolean,
    searchByDeptartmentId?: number,
    searchBySubDeptartmentId?: number
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        IncludeSubDepartments: checked,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        `/Reports/GetEmployeesOrdinaryDeduction/PDF`,
        {
          params,
          headers: this.getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching GetEmployeesOrdinaryDeduction report:",
        error
      );
      throw error;
    }
  };

  fetchOrdinaryDeductionsReportExcel = async (
    searchType?: string,
    searchQuery?: string,
    startDate?: string,
    endDate?: string,
    checked?: boolean,
    searchByDeptartmentId?: number,
    searchBySubDeptartmentId?: number
  ) => {
    try {
      const params = this.buildParams({
        StartDate: startDate,
        EndDate: endDate,
        IncludeSubDepartments: checked,
        SearchByDeptartmentId:
          searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId:
          searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        `/Reports/GetOrdinaryDeductions/Excel`,
        {
          params,
          headers: this.getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching GetOrdinaryDeductions report:", error);
      throw error;
    }
  };
}
