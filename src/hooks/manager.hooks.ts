import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  IErrorResponse,
  initialMetadata,
  ManagerCredentials,
} from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import { useLanguageStore, useUserStore } from "../store/";
import { ManagerService } from "../services";
import { QueryKeys } from "../constants";
import { ManagerFormValues } from "../validation";


export const useManagerService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new ManagerService(token);
  }, [token]);

  return service;
};

export const useGetAllManagers = (
  page?: number,
  pageSize?: number,
  searchKey?: string,
  searchQuery?: string
) => {
  const token = useUserStore((state) => state.token);
  const managerService = useManagerService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.Managers.All, 
      page, 
      pageSize, 
      `${searchKey && searchQuery ? [searchKey, searchQuery] : ""}`
    ],
    queryFn: () => managerService.fetchAll(page, pageSize, searchKey, searchQuery),
    enabled: !!token,
  });

  return {
    managers: data?.data?.data?.managers || [],
    metadata: data?.data?.data?.metadata || initialMetadata,
    isLoading,
  };
};

export const useGetManagerByID = (
  managerID: string,
  resetInputs?: (data: ManagerFormValues) => void
) => {
  const token = useUserStore((state) => state.token);
  const managerService = useManagerService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Managers.Details, managerID],
    queryFn: () => managerService.fetchByID(managerID),
    enabled: !!managerID && !!token,
  });

  useEffect(() => {
    if (data?.data?.data) {
      resetInputs?.({
        username: data.data.data.username,
        email: data.data.data.email,
        password: "",
      });
    }
  }, [data, resetInputs]);

  return {
    manager: data?.data?.data,
    isLoading,
  };
};

export const useGetManagersCount = () => {
  const token = useUserStore((state) => state.token);
  const managerService = useManagerService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Managers.Count],
    queryFn: () => managerService.fetchCount(),
    enabled: !!token,
  });

  return {
    totalCount: data?.data?.data?.totalCount || 0,
    lockedCount: data?.data?.data?.lockedCount || 0,
    blockedCount: data?.data?.data?.blockedCount || 0,
    isLoading,
  };
};

export const useCreateManager = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const managerService = useManagerService();

  return useMutation({
    mutationFn: (managerData: ManagerCredentials) => managerService.create(managerData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Managers.All] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Managers.Count] });

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

export const useUpdateManager = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const managerService = useManagerService();

  return useMutation({
    mutationFn: (managerData: ManagerCredentials) => managerService.update(managerData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Managers.All] });

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

export const useDeleteManager = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const managerService = useManagerService();

  return useMutation({
    mutationFn: (managerID: string) => managerService.delete(managerID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Managers.All] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Managers.Count] });

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
