import axiosInstance from "../config/axios.config";
import { ILoggedInUser, ILoginCredentials, ILoginResponse, IResetAccountCredentials } from "../interfaces";

export class AuthService {
  login = async (credentials: ILoginCredentials): Promise<ILoginResponse> => {
    try {
      const response = await axiosInstance.post(
        `/Account/Login`,
        {
          email: credentials.email,
          password: credentials.password,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  resetAccount = async (request: IResetAccountCredentials) => {
    try {
      const { email, oldPassword, password } = request;
      const response = await axiosInstance.put("/Account/ResetAccount", { email, oldPassword, password });

      return response.data
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  parseToken = (token: string): ILoggedInUser => {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));

      return {
        token,
        id: tokenPayload.nameid,
        role: tokenPayload.type,
        name: tokenPayload.name,
        imageUrl: null,
        rememberMe: false,
        permissions: [],
        departmentId: tokenPayload.departmentId,
      };
    } catch (error) {
      console.error("Error parsing token:", error);
      throw error;
    }
  };
}
