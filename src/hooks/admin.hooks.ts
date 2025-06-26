import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { AdminService } from "../services";
import { QueryKeys } from "../constants";
import { IErrorResponse, initialMetadata } from "../interfaces";
import { AdminFormValues } from "../validation";

export const useAdminService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new AdminService(token);
  }, [token]);

  return service;
};
export const useGetAllAdmins = (
  page?: number,
  pageSize?: number,
  searchKey?: string,
  searchQuery?: string
) => {
  const token = useUserStore((state) => state.token);
  const adminService = useAdminService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Admins.All, 
      page,
      pageSize,
      `${searchKey && searchQuery ? [searchKey, searchQuery] : ""}`,
    ],
    queryFn: () => adminService.fetchAll(page, pageSize, searchKey, searchQuery),
    enabled: !!token,
  });

  return {
    admins: data?.data?.data?.admins || [],
    count: data?.data?.data?.totalCount || 0,
    metadata: data?.data?.data?.metadata || initialMetadata,
    isAdminsDataLoading: isLoading,
  };
};

export const useGetAdminByID = (
  adminID: string,
  resetInputs?: (data: AdminFormValues) => void
) => {
  const token = useUserStore((state) => state.token);
  const adminService = useAdminService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Admins.Details, adminID],
    queryFn: () => adminService.fetchByID(adminID),
    enabled: !!adminID && !!token,
  });

  useEffect(() => {
    if (data?.data?.data) {
      resetInputs?.({
        username: data.data.data.username,
        title: data.data.data.title,
        email: data.data.data.email,
        password: "",
      });
    }
  }, [data, resetInputs]);

  return {
    admin: data?.data?.data,
    isAdminDataLoading: isLoading,
  };
};

export const useCreateAdmin = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const adminService = useAdminService();

  return useMutation({
    mutationFn: (adminData: AdminFormValues) => adminService.create(adminData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Admins.All] });
      if (status === 201) {
        const message = getTranslatedMessage(data.message ?? "", language);
        showToast("success", message);
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError<IErrorResponse>;
      handleApiError(axiosError, language);
    },
  });
};

export const useUpdateAdmin = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const adminService = useAdminService();

  return useMutation({
    mutationFn: (adminData: AdminFormValues) => adminService.update(adminData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Admins.All] });
      if (status === 200) {
        const message = getTranslatedMessage(data.message ?? "", language);
        showToast("success", message);
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError<IErrorResponse>;
      handleApiError(axiosError, language);
    },
  });
};

export const useDeleteAdmin = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const adminService = useAdminService();

  return useMutation({
    mutationFn: (adminID: string) => adminService.delete(adminID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Admins.All] });
      if (status === 200) {
        const message = getTranslatedMessage(data.message ?? "", language);
        showToast("success", message);
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError<IErrorResponse>;
      handleApiError(axiosError, language);
    },
  });
};
