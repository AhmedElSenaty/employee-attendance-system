import axiosInstance from "../config/axios.config";
import {
	IRejectSickRequestCredentials,
	ISickRequestUpdateTextCredentials,
} from "../interfaces";
import { BaseService } from "./base.services";

export class SickRequestsService extends BaseService {
	fetchRequests = async (
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

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching all sick requests");
    }
  };

  fetchMyRequests = async (
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

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching all Sick requests");
    }
  };

  fetchMyRequestById = async (requestId: number) => {
    try {
      const response = await axiosInstance.get(`/SickLeaveRequst/Employee/SickLeaveRequests/${requestId}`, {
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      this.handleError(error, `Error fetching Sick request with ID ${requestId}`);
    }
  };

  fetchRequestById = async (requestId: number) => {
    try {
      const response = await axiosInstance.get(`/SickLeaveRequst/Manager/SickLeaveRequests/${requestId}`, {
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      this.handleError(error, `Error fetching Sick request with ID ${requestId}`);
    }
  };

  assign = (formData: FormData) => {
    return axiosInstance.post("/SickLeaveRequst/Manager/AssignSickLeave", formData, {
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
  };

	create = (formData: FormData) => {
		return axiosInstance.post("/SickLeaveRequst/Employee/RequestSickLeave", formData, {
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
		});
	}

  accept = (requestId: number) => {
    return axiosInstance.put(`/SickLeaveRequst/Manager/SickLeave/Accept/${requestId}`, {}, {
      headers: this.getAuthHeaders(),
    });
  }

  reject = (rejectLeaveRequestData: IRejectSickRequestCredentials) => {
    return axiosInstance.put(`/SickLeaveRequst/Manager/SickLeave/Reject`, rejectLeaveRequestData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateReport = async (formData: FormData) => {
		return axiosInstance.put(
			`/SickLeaveRequst/Employee/Request/Sick/UpdateReport`,
			formData,
			{
				headers: {
					...this.getAuthHeaders(),
					"Content-Type": "multipart/form-data",
				},
			}
		);
  };

	updateText = async (data: ISickRequestUpdateTextCredentials) => {
    console.log(data);
    return axiosInstance.put(
			`/SickLeaveRequst/Employee/Request/SickLeave/UpdateText`,
			data,
			{
				headers: {
					...this.getAuthHeaders(),
				},
			}
		);
  };
}
