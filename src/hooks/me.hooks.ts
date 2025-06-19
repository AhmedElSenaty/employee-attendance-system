import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { AccountService, AdminService, EmployeeService } from "../services";
import { AdminProfileCredentials, EmployeeProfileCredentials, IErrorResponse } from "../interfaces";
import { QueryKeys } from "../constants";
import { useMemo } from "react";

export const useAccountService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new AccountService(token);
  }, [token]);

  return service;
};


export const useFetchMe = () => {
  const token = useUserStore((state) => state.token);
  const userRole = useUserStore((state) => state.role);
  const accountService = useAccountService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.FETCH_ME, userRole],
    queryFn: () => accountService.fetchMe(userRole),
    enabled: !!token && !!userRole,
  });

  return {
    me: data?.data?.data,
    isLoading,
  };
};

export const useUpdateAdminProfile = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const adminService = new AdminService(token);

  return useMutation({
    mutationFn: (adminData: AdminProfileCredentials) => adminService.updateMyProfile(adminData),
    onSuccess: ({ status, data }) => {
      if (status === 200) {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.FETCH_ME, "admin"] });
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

export const useUpdateEmployeeProfile = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const employeeService = new EmployeeService(token);

  return useMutation({
    mutationFn: (employeeData: EmployeeProfileCredentials) => employeeService.updateMyProfile(employeeData),
    onSuccess: ({ status, data }) => {
      if (status === 200) {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.FETCH_ME, "employee"] });
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

export const useUploadEmployeeImage = () => {
  const token = useUserStore((state) => state.token);
  const userID = useUserStore((state) => state.id);
  const currentUser = useUserStore.getState();
  const setUser = useUserStore((state) => state.setUser);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const employeeService = new EmployeeService(token);

  return useMutation({
    mutationFn: (file: File) => employeeService.uploadImage(userID, file),
    onSuccess: ({ status, data }) => {
      if (status === 200) {
        queryClient.invalidateQueries({ queryKey: [QueryKeys.FETCH_ME, "employee"] });

        if (data?.data?.profileImage) {
          setUser({ ...currentUser, imageUrl: data.data.profileImage });
        }

        const message = getTranslatedMessage(data?.message ?? "Profile image updated", language);
        showToast("success", message);
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError<IErrorResponse>;
      handleApiError(axiosError, language);
    },
  });
};
