import axiosInstance from "../../config/axios.config";
import { ILoggedInUser, ILoginCredentials, ILoginResponse } from "../../interfaces";

export const login = async (credentials: ILoginCredentials): Promise<ILoginResponse> => {
  const response = await axiosInstance.post(`/Account/Login`, { email: credentials.email, password: credentials.password });
  return response.data;
};

export const parseToken = (token: string): ILoggedInUser => {
  const tokenPayload = JSON.parse(atob(token.split('.')[1]));
  return {
    token,
    id: tokenPayload.nameid,
    role: tokenPayload.type,
    rememberMe: false,
    permissions: []
  };
};