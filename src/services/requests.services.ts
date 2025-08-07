import { number } from "yup";
import axiosInstance from "../config/axios.config";
import {
  AssignGenericRequest,
  IAssignRequest,
  IRejectRequestCredentials,
  ISoftDeleteRequestCredentials,
} from "../interfaces/request.interfaces";
import { EditRequestFormValues } from "../validation/request.schema";
import { BaseService } from "./base.services";

export class RequestService extends BaseService {
  fetchRequests = async () => {
    try {
      const response = await axiosInstance.get("/Request/Requests", {
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching all requests");
    }
  };

  fetchAllRequests = async (
    page?: number,
    pageSize?: number,
    startDate?: string,
    endDate?: string,
    status?: number,
    leaveType?: number,
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
        LeaveType: leaveType,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get("/Request/AllRequests", {
        params,

        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching all requests");
    }
  };

  fetchAllVacationSaver = async (
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

      const response = await axiosInstance.get("/Request/AllVacationSaver", {
        params,

        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching all requests");
    }
  };

  fetchAllSubDepartmentRequests = async (
    page?: number,
    pageSize?: number,
    startDate?: string,
    endDate?: string,
    status?: number,
    leaveType?: number,
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
        Type: leaveType,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        "/Request/RequestsForSubDepartment",
        {
          params,

          headers: this.getAuthHeaders(),
        }
      );

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching all requests");
    }
  };

  fetchRequestsSummary = async (
    page?: number,
    pageSize?: number,
    startDate?: string,
    endDate?: string,
    status?: number,
    leaveType?: number,
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
        Type: leaveType,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get("/Request/AllRequestsSummary", {
        params,

        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      this.handleError(error, "Error fetching all requests");
    }
  };

  fetchGenaricRequests = async (
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

      const response = await axiosInstance.get("/Request/GenaricRequests", {
        params,

        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching all requests");
    }
  };

  accept = (requestId: number) => {
    return axiosInstance.put(
      `/Request/accept/${requestId}`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );
  };

  reject = (
    requestId: string,
    rejectRequestCredentials: IRejectRequestCredentials
  ) => {
    return axiosInstance.put(
      `/Request/reject/${requestId}`,
      rejectRequestCredentials,
      {
        headers: this.getAuthHeaders(),
      }
    );
  };

  softDelete = (
    softDeleteRequestCredentials: ISoftDeleteRequestCredentials
  ) => {
    return axiosInstance.put(
      `/Request/Manager/SoftDeleteRequest`,
      softDeleteRequestCredentials,
      {
        headers: this.getAuthHeaders(),
      }
    );
  };

  // old request assign method
  assign = (data: IAssignRequest) => {
    return axiosInstance.post("/Request/Manager/AssignGenericRequest", data, {
      headers: this.getAuthHeaders(),
    });
  };

  // generic request assign method
  assignGeneric = (data: AssignGenericRequest) => {
    return axiosInstance.post(
      "/Request/Manager/AssignGenericRequestttttt",
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
  };

  editRequest = (data: EditRequestFormValues) => {
    return axiosInstance.put(`/Request/Manager/EditAcceptedRequest`, data, {
      headers: this.getAuthHeaders(),
    });
  };

  getRequestById = async (requestId: number) => {
    if (requestId > 0) {
      const response = await axiosInstance.get(
        `/Request/request/${requestId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    }
  };
}
