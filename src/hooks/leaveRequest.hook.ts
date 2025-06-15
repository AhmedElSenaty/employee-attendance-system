import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ILeaveRequestCredentials, ILeaveRequestData, IRejectLeaveRequestCredentials } from "../interfaces/leaveRequest.interfaces";
import { useEffect, useMemo } from "react";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { LeaveRequestService } from "../services/leaveRequest.services";
import { AxiosError } from "axios";
import { IErrorResponse, initialMetadata } from "../interfaces";
import { QueryKeys } from "../constants";

export const useLeaveRequestService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new LeaveRequestService(token);
  }, [token]);

  return service;
};

export const useGetLeaveRequests = (
  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string,
  status?: number,
  searchType?: string,
  searchQuery?: string
) => {
  const token = useUserStore((state) => state.token);
  const leaveService = useLeaveRequestService();
  
  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.LeaveRequests.All, page, pageSize, startDate, endDate, status,
    `${searchType && searchQuery ? [searchType, searchQuery] : ""}`, 
    ],
    queryFn: () => leaveService.fetchLeaveRequests(page, pageSize, startDate, endDate, status, searchType, searchQuery),
    enabled: !!token,
  });

  return {
    leaveRequests: data?.data?.requests || [],
    totalRequests: data?.data?.totalCount || 0,
    metadata: data?.data?.metadata || initialMetadata,
    isLeaveRequestsLoading: isLoading,
  };
};

export const useGetMyLeaveRequests = (
  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string,
  status?: number
) => {
  const token = useUserStore((state) => state.token);
  const leaveService = useLeaveRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.LeaveRequests.My, page, pageSize, startDate, endDate, status],
    queryFn: () => leaveService.fetchMyLeaveRequests(page, pageSize, startDate, endDate, status),
    enabled: !!token,
  });

  return {
    leaveRequests: data?.data?.requests || [],
    totalRequests: data?.data?.totalCount || 0,
    metadata: data?.data?.metadata || initialMetadata,
    isLeaveRequestsLoading: isLoading,
  };
};

export const useGetLeaveRequestByID = (
  requestId: number,
) => {
  const token = useUserStore((state) => state.token);
  const leaveService = useLeaveRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.LeaveRequests.Details, requestId],
    queryFn: () => leaveService.fetchLeaveRequestById(requestId),
    enabled: !!requestId && !!token,
  });

  return {
    leaveRequest: data?.data,
    isLeaveRequestLoading: isLoading,
  };
};

export const useGetMyLeaveRequestByID = (
  requestId: number,
  resetInputs?: (data: ILeaveRequestData) => void
) => {
  const token = useUserStore((state) => state.token);
  const leaveService = useLeaveRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.LeaveRequests.MyDetails, requestId],
    queryFn: () => leaveService.fetchMyLeaveRequestById(requestId),
    enabled: !!requestId && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetInputs?.(data.data);
    }
  }, [data, resetInputs]);

  return {
    leaveRequest: data?.data,
    isLeaveRequestLoading: isLoading,
  };
};

export const useCreateLeaveRequest = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const leaveService = useLeaveRequestService();

  return useMutation({
    mutationFn: (leaveData: ILeaveRequestCredentials) => leaveService.create(leaveData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.LeaveRequests.My] });
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

export const useUpdateLeaveRequest = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const leaveService = useLeaveRequestService();

  return useMutation({
    mutationFn: (leaveData: ILeaveRequestCredentials) => leaveService.update(leaveData),
    onSuccess: ({ status, data }, leaveData) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.LeaveRequests.My] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.LeaveRequests.Details, leaveData.requestId] });
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

export const useAcceptLeaveRequest = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const leaveService = useLeaveRequestService();

  return useMutation({
    mutationFn: (requestId: number) => leaveService.accept(requestId),
    onSuccess: ({ status, data }, requestId) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.LeaveRequests.All] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.LeaveRequests.Details, requestId] });
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

export const useRejectLeaveRequest = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const leaveService = useLeaveRequestService();

  return useMutation({
    mutationFn: (rejectLeaveRequestData: IRejectLeaveRequestCredentials) => leaveService.reject(rejectLeaveRequestData),
    onSuccess: ({ status, data }, rejectLeaveRequestData) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.LeaveRequests.All] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.LeaveRequests.Details, rejectLeaveRequestData.requestId] });
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