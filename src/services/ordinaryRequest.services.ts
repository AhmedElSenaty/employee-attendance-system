import axiosInstance from "../config/axios.config";
import { IOrdinaryRequestCredentials, IRejectOrdinaryRequestCredentials } from "../interfaces";
import { BaseService } from "./base.services";

export class OrdinaryRequestService extends BaseService {

	fetchOrdinaryRequests = async(
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

						const response = await axiosInstance.get("/OrdinaryRequest/Manager/OrdinaryRequests", {
							params,
							headers: this.getAuthHeaders(),
						});

						return response.data;

			} catch (error) {
					this.handleError(error, "Error fetching all ordinary requests");
			}
	}

	fetchMyOrdinaryRequests = async(
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

					const response = await axiosInstance.get("/OrdinaryRequest/Employee/OrdinaryRequests", {
							params,
							headers: this.getAuthHeaders(),
					});

					return response.data;
			} catch (error) {
					this.handleError(error, "Error fetching all ordinary requests");
			}
	}

	fetchOrdinaryRequestById = async(requestId: number) => {
			try{
					const response = await axiosInstance.get(`/OrdinaryRequest/Manager/OrdinaryRequests/${requestId}`, {
							headers: this.getAuthHeaders(),
					});

					return response.data;
			}catch(error){
					this.handleError(error, "Error fetching ordinary request");
			}
	}

	fetchMyOrdinaryRequestById = async(requestId: number) => {
			try{
					const response = await axiosInstance.get(`/OrdinaryRequest/Employee/OrdinaryRequests/${requestId}`, {
							headers: this.getAuthHeaders(),
					});
					
					return response.data;
			}catch(error){
					this.handleError(error, "Error fetching ordinary request");
			}
	}

	create = (ordinaryRequest: IOrdinaryRequestCredentials) => {
			return axiosInstance.post("/OrdinaryRequest/Employee/RequestOrdinaryLeave", ordinaryRequest, {
					headers: this.getAuthHeaders(),
			});
	}

	accept = (requestId: number) => {
		return axiosInstance.put(`/OrdinaryRequest/Manager/AcceptOrdinaryLeave/${requestId}`, {}, {
				headers: this.getAuthHeaders(),
		});
	}

	reject = (rejectOrdinaryRequestCredentials: IRejectOrdinaryRequestCredentials) => {
			return axiosInstance.put("/OrdinaryRequest/Manager/RejectOrdinaryLeave", rejectOrdinaryRequestCredentials, {
					headers: this.getAuthHeaders(),
			});
	}

	update = (ordinaryRequest: IOrdinaryRequestCredentials) => {
			return axiosInstance.put("/OrdinaryRequest/Employee/EditOrdinaryLeave", ordinaryRequest, {
					headers: this.getAuthHeaders(),
			});
	}
}
