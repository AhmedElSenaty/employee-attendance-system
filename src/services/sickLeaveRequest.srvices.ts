import axiosInstance from "../config/axios.config";
import {
	IAssignSickLeaveRequestCredentials,
	IRejectSickLeaveRequestCredentials,
  ISickLeaveRequestCredentials,
  ISickLeaveRequestUpdateReportCredentials,
	ISickLeaveRequestUpdateTextCredentials,
} from "../interfaces";
import { BaseService } from "./base.services";

export class SickLeaveRequestsService extends BaseService {
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

      const response = await axiosInstance.get("/SickLeaveRequst/Manager/SickLeaveRequests", {
        params,
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      this.handleError(error, "Error fetching all leave requests");
    }
  };

  fetchMySickRequests = async (
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
      const response = await axiosInstance.get("/SickLeaveRequst/Employee/SickLeaveRequests", {
        params,
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      this.handleError(error, "Error fetching all Sick requests");
    }
  };

  fetchMySickRequestById = async (requestId: number) => {
    try {
      const response = await axiosInstance.get(`/SickLeaveRequst/Employee/SickLeaveRequests/${requestId}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      this.handleError(error, `Error fetching Sick request with ID ${requestId}`);
    }
  };

  fetchSickRequestById = async (requestId: number) => {
    try {
      const response = await axiosInstance.get(`/SickLeaveRequst/Manager/SickLeaveRequests/${requestId}`, {
        headers: this.getAuthHeaders(),
      });

      return response.data;
    } catch (error) {
      this.handleError(error, `Error fetching Sick request with ID ${requestId}`);
    }
  };

	assign = (request: IAssignSickLeaveRequestCredentials) => {
		return axiosInstance.post("/SickLeaveRequst/Manager/AssignSickLeave", request, {
				headers: this.getAuthHeaders(),
		});
	}

	create = (request: ISickLeaveRequestCredentials) => {
		return axiosInstance.post("/SickLeaveRequst/Employee/RequestSickLeave", request, {
				headers: this.getAuthHeaders(),
		});
	}

  accept = (requestId: number) => {
    return axiosInstance.put(`/SickLeaveRequst/Manager/SickLeave/Accept/${requestId}`, {}, {
      headers: this.getAuthHeaders(),
    });
  }

  reject = (rejectLeaveRequestData: IRejectSickLeaveRequestCredentials) => {
    return axiosInstance.put(`/SickLeaveRequst/Manager/SickLeave/Reject`, rejectLeaveRequestData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateReport = async (report: ISickLeaveRequestUpdateReportCredentials) => {
		return axiosInstance.put(
			`/SickLeaveRequst/Employee/Request/Sick/UpdateReport`,
			report,
			{
				headers: {
					...this.getAuthHeaders(),
					"Content-Type": "multipart/form-data",
				},
			}
		);
  };

	updateText = async (data: ISickLeaveRequestUpdateTextCredentials) => {
    return axiosInstance.put(
			`/SickLeaveRequst/Employee/Request/Sick/UpdateText`,
			data,
			{
				headers: {
					...this.getAuthHeaders(),
				},
			}
		);
  };
}
