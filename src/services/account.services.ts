import axiosInstance from "../config/axios.config";
import { capitalizeFirstLetter } from "../utils";
import { BaseService } from "./base.services";

export class AccountService extends BaseService {
  getWorkingHours = async (id:string,token:string) => {
    try {
      const response = await axiosInstance.get(
        `/Employee/EmployeeWorkingHours/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Error updating account password:", error);
      throw error;
    }
  };
  updateAccountPassword = async (data: {
    userId: string;
    password: string;
    oldPassword?: string;
  }) => {
    try {
      const response = await axiosInstance.post(
        `/Account/UpdatePassword`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return response;
    } catch (error) {
      console.error("Error updating account password:", error);
      throw error;
    }
  };

  updateMyPassword = async (data: {
    password: string;
    oldPassword: string;
  }) => {
    try {
      const response = await axiosInstance.post(
        `/Account/updateMyPassword`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return response;
    } catch (error) {
      console.error("Error updating my password:", error);
      throw error;
    }
  };

  unblockAccountByID = async (id: string) => {
    try {
      const response = await axiosInstance.put(
        `/Account/unblockAccount/${id}`,
        {},
        {
          headers: this.getAuthHeaders(),
        }
      );

      return response;
    } catch (error) {
      console.error("Error unblocking account:", error);
      throw error;
    }
  };

  resetEmployeePassword = async (id: string) => {
    try {
      const response = await axiosInstance.put(
        `/Account/ResetEmployeePassword/${id}`,
        {},
        {
          headers: this.getAuthHeaders(),
        }
      );

      return response;
    } catch (error) {
      console.error("Error unblocking account:", error);
      throw error;
    }
  };

  fetchMe = async (userRole: string) => {
    try {
      const response = await axiosInstance.get(
        `/${capitalizeFirstLetter(userRole)}/me`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      return response;
    } catch (error) {
      console.error("Error fetching my account:", error);
      throw error;
    }
  };
}
