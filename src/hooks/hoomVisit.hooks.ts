import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useUserStore } from "../store/user.store";
import { useLanguageStore } from "../store/language.store";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import {
  AssignRequest,
  CreateRequest,
  UpdateRequest,
  BaseSickRequest,
} from "../interfaces/HomeVisit.interfaces";
import { HomeVisitService } from "../services/homeVisit.services";
import { QueryKeys } from "../constants";
import { IErrorResponse, initialMetadata } from "../interfaces";

export const useHomeVisitService = () => {
  const token = useUserStore((state) => state.token);
  return useMemo(() => new HomeVisitService(token), [token]);
};

export const useGetMyHomeVisitRequests = (
  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string
) => {
  const token = useUserStore((state) => state.token);
  const service = useHomeVisitService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.HomeVisits.My, page, pageSize, startDate, endDate],
    queryFn: () => service.fetchMyRequests(page, pageSize, startDate, endDate),
    enabled: !!token,
  });

  return {
    homeVisits: data?.data?.data?.requests || [],
    totalRequests: data?.data?.data?.totalCount || 0,
    metadata: data?.data?.data?.metadata || initialMetadata,
    isLoading,
  };
};

export const useGetAllHomeVisitRequests = (
  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string,
  status?: number,
  searchType?: string,
  searchQuery?: string
) => {
  const token = useUserStore((state) => state.token);
  const service = useHomeVisitService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.HomeVisits.All,
      page,
      pageSize,
      startDate,
      endDate,
      status,
      searchType,
      searchQuery,
    ],
    queryFn: () =>
      service.fetchRequests(
        page,
        pageSize,
        startDate,
        endDate,
        status,
        searchType,
        searchQuery
      ),
    enabled: !!token,
  });

  return {
    homeVisits: data?.data?.data?.requests || [],
    totalRequests: data?.data?.data?.totalCount || 0,
    metadata: data?.data?.data?.metadata || initialMetadata,
    isLoading,
  };
};

export const useGetHomeVisitById = (requestId: number, isManager = false) => {
  const token = useUserStore((state) => state.token);
  const service = useHomeVisitService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.HomeVisits.Details, requestId],
    queryFn: () =>
      isManager
        ? service.fetchRequestById(requestId)
        : service.fetchMyRequestById(requestId),
    enabled: !!requestId && !!token,
  });

  return {
    request: data?.data?.data,
    isLoading,
  };
};

export const useCreateHomeVisit = () => {
  const service = useHomeVisitService();
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRequest) => service.create(data),
    onSuccess: ({ data, status }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.HomeVisits.My] });
      if (status === 201)
        showToast("success", getTranslatedMessage(data.message, language));
    },
    onError: (error) =>
      handleApiError(error as AxiosError<IErrorResponse>, language),
  });
};

export const useAssignHomeVisit = () => {
  const service = useHomeVisitService();
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignRequest) => service.assign(data),
    onSuccess: ({ data, status }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.HomeVisits.All] });
      if (status === 201)
        showToast("success", getTranslatedMessage(data.message, language));
    },
    onError: (error) =>
      handleApiError(error as AxiosError<IErrorResponse>, language),
  });
};

export const useUpdateHomeVisit = () => {
  const service = useHomeVisitService();
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const role = useUserStore((state) => state.role);

  return useMutation({
    mutationFn: (data: UpdateRequest) => service.update(data, role),
    onSuccess: ({ data, status }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.HomeVisits.My] });
      if (status === 200)
        showToast("success", getTranslatedMessage(data.message, language));
    },
    onError: (error) =>
      handleApiError(error as AxiosError<IErrorResponse>, language),
  });
};

export const useChangeToSickRequest = () => {
  const service = useHomeVisitService();
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const role = useUserStore((state) => state.role);

  return useMutation({
    mutationFn: (data: BaseSickRequest) => {
      return service.changeToSickRequest(data, role);
    },
    onSuccess: ({ data, status }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.HomeVisits.All] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.HomeVisits.My] });
      if (status === 200)
        showToast("success", getTranslatedMessage(data.message, language));
    },
    onError: (error) =>
      handleApiError(error as AxiosError<IErrorResponse>, language),
  });
};
