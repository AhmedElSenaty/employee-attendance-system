import axiosInstance from "../config/axios.config";
import {
  ILoggedInUser,
  ILoginCredentials,
  ILoginResponse,
  IResetAccountCredentials,
} from "../interfaces";
// import { useLanguageStore } from "../store";
export class AuthService {
  login = async (credentials: ILoginCredentials): Promise<ILoginResponse> => {
    try {
      const response = await axiosInstance.post(`/Account/Login`, {
        email: credentials.email,
        password: credentials.password,
      });

      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  resetAccount = async (request: IResetAccountCredentials) => {
    try {
      const { email, oldPassword, password } = request;
      const response = await axiosInstance.put("/Account/ResetAccount", {
        email,
        oldPassword,
        password,
      });

      return response.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };
  resetPassword = async (Oldemail: string) => {
    try {
      const res = await axiosInstance.post("/Account/ForgotPassword", {
        email: Oldemail,
      });
      return res.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  confirmReset = async (
    newPassword: string,
    confirmPass: string,
    mail: string | null,
    Otp: string
  ) => {
    try {
      const res = await axiosInstance.post("Account/ConfirmForgotPassword", {
        email: mail,
        newPassword: newPassword,
        confirmPassword: confirmPass,
        Otp: Otp,
      });
      return res.data;
    } catch (error) {
      console.error("Error during Reseting password:", error);
      throw error;
    }
  };

  parseToken = (token: string): ILoggedInUser => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url
        .replace(/-/g, "+") // base64url to base64
        .replace(/_/g, "/")
        .padEnd(Math.ceil(base64Url.length / 4) * 4, "="); // fix padding

      const tokenPayload = JSON.parse(atob(base64));

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
