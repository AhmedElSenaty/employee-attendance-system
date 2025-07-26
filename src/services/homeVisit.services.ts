import axiosInstance from "../config/axios.config";
import {
  AssignRequest,
  BaseSickRequest,
  CreateRequest,
  UpdateRequest,
} from "../interfaces/HomeVisit.interfaces";
import { BaseService } from "./base.services";

export class HomeVisitService extends BaseService {
  fetchMyRequests = async (
    page?: number,
    pageSize?: number,
    startDate?: string,
    endDate?: string
  ) => {
    try {
      const params = this.buildParams({
        PageIndex: page ?? 1,
        PageSize: pageSize,
        StartDate: startDate,
        EndDate: endDate,
      });

      const response = await axiosInstance.get(
        "/HomeVisit/Employee/HomeVisits",
        {
          params,
          headers: this.getAuthHeaders(),
        }
      );

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching all ordinary requests");
    }
  };

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

      const response = await axiosInstance.get("/HomeVisit/Manager/HomeVisit", {
        params,
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching all ordinary requests");
    }
  };

  fetchMyRequestById = async (requestId: number) => {
    try {
      const response = await axiosInstance.get(
        `/HomeVisit/Employee/HomeVisit/${requestId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching ordinary request");
    }
  };

  fetchRequestById = async (requestId: number) => {
    try {
      const response = await axiosInstance.get(
        `/HomeVisit/Manager/HomeVisit/${requestId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return response;
    } catch (error) {
      this.handleError(error, "Error fetching ordinary request");
    }
  };

  assign = (request: AssignRequest) => {
    return axiosInstance.post("/HomeVisit/Manager/AssignHomeVisit", request, {
      headers: this.getAuthHeaders(),
    });
  };

  create = (request: CreateRequest) => {
    return axiosInstance.post("/HomeVisit/Employee/RequestHomeVisit", request, {
      headers: this.getAuthHeaders(),
    });
  };

  update = (request: UpdateRequest, userRole: string) => {
    return axiosInstance.put(
      `/HomeVisit/${userRole}/UpdateRequestHomeVisit`,
      request,
      {
        headers: this.getAuthHeaders(),
      }
    );
  };

  changeToSickRequest = (request: BaseSickRequest, userRole: string) => {
    return axiosInstance.put(
      `/HomeVisit/${userRole}/ChangeToSickRequst`,
      request,
      {
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };
}
