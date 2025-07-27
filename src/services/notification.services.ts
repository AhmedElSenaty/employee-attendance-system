import axiosInstance from "../config/axios.config";
import { BaseService } from "./base.services";

export class NotificationService extends BaseService {
  getNotificationCount = async () => {
    try {
      const response = await axiosInstance.get(
        `/Request/RequestsNotificationCount`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return response;
    } catch (error) {
      console.error(`Error fetching notification count`, error);
      throw error;
    }
  };
}
