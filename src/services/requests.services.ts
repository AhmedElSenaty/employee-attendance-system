import axiosInstance from "../config/axios.config";
import { IAssignRequest, IRejectRequestCredentials, ISoftDeleteRequestCredentials } from "../interfaces/request.interfaces";
import { EditRequestFormValues } from "../validation/request.schema";
import { BaseService } from "./base.services";

export class RequestService extends BaseService {
	fetchRequests = async(
	) => {
			try {

						const response = await axiosInstance.get("/Request/Requests", {
							headers: this.getAuthHeaders(),
						});

						return response;

			} catch (error) {
					this.handleError(error, "Error fetching all requests");
			}
	}

	accept = (requestId: number) => {
		return axiosInstance.put(
		`/Request/accept/${requestId}`,
		{},
		{
			headers: this.getAuthHeaders(),
		}
		);
	};

	reject = (requestId: string, rejectRequestCredentials: IRejectRequestCredentials) => {
		return axiosInstance.put(`/Request/reject/${requestId}`, rejectRequestCredentials, {
				headers: this.getAuthHeaders(),
		});
	}

	softDelete = (softDeleteRequestCredentials: ISoftDeleteRequestCredentials) => {
			return axiosInstance.put(`/Request/Manager/SoftDeleteRequest`, softDeleteRequestCredentials, {
				headers: this.getAuthHeaders(),
		});
	}

	assign = (data: IAssignRequest) => {
		return axiosInstance.post("/Request/Manager/AssignGenericRequest", data, {
		headers: this.getAuthHeaders(),
		});
	};

	  editRequest = (data: EditRequestFormValues) => {
		console.log(data);
		
		return axiosInstance.put(`/Request/Manager/EditAcceptedRequest`, data, {
		headers: this.getAuthHeaders(),
		});
	};

	getRequestById = (requestId: number) => {
		return axiosInstance.get(`/Request/request/${requestId}`, {
			headers: this.getAuthHeaders(),
		});
	};

}
