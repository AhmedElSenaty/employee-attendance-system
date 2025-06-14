import axiosInstance from "../config/axios.config";
import { IAssignCasualLeaveRequestCredentials, ICasualLeaveRequestData, IRejectCasualLeaveRequestCredentials } from "../interfaces/casualLeaveRequest.interfaces";
import { BaseService } from "./base.services";

export class CasualLeaveRequestService extends BaseService {

  fetchCasualLeaveRequests = async (
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

      const response = await axiosInstance.get("/CasualLeave/Manager/CasualLeaveRequests", {
        params,
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      this.handleError(error, "Error fetching all Casual leave requests");
    }
  };

  fetchMyCasualLeaveRequests = async (
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
      const response = await axiosInstance.get("/CasualLeave/Employee/CasualLeaveRequests", {
        params,
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      this.handleError(error, "Error fetching all casual leave requests");
    }
  };

  fetchMyCasualLeaveRequestById = async (requestId: number) => {
    try {
      const response = await axiosInstance.get(`/CasualLeave/Employee/CasualLeaveRequests/${requestId}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      this.handleError(error, `Error fetching Casual request with ID ${requestId}`);
    }
  };

  fetchCasualLeaveRequestById = async (requestId: number) => {
    try {
      const response = await axiosInstance.get(`/CasualLeave/Manager/CasualLeaveRequests/${requestId}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      this.handleError(error, `Error fetching leave request with ID ${requestId}`);
    }
  };

  create = (casualLeaveRequest: ICasualLeaveRequestData) => {
    return axiosInstance.post("/CasualLeave/Employee/RequestCasualLeave", casualLeaveRequest, {
      headers: this.getAuthHeaders(),
    });
  };
  
  update = (casualLeaveRequest: ICasualLeaveRequestData) => {
    return axiosInstance.put("/CasualLeave/Employee/UpdateCasualLeave", casualLeaveRequest, {
      headers: this.getAuthHeaders(),
    });
  };

  accept = (requestId: number) => {
    return axiosInstance.put(`/CasualLeave/Manager/AcceptCasualLeave/${requestId}`, {}, {
      headers: this.getAuthHeaders(),
    });
  }

  assign = (casualLeaveRequest: IAssignCasualLeaveRequestCredentials) => {
		return axiosInstance.post("/CasualLeave/Manager/AssignCasualLeave", casualLeaveRequest, {
				headers: this.getAuthHeaders(),
		});
	}

  reject = (rejectCasualLeaveRequest: IRejectCasualLeaveRequestCredentials) => {
    return axiosInstance.put(`/CasualLeave/Manager/RejectCasualLeaveRequest`, rejectCasualLeaveRequest, {
      headers: this.getAuthHeaders(),
    });
  }
}