import axiosInstance from "../config/axios.config";
import { ILeaveRequestCredentials } from "../interfaces/leaveRequest.interfaces";
import { BaseService } from "./base.services";

export class LeaveRequestService extends BaseService {
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

      return response.data;
    } catch (error) {
      console.error("Error fetching all leave requests:", error);
      throw error;
    }
  };

  fetchMyLeaveRequestById = async (requestId: number) => {
    try {
      const response = await axiosInstance.get(`/LeaveRequests/MyRequests/${requestId}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching leave request with ID ${requestId}:`, error);
      throw error;
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
}