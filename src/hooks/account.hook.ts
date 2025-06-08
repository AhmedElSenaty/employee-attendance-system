import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { AccountService } from "../services";


// ✅ Update Another User's Password
export const useUpdateAccountPassword = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const accountService = new AccountService(token);

  return useMutation({
    mutationFn: (data: { userId: string; password: string; oldPassword?: string }) =>
      accountService.updateAccountPassword(data),

    onSuccess: ({ status, data }) => {
      if (status === 200) {
        const message = getTranslatedMessage(data?.message ?? "", language);
        showToast("success", message);
      }
    },

    onError: (error) => {
      const axiosError = error as AxiosError<IErrorResponse>;
      handleApiError(axiosError, language);
    },
  });
};

// ✅ Update My Password
export const useUpdateMyPassword = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const accountService = new AccountService(token);

  return useMutation({
    mutationFn: (data: { password: string; oldPassword: string }) =>
      accountService.updateMyPassword(data),

    onSuccess: ({ status, data }) => {
      if (status === 200) {
        const message = getTranslatedMessage(data?.message ?? "", language);
        showToast("success", message);
      }
    },

    onError: (error) => {
      const axiosError = error as AxiosError<IErrorResponse>;
      handleApiError(axiosError, language);
    },
  });
};

// ✅ Unblock Account by ID
export const useUnblockAccount = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const accountService = new AccountService(token);

  return useMutation({
    mutationFn: (id: string) => accountService.unblockAccountByID(id),

    onSuccess: (response, id ) => {
      // Invalidate relevant queries to refresh data after unblocking
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["managers"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["adminDetails", id] });
      queryClient.invalidateQueries({ queryKey: ["managerDetails", id] });
      queryClient.invalidateQueries({ queryKey: ["employeeDetails", id] });
      
      if (response.status === 200) {
        const message = getTranslatedMessage(response.data?.message ?? "", language);
        showToast("success", message);
      }
    },

    onError: (error) => {
      const axiosError = error as AxiosError<IErrorResponse>;
      handleApiError(axiosError, language);
    },
  });
};
