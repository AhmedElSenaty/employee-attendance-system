import axiosInstance from "../config/axios.config";
import { ILeaveRequestCredentials, IRejectLeaveRequestCredentials } from "../interfaces/leaveRequest.interfaces";
import { BaseService } from "./base.services";

export class LeaveRequestService extends BaseService {

  fetchLeaveRequests = async (
    page?: number,
    pageSize?: number,
    startDate?: string,
    endDate?: string,
    status?: number,
    searchType?: string,
    searchQuery?: string
  ) => {
    try {
      const params = this.buildParams({
        PageIndex: page ?? 1,
        PageSize: pageSize,
        StartDate: startDate,
        EndDate: endDate,
        Status: status,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get("/LeaveRequests/Requests", {
        params,
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching all leave requests");
    }
  };

  fetchLeaveRequestsWithAttendance = async (
    page?: number,
    pageSize?: number,
    startDate?: string,
    endDate?: string,
    status?: number,
    searchType?: string,
    searchQuery?: string
  ) => {
    try {
      const params = this.buildParams({
        PageIndex: page ?? 1,
        PageSize: pageSize,
        StartDate: startDate,
        EndDate: endDate,
        Status: status,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get("/LeaveRequests/LeaveRequestsWithAttendance", {
        params,
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching all leave requests");
    }
  };

  fetchMyLeaveRequests = async (
    page?: number,
    pageSize?: number,
    startDate?: string,
    endDate?: string,
    status?: number,
  ) => {
    try {
      const params = {
        PageIndex: page,
        PageSize: pageSize,
        StartDate: startDate,
        EndDate: endDate,
        Status: status,
      }
      const response = await axiosInstance.get("/LeaveRequests/MyRequests", {
        params,
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching all leave requests");
    }
  };

  fetchMyLeaveRequestById = async (requestId: number) => {
    try {
      const response = await axiosInstance.get(`/LeaveRequests/MyRequests/${requestId}`, {
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      this.handleError(error, `Error fetching leave request with ID ${requestId}`);
    }
  };

  fetchLeaveRequestById = async (requestId: number) => {
    try {
      const response = await axiosInstance.get(`/LeaveRequests/Requests/${requestId}`, {
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      this.handleError(error, `Error fetching leave request with ID ${requestId}`);
    }
  };

  create = (leaveRequest: ILeaveRequestCredentials) => {
    return axiosInstance.post("/LeaveRequests/requestLeave", leaveRequest, {
      headers: this.getAuthHeaders(),
    });
  };
  
  update = (leaveRequest: ILeaveRequestCredentials) => {
    return axiosInstance.put("/LeaveRequests", leaveRequest, {
      headers: this.getAuthHeaders(),
    });
  };

  accept = (requestId: number) => {
    return axiosInstance.put(`/LeaveRequests/AcceptRequest/${requestId}`, {}, {
      headers: this.getAuthHeaders(),
    });
  }

  reject = (rejectLeaveRequestData: IRejectLeaveRequestCredentials) => {
    return axiosInstance.put(`/LeaveRequests/RejectRequest`, rejectLeaveRequestData, {
      headers: this.getAuthHeaders(),
    });
  }
}