import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IAdminCredentials, IErrorResponse, initialMetadata, UseGetAdminByIDReturn, UseGetAllAdminsReturn } from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { AdminService } from "../services";

export const ADMINS_QUERY_KEY = "admins";
export const ADMIN_DETAILS_QUERY_KEY = "adminDetails";

export const useGetAllAdmins = (
  page: number,
  pageSize: number,
  searchKey: string,
  debouncedSearchQuery: string
): UseGetAllAdminsReturn => {
  const token = useUserStore((state) => state.token);
  const adminService = new AdminService(token);

  const { data, isLoading } = useQuery({
    queryKey: [ADMINS_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => adminService.fetchAll(page, pageSize, searchKey, debouncedSearchQuery),
    enabled: !!token,
  });

  return {
    admins: data?.data?.admins || [],
    totalAdmins: data?.data?.totalCount || 0,
    metadata: data?.data?.metadata || initialMetadata,
    isAdminsDataLoading: isLoading,
  };
};

export const useGetAdminByID = (
  adminID: string,
  resetInputs?: (data: IAdminCredentials) => void
): UseGetAdminByIDReturn => {
  const token = useUserStore((state) => state.token);
  const adminService = new AdminService(token);

  const { data, isLoading } = useQuery({
    queryKey: [ADMIN_DETAILS_QUERY_KEY, adminID],
    queryFn: () => adminService.fetchByID(adminID),
    enabled: !!adminID && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetInputs?.({
        username: data.data.username,
        title: data.data.title,
        email: data.data.email,
        password: "", // clear password for security
      });
    }
  }, [data, resetInputs]);

  return {
    admin: data?.data,
    isAdminDataLoading: isLoading,
  };
};

export const useCreateAdmin = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const adminService = new AdminService(token);

  return useMutation({
    mutationFn: (adminData: IAdminCredentials) => adminService.create(adminData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [ADMINS_QUERY_KEY] });
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
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const adminService = new AdminService(token);

  return useMutation({
    mutationFn: (adminData: IAdminCredentials) => adminService.update(adminData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [ADMINS_QUERY_KEY] });
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
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const adminService = new AdminService(token);

  return useMutation({
    mutationFn: (adminID: string) => adminService.delete(adminID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [ADMINS_QUERY_KEY] });
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
