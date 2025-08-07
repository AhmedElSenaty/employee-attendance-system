import axiosInstance from "../config/axios.config";
import { ChangeVacationCountsRequestDto } from "../interfaces/changeVacationCountRequests";
import { BaseService } from "./base.services";

export class ChangeVacationCountService extends BaseService {
  fetchAll = async (
    page?: number,
    pageSize?: number,
    searchType?: string,
    searchQuery?: string
  ) => {
    try {
      const params = this.buildParams({
        PageIndex: page ?? 1,
        PageSize: pageSize,
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      const response = await axiosInstance.get(
        `/ChangeVacation/Admin/GetChangeVacationCount`,
        {
          params,
          headers: this.getAuthHeaders(),
        }
      );
      return response;
    } catch (error) {
      console.error("Error fetching all entities:", error);
      throw error;
    }
  };

  fetchList = async () => {
    try {
      const response = await axiosInstance.get(`/Entities/List`, {
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error("Error fetching all devices:", error);
      throw error;
    }
  };

  fetchByID = async (entityID: number) => {
    try {
      const response = await axiosInstance.get(
        `/ChangeVacation/Admin/GetChangeVacationCount/${entityID}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return response;
    } catch (error) {
      console.error(`Error fetching entity with ID ${entityID}:`, error);
      throw error;
    }
  };

  create = (formData: FormData) => {
    console.log("from service ======> ", formData);
    return axiosInstance.post(
      `/ChangeVacation/Manager/ChangeVacations`,
      formData,
      {
        headers: {
          ...this.getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  update = (entity: ChangeVacationCountsRequestDto) => {
    console.log("from service ======> ", entity);

    const formData = new FormData();
    formData.append("Id", entity.id.toString());

    if (entity.totalCasual != null)
      formData.append("TotalCasual", entity.totalCasual.toString());
    if (entity.availableCasual != null)
      formData.append("AvailableCasual", entity.availableCasual.toString());
    if (entity.totalOrdinary != null)
      formData.append("TotalOrdinary", entity.totalOrdinary.toString());
    if (entity.availableOrdinary != null)
      formData.append("AvailableOrdinary", entity.availableOrdinary.toString());
    if (entity.availableLeaveRequest != null)
      formData.append(
        "AvailableLeaveRequest",
        entity.availableLeaveRequest.toString()
      );
    if (entity.totalLeaveRequest != null)
      formData.append("TotalLeaveRequest", entity.totalLeaveRequest.toString());

    if (entity.description) formData.append("Description", entity.description);
    if (entity.comment) formData.append("Comment", entity.comment);

    if (entity.reportImageUrl) formData.append("File", entity.reportImageUrl);

    return axiosInstance.put(`/ChangeVacation/Edit`, formData, {
      headers: {
        ...this.getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
  };

  accept = async (id: number) => {
    return await axiosInstance.put(
      `/ChangeVacation/Admin/AcceptChangeVacation/${id}`,
      null,
      {
        headers: this.getAuthHeaders(),
      }
    );
  };

  reject = async (id: number) => {
    return await axiosInstance.put(
      `/ChangeVacation/Admin/RejectChangeVacation/${id}`,
      null,
      {
        headers: this.getAuthHeaders(),
      }
    );
  };
}
