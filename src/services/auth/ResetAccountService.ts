import axiosInstance from "../../config/axios.config";
import { IResetAccountCredentials } from "../../interfaces/";

export const resetAccountService = async (
  request: IResetAccountCredentials,
) => {
  const { email, oldPassword, password } = request;
  const response = await axiosInstance.put("/Account/ResetAccount", { email, oldPassword, password });
  return response.data
};
