import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../store/user.store";
import { useLanguageStore } from "../store/";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { IErrorResponse, initialMetadata } from "../interfaces";
import { QueryKeys } from "../constants";
import {
  IAssignSickLeaveRequestCredentials,
  IRejectSickLeaveRequestCredentials,
  ISickLeaveRequestCredentials,
  ISickLeaveRequestUpdateReportCredentials,
  ISickLeaveRequestUpdateTextCredentials,
} from "../interfaces";
import { SickLeaveRequestsService } from "../services";
import { useEffect, useMemo } from "react";

export const useSickLeaveRequestService = () => {
  const token = useUserStore((state) => state.token);

  return useMemo(() => new SickLeaveRequestsService(token), [token]);
};

// Fetch all sick leave requests (for manager)
export const useGetSickLeaveRequests = (page = 1, pageSize = 10, startDate?: string, endDate?: string, status?: number, searchType?: string, searchQuery?: string) => {
  const token = useUserStore((state) => state.token);
  const service = useSickLeaveRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.SickLeaveRequests.All, page, pageSize, startDate, endDate, status, 
      `${searchType && searchQuery ? [searchType, searchQuery] : ""}`, 
    ],
    queryFn: () => service.fetchLeaveRequests(page, pageSize, startDate, endDate, status, searchType, searchQuery),
    enabled: !!token,
  });

  return {
    sickLeaveRequests: data?.data?.requests || [],
    totalRequests: data?.data?.totalCount || 0,
    metadata: data?.data?.metadata || initialMetadata,
    isLoading,
  };
};

// Fetch my sick requests (for employee)
export const useGetMySickLeaveRequests = (page = 1, pageSize = 10, startDate?: string, endDate?: string, status?: number) => {
  const token = useUserStore((state) => state.token);
  const service = useSickLeaveRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.SickLeaveRequests.My, page, pageSize, startDate, endDate, status],
    queryFn: () => service.fetchMySickRequests(page, pageSize, startDate, endDate, status),
    enabled: !!token,
  });

  return {
    sickLeaveRequests: data?.data?.requests || [],
    totalRequests: data?.data?.totalCount || 0,
    metadata: data?.data?.metadata || initialMetadata,
    isLoading,
  };
};

// Fetch sick request by ID (manager)
export const useGetSickLeaveRequestById = (requestId: number) => {
  const token = useUserStore((state) => state.token);
  const service = useSickLeaveRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.SickLeaveRequests.Details, requestId],
    queryFn: () => service.fetchSickRequestById(requestId),
    enabled: !!requestId && !!token,
  });

  return {
    sickLeaveRequest: data?.data,
    isLoading,
  };
};

// Fetch my sick request by ID (employee)
export const useGetMySickLeaveRequestById = (requestId: number,   resetInputs?: (data: ISickLeaveRequestUpdateTextCredentials) => void) => {
  const token = useUserStore((state) => state.token);
  const service = useSickLeaveRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.SickLeaveRequests.MyDetails, requestId],
    queryFn: () => service.fetchMySickRequestById(requestId),
    enabled: !!requestId && !!token,
  });

  // Populate form inputs
  useEffect(() => {
    if (data?.data && resetInputs) resetInputs(data.data);
  }, [data, resetInputs]);

  return {
    sickLeaveRequest: data?.data,
    isLoading,
  };
};

// Create sick leave request
export const useCreateSickLeaveRequest = () => {
  const service = useSickLeaveRequestService();
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ISickLeaveRequestCredentials) => service.create(data),
    onSuccess: ({ data, status }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickLeaveRequests.My] });
      if (status === 201) showToast("success", getTranslatedMessage(data.message, language));
    },
    onError: (error) => handleApiError(error as AxiosError<IErrorResponse>, language),
  });
};

// Accept sick leave request
export const useAcceptSickLeaveRequest = () => {
  const service = useSickLeaveRequestService();
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => service.accept(requestId),
    onSuccess: ({ data, status }, requestId) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickLeaveRequests.All] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickLeaveRequests.Details, requestId] });
      if (status === 200) showToast("success", getTranslatedMessage(data.message, language));
    },
    onError: (error) => handleApiError(error as AxiosError<IErrorResponse>, language),
  });
};

// Reject sick leave request
export const useRejectSickLeaveRequest = () => {
  const service = useSickLeaveRequestService();
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IRejectSickLeaveRequestCredentials) => service.reject(data),
    onSuccess: ({ data, status }, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickLeaveRequests.All] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickLeaveRequests.Details, variables.requestId] });
      if (status === 200) showToast("success", getTranslatedMessage(data.message, language));
    },
    onError: (error) => handleApiError(error as AxiosError<IErrorResponse>, language),
  });
};

// Assign sick leave request
export const useAssignSickLeaveRequest = () => {
  const service = useSickLeaveRequestService();
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IAssignSickLeaveRequestCredentials) => service.assign(data),
    onSuccess: ({ data, status }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickLeaveRequests.All] });
      if (status === 200) showToast("success", getTranslatedMessage(data.message, language));
    },
    onError: (error) => handleApiError(error as AxiosError<IErrorResponse>, language),
  });
};

// Update sick leave text
export const useUpdateSickLeaveText = () => {
  const service = useSickLeaveRequestService();
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ISickLeaveRequestUpdateTextCredentials) => service.updateText(data),
    onSuccess: ({ data, status }, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickLeaveRequests.My] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickLeaveRequests.MyDetails, variables.requestId] });
      if (status === 200) showToast("success", getTranslatedMessage(data.message, language));
    },
    onError: (error) => handleApiError(error as AxiosError<IErrorResponse>, language),
  });
};

// Update sick leave report
export const useUpdateSickLeaveReport = () => {
  const service = useSickLeaveRequestService();
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ISickLeaveRequestUpdateReportCredentials) => service.updateReport(data),
    onSuccess: ({ data, status }, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickLeaveRequests.My] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickLeaveRequests.MyDetails, variables.RequestId] });
      if (status === 200) showToast("success", getTranslatedMessage(data.message, language));
    },
    onError: (error) => handleApiError(error as AxiosError<IErrorResponse>, language),
  });
};
