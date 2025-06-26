import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IOrdinaryRequestCredentials, IOrdinaryRequestData, IRejectOrdinaryRequestCredentials } from "../interfaces";
import { useEffect, useMemo } from "react";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { OrdinaryRequestService } from "../services/ordinaryRequest.services";
import { AxiosError } from "axios";
import { IErrorResponse, initialMetadata } from "../interfaces";
import { QueryKeys } from "../constants";

export const useOrdinaryRequestService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new OrdinaryRequestService(token);
  }, [token]);

  return service;
};

export const useGetOrdinaryRequests = (
  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string,
  status?: number,
  searchType?: string,
  searchQuery?: string
) => {
  const token = useUserStore((state) => state.token);
  const ordinaryRequestService = useOrdinaryRequestService();
  
  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.OrdinaryRequests.All, page, pageSize, startDate, endDate, status, 
      `${searchType && searchQuery ? [searchType, searchQuery] : ""}`, 
    ],
    queryFn: () => ordinaryRequestService.fetchOrdinaryRequests(page, pageSize, startDate, endDate, status, searchType, searchQuery),
    enabled: !!token,
  });

  return {
    ordinaryRequests: data?.data?.data?.requests || [],
    totalRequests: data?.data?.data?.totalCount || 0,
    metadata: data?.data?.data?.metadata || initialMetadata,
    isOrdinaryRequestsLoading: isLoading,
  };
};

export const useGetMyOrdinaryRequests = (
  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string,
  status?: number
) => {
  const token = useUserStore((state) => state.token);
  const ordinaryRequestService = useOrdinaryRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.OrdinaryRequests.My, page, pageSize, startDate, endDate, status],
    queryFn: () => ordinaryRequestService.fetchMyOrdinaryRequests(page, pageSize, startDate, endDate, status),
    enabled: !!token,
  });

  return {
    ordinaryRequests: data?.data?.data?.requests || [],
    totalRequests: data?.data?.data?.totalCount || 0,
    metadata: data?.data?.data?.metadata || initialMetadata,
    isOrdinaryRequestsLoading: isLoading,
  };
};

export const useGetOrdinaryRequestByID = (
  requestId: number,
) => {
  const token = useUserStore((state) => state.token);
  const ordinaryRequestService = useOrdinaryRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.OrdinaryRequests.Details, requestId],
    queryFn: () => ordinaryRequestService.fetchOrdinaryRequestById(requestId),
    enabled: !!requestId && !!token,
  });

  return {
    ordinaryRequest: data?.data?.data,
    isOrdinaryRequestLoading: isLoading,
  };
};

export const useGetMyOrdinaryRequestByID = (
  requestId: number,
  resetInputs?: (data: IOrdinaryRequestData) => void
) => {
  const token = useUserStore((state) => state.token);
  const ordinaryRequestService = useOrdinaryRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.OrdinaryRequests.MyDetails, requestId],
    queryFn: () => ordinaryRequestService.fetchMyOrdinaryRequestById(requestId),
    enabled: !!requestId && !!token,
  });
  useEffect(() => {
    if (data?.data?.data) {
      resetInputs?.(data.data.data);
    }
  }, [data, resetInputs]);

  return {
    ordinaryRequest: data?.data?.data,
    isOrdinaryRequestLoading: isLoading,
  };
};

export const useCreateOrdinaryRequest = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const ordinaryRequestService = useOrdinaryRequestService();

  return useMutation({
    mutationFn: (ordinaryRequestData: IOrdinaryRequestCredentials) => ordinaryRequestService.create(ordinaryRequestData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.OrdinaryRequests.My] });
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
export const useUpdateOrdinaryRequest = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const ordinaryRequestService = useOrdinaryRequestService();

  return useMutation({
    mutationFn: (ordinaryRequestData: IOrdinaryRequestCredentials) => ordinaryRequestService.update(ordinaryRequestData),
    onSuccess: ({ status, data }, ordinaryRequestData) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.OrdinaryRequests.My] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.OrdinaryRequests.MyDetails, ordinaryRequestData.requestId] });
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

export const useAcceptOrdinaryRequest = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const ordinaryRequestService = useOrdinaryRequestService();

  return useMutation({
    mutationFn: (requestId: number) => ordinaryRequestService.accept(requestId),
    onSuccess: ({ status, data }, requestId) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.OrdinaryRequests.All] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.OrdinaryRequests.Details, requestId] });
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

export const useRejectOrdinaryRequest = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const ordinaryRequestService = useOrdinaryRequestService();

  return useMutation({
    mutationFn: (rejectOrdinaryRequestData: IRejectOrdinaryRequestCredentials) => ordinaryRequestService.reject(rejectOrdinaryRequestData),
    onSuccess: ({ status, data }, rejectOrdinaryRequestData) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.OrdinaryRequests.All] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.OrdinaryRequests.Details, rejectOrdinaryRequestData.requestId] });
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