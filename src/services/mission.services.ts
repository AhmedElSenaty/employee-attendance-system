import axiosInstance from "../config/axios.config";
import { IAssignMissionRequestCredentials, IMissionRequestCredentials, IRejectMissionRequestCredentials } from "../interfaces";
import { BaseService } from "./base.services";

export class MissionRequestService extends BaseService {

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

	create = (missionRequest: IMissionRequestCredentials) => {
			return axiosInstance.post("/MissionRequest/Employee/RequestMission", missionRequest, {
					headers: this.getAuthHeaders(),
			});
	}

	accept = (requestId: number) => {
		return axiosInstance.put(`/MissionRequest/Manager/AcceptMissionRequest/${requestId}`, {}, {
				headers: this.getAuthHeaders(),
		});
	}

	reject = (rejectMissionCredentials: IRejectMissionRequestCredentials) => {
			return axiosInstance.put("/MissionRequest/Manager/RejectMissionRequest", rejectMissionCredentials, {
					headers: this.getAuthHeaders(),
			});
	}

	assign = (missionRequest: IAssignMissionRequestCredentials) => {
		return axiosInstance.post("/MissionRequest/Manager/AssignMission", missionRequest, {
				headers: this.getAuthHeaders(),
		});
	}

	update = (missionRequest: IMissionRequestCredentials) => {
			return axiosInstance.put("/MissionRequest/Employee/UpdateMission", missionRequest, {
					headers: this.getAuthHeaders(),
			});
	}
}
