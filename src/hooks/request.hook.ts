import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useUserStore } from "../store/user.store";
import { useLanguageStore } from "../store/language.store";
import { AxiosError } from "axios";
import { QueryKeys } from "../constants";
import { IErrorResponse, initialMetadata } from "../interfaces";
import { IAssignRequest, IRejectRequestCredentials, ISoftDeleteRequestCredentials } from "../interfaces/request.interfaces";
import { RequestService } from "../services/requests.services";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { EditRequestFormValues } from "../validation/request.schema";

export const useRequestService = () => {
  const token = useUserStore((state) => state.token);
  return useMemo(() => new RequestService(token), [token]);
};

export const useGetRequests = () => {
  const token = useUserStore((state) => state.token);
  const requestService = useRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Requests.All],
    queryFn: () => requestService.fetchRequests(),
    enabled: !!token,
  });

  return {
    requests: data?.data?.data || [],
    metadata: data?.data?.data?.metadata || initialMetadata,
    isLoading,
  };
};

export const useGetAllRequests = (  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string,
  status?: number,
  leaveType?: number,
  searchType?: string,
  searchQuery?: string,
) => {
  const token = useUserStore((state) => state.token);
  const requestService = useRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.Requests.All,
      page,
      pageSize,
      startDate,
      endDate,
      status,
      leaveType,
      `${searchType && searchQuery ? [searchType, searchQuery] : ""}`,
    ],
    queryFn: () => requestService.fetchAllRequests(
        page,
        pageSize,
        startDate,
        endDate,
        status,
        leaveType,
        searchType,
        searchQuery,
    ),
    enabled: !!token,
  });

  return {
    requests: data?.data?.data?.requests || [],
    metadata: data?.data?.data?.metadata || initialMetadata,
    isLoading,
  };
};
export const useGetAllGenaricRequests = (  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string,
  status?: number,
  searchType?: string,
  searchQuery?: string,
) => {
  const token = useUserStore((state) => state.token);
  const requestService = useRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.Requests.All,
      page,
      pageSize,
      startDate,
      endDate,
      status,
      `${searchType && searchQuery ? [searchType, searchQuery] : ""}`,
    ],
    queryFn: () => requestService.fetchGenaricRequests(
        page,
        pageSize,
        startDate,
        endDate,
        status,
        searchType,
        searchQuery,
    ),
    enabled: !!token,
  });

  return {
    requests: data?.data?.data?.requests || [],
    metadata: data?.data?.data?.metadata || initialMetadata,
    isLoading,
  };
};

export const useAcceptRequest = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const requestService = useRequestService();

  return useMutation({
    mutationFn: (requestId: number) => requestService.accept(requestId),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Requests.All] });
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

export const useRejectRequest = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const requestService = useRequestService();

  return useMutation({
    mutationFn: (payload: { id: string; data: IRejectRequestCredentials }) =>
      requestService.reject(payload.id, payload.data),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Requests.All] });
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

export const useSoftDeleteRequest = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const requestService = useRequestService();

  return useMutation({
    mutationFn: (deleteRequestData: ISoftDeleteRequestCredentials) => requestService.softDelete(deleteRequestData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Requests.All] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CasualLeaveRequests.All] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.LeaveRequests.All] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MissionRequests.All] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickRequests.All] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.OrdinaryRequests.All] });
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

export const useAssignRequest = () => {
  const { language } = useLanguageStore();
  const service = useRequestService();

  return useMutation({
    mutationFn: (data: IAssignRequest) => service.assign(data),
    onSuccess: ({ status, data }) => {

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

export const useEditRequest = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const requestService = useRequestService();

  return useMutation({
    mutationFn: (data: EditRequestFormValues) => requestService.editRequest(data),
    onSuccess: ({ status, data }) => {
      if (status === 200) {
        const message = getTranslatedMessage(data.message ?? "", language);
        showToast("success", message);

        queryClient.invalidateQueries({ queryKey: [QueryKeys.Requests.Single] });
        queryClient.invalidateQueries({ queryKey: [QueryKeys.LeaveRequests.All] });
        queryClient.invalidateQueries({ queryKey: [QueryKeys.MissionRequests.All] });
        queryClient.invalidateQueries({ queryKey: [QueryKeys.OfficialVacations.All] });
        queryClient.invalidateQueries({ queryKey: [QueryKeys.OrdinaryRequests.All] });
        queryClient.invalidateQueries({ queryKey: [QueryKeys.SickRequests.All] });
        queryClient.invalidateQueries({ queryKey: [QueryKeys.CasualLeaveRequests.All] });
        queryClient.invalidateQueries({ queryKey: [QueryKeys.Requests.All] });
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError<IErrorResponse>;
      handleApiError(axiosError, language);
    },
  });
};

export const useGetRequestById = (requestId: number) => {
  const token = useUserStore((state) => state.token);
  const requestService = useRequestService();

  const { data, isLoading, isError } = useQuery({
    queryKey: [QueryKeys.Requests.Single, requestId],
    queryFn: () => requestService.getRequestById(requestId),
    enabled: !!token,
  });

  return {
    request: data?.data?.data || null,
    isLoading,
    isError,
  };
};