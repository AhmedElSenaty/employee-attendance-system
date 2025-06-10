import axiosInstance from "../config/axios.config";
import { BaseService } from "./base.services";
import { IMissionCredentials, IRejectMissionCredentials, IAssignMissionCredentials } from "../interfaces/mission.interfaces";


export class MissionService extends BaseService {

    fetchMissionRequests = async(
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

              const response = await axiosInstance.get("/MissionRequest/Manager/Requests", {
                params,
                headers: this.getAuthHeaders(),
              });

              return response.data;

        } catch (error) {
            this.handleError(error, "Error fetching all mission requests");
        }
    }

    fetchMyMissionRequests = async(
        page?: number,
        pageSize?: number,
        startDate?: string,
        endDate?: string,
        status?: number,
    ) => {
        try {
            const params = {
                PageIndex: page ?? 1,
                PageSize: pageSize,
                StartDate: startDate,
                EndDate: endDate,
                Status: status,
            }

            const response = await axiosInstance.get("/MissionRequest/Employee/Missions", {
                params,
                headers: this.getAuthHeaders(),
            });

            return response.data;
        } catch (error) {
            this.handleError(error, "Error fetching all mission requests");
        }
    }

    fetchMissionRequestById = async(requestId: number) => {
        try{
            const response = await axiosInstance.get(`/MissionRequest/Manager/Missions/${requestId}`, {
                headers: this.getAuthHeaders(),
            });

            return response.data;
        }catch(error){
            this.handleError(error, "Error fetching mission");
        }
    }

    fetchMyMissionRequestById = async(requestId: number) => {
        try{
            const response = await axiosInstance.get(`/MissionRequest/Employee/Missions/${requestId}`, {
                headers: this.getAuthHeaders(),
            });
            
            return response.data;
        }catch(error){
            this.handleError(error, "Error fetching mission");
        }
    }

    create = (missionRequest: IMissionCredentials) => {
        return axiosInstance.post("/MissionRequest/Employee/RequestMission", missionRequest, {
            headers: this.getAuthHeaders(),
        });
    }

    assign = (assignMissionCredentials: IAssignMissionCredentials) => {
        return axiosInstance.post("/MissionRequest/Manager/AssignMission", assignMissionCredentials, {
            headers: this.getAuthHeaders(),
        });
    }

    reject = (rejectMissionCredentials: IRejectMissionCredentials) => {
        return axiosInstance.put("/MissionRequest/Manager/RejectMissionRequest", rejectMissionCredentials, {
            headers: this.getAuthHeaders(),
        });
    }

    accept = (requestId: number) => {
        return axiosInstance.put(`/MissionRequest/Manager/AcceptMissionRequest/${requestId}`, {}, {
            headers: this.getAuthHeaders(),
        });
    }

    update = (missionRequest: IMissionCredentials) => {
        return axiosInstance.put("/MissionRequest/Employee/UpdateMission", missionRequest, {
            headers: this.getAuthHeaders(),
        });
    }
}
