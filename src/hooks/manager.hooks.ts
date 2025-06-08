import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  IManagerCredentials,
  IErrorResponse,
  initialMetadata,
  UseGetAllManagersReturn,
  UseGetManagerByIDReturn,
  UseGetManagersCountReturn,
} from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { ManagerService } from "../services";

export const MANAGERS_QUERY_KEY = "managers";
export const MANAGER_DETAILS_QUERY_KEY = "managerDetails";
export const MANAGERS_COUNT_QUERY_KEY = "managersCount";

export const useGetAllManagers = (
  page: number,
  pageSize: number,
  searchKey: string,
  debouncedSearchQuery: string
): UseGetAllManagersReturn => {
  const token = useUserStore((state) => state.token);
  const managerService = new ManagerService(token);

  const { data, isLoading } = useQuery({
    queryKey: [MANAGERS_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => managerService.fetchAll(page, pageSize, searchKey, debouncedSearchQuery),
    enabled: !!token,
  });

  return {
    managers: data?.data?.managers || [],
    metadata: data?.data?.metadata || initialMetadata,
    isManagersDataLoading: isLoading,
  };
};

export const useGetManagerByID = (
  managerID: string,
  resetInputs?: (data: IManagerCredentials) => void
): UseGetManagerByIDReturn => {
  const token = useUserStore((state) => state.token);
  const managerService = new ManagerService(token);

  const { data, isLoading } = useQuery({
    queryKey: [MANAGER_DETAILS_QUERY_KEY, managerID],
    queryFn: () => managerService.fetchByID(managerID),
    enabled: !!managerID && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetInputs?.({
        username: data.data.username,
        email: data.data.email,
        password: "",
      });
    }
  }, [data, resetInputs]);

  return {
    manager: data?.data,
    isManagerDataLoading: isLoading,
  };
};

export const useGetManagersCount = (): UseGetManagersCountReturn => {
  const token = useUserStore((state) => state.token);
  const managerService = new ManagerService(token);

  const { data, isLoading } = useQuery({
    queryKey: [MANAGERS_COUNT_QUERY_KEY],
    queryFn: () => managerService.fetchCount(),
    enabled: !!token,
  });

  return {
    totalCount: data?.data?.totalCount || 0,
    lockedCount: data?.data?.lockedCount || 0,
    blockedCount: data?.data?.blockedCount || 0,
    isManagersCountLoading: isLoading,
  };
};

export const useCreateManager = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const managerService = new ManagerService(token);

  return useMutation({
    mutationFn: (managerData: IManagerCredentials) => managerService.create(managerData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [MANAGERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MANAGERS_COUNT_QUERY_KEY] });

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
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const managerService = new ManagerService(token);

  return useMutation({
    mutationFn: (managerData: IManagerCredentials) => managerService.update(managerData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [MANAGERS_QUERY_KEY] });

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
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const managerService = new ManagerService(token);

  return useMutation({
    mutationFn: (managerID: string) => managerService.delete(managerID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [MANAGERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MANAGERS_COUNT_QUERY_KEY] });

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
