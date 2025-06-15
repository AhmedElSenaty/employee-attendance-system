import axiosInstance from "../config/axios.config";
import { ISystemDataCredentials } from "../interfaces";
import { BaseService } from "./base.services";

/**
 * Service class for handling system data operations such as fetching and updating
 * attendance and leave configuration settings.
 * 
 * Inherits common functionality from the `BaseService` class, such as authorization headers.
 */
export class SystemDataService extends BaseService {
  /**
   * Fetches the current system data configuration from the server.
   * 
   * @returns A Promise that resolves with the Axios response containing the system data.
   * @throws Will throw an error if the request fails.
   */
  fetch = async () => {
    try {
      const response = await axiosInstance.get("/SystemData", {
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      console.error("Error fetching system data:", error);
      throw error;
    }
  };

  /**
   * Updates the system data configuration on the server.
   * 
   * @param systemData - An object containing the updated system data configuration.
   *                     Should conform to the `ISystemDataCredentials` interface.
   * 
   * @returns A Promise that resolves with the Axios response from the server.
   */
  update = (systemData: ISystemDataCredentials) => {
    return axiosInstance.put("/SystemData", systemData, {
      headers: this.getAuthHeaders(),
    });
  };
}
