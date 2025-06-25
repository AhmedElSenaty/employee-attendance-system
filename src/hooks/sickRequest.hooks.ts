import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../store/user.store";
import { useLanguageStore } from "../store";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { IErrorResponse, initialMetadata } from "../interfaces";
import { QueryKeys } from "../constants";
import {
  IAssignSickRequestCredentials,
  IRejectSickRequestCredentials,
  ISickRequestCredentials,
  ISickRequestUpdateReportCredentials,
  ISickRequestUpdateTextCredentials,
} from "../interfaces";
import { SickRequestsService } from "../services";
import { useEffect, useMemo } from "react";

export const useSickRequestService = () => {
  const token = useUserStore((state) => state.token);

  return useMemo(() => new SickRequestsService(token), [token]);
};

// Fetch all sick leave requests (for manager)
export const useGetSickRequests = (
  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string,
  status?: number,
  searchType?: string,
  searchQuery?: string
) => {
  const token = useUserStore((state) => state.token);
  const service = useSickRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.SickRequests.All,
      page,
      pageSize,
      startDate,
      endDate,
      status,
      `${searchType && searchQuery ? [searchType, searchQuery] : ""}`,
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
    sickRequests: data?.data?.data?.requests || [],
    totalRequests: data?.data?.data?.totalCount || 0,
    metadata: data?.data?.data?.metadata || initialMetadata,
    isLoading,
  };
};

// Fetch my sick requests (for employee)
export const useGetMySickRequests = (
  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string,
  status?: number
) => {
  const token = useUserStore((state) => state.token);
  const service = useSickRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.SickRequests.My,
      page,
      pageSize,
      startDate,
      endDate,
      status,
    ],
    queryFn: () =>
      service.fetchMyRequests(page, pageSize, startDate, endDate, status),
    enabled: !!token,
  });

  return {
    sickRequests: data?.data?.data?.requests || [],
    totalRequests: data?.data?.data?.totalCount || 0,
    metadata: data?.data?.data?.metadata || initialMetadata,
    isLoading,
  };
};

// Fetch sick request by ID (manager)
export const useGetSickRequestById = (requestId: number) => {
  const token = useUserStore((state) => state.token);
  const service = useSickRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.SickRequests.Details, requestId],
    queryFn: () => service.fetchRequestById(requestId),
    enabled: !!requestId && !!token,
  });

  return {
    sickRequest: data?.data?.data,
    isLoading,
  };
};

// Fetch my sick request by ID (employee)
export const useGetMySickRequestById = (
  requestId: number,
  resetInputs?: (data: ISickRequestUpdateTextCredentials) => void
) => {
  const token = useUserStore((state) => state.token);
  const service = useSickRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.SickRequests.MyDetails, requestId],
    queryFn: () => service.fetchMyRequestById(requestId),
    enabled: !!requestId && !!token,
  });

  // Populate form inputs
  useEffect(() => {
    if (data?.data?.data && resetInputs) {
      resetInputs(data.data.data);
    }
  }, [data, resetInputs]);

  return {
    sickRequest: data?.data?.data,
    isLoading,
  };
};

// Create sick leave request
export const useCreateSickRequest = () => {
  const service = useSickRequestService();
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ISickRequestCredentials) => {
      const file =
        data.MedicalReport instanceof FileList
          ? data.MedicalReport[0]
          : data.MedicalReport;

      const formData = new FormData();
      formData.append("StartDate", data.StartDate);
      formData.append("NumberOfDays", data.NumberOfDays.toString());
      formData.append("Description", data.Description);
      formData.append("PermitApproval", data.PermitApproval);
      formData.append("MedicalReport", file);
      return service.create(formData);
    },
    onSuccess: ({ data, status }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickRequests.My] });
      if (status === 201)
        showToast("success", getTranslatedMessage(data.message, language));
    },
    onError: (error) =>
      handleApiError(error as AxiosError<IErrorResponse>, language),
  });
};

// Accept sick leave request
export const useAcceptSickRequest = () => {
  const service = useSickRequestService();
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: number) => service.accept(requestId),
    onSuccess: ({ data, status }, requestId) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickRequests.All] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.SickRequests.Details, requestId],
      });
      if (status === 200)
        showToast("success", getTranslatedMessage(data.message, language));
    },
    onError: (error) =>
      handleApiError(error as AxiosError<IErrorResponse>, language),
  });
};

// Reject sick leave request
export const useRejectSickRequest = () => {
  const service = useSickRequestService();
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IRejectSickRequestCredentials) => service.reject(data),
    onSuccess: ({ data, status }, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickRequests.All] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.SickRequests.Details, variables.requestId],
      });
      if (status === 200)
        showToast("success", getTranslatedMessage(data.message, language));
    },
    onError: (error) =>
      handleApiError(error as AxiosError<IErrorResponse>, language),
  });
};

// Assign sick leave request
export const useAssignSickRequest = () => {
  const service = useSickRequestService();
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IAssignSickRequestCredentials) => {
      const file =
        data.MedicalReport instanceof FileList
          ? data.MedicalReport[0]
          : data.MedicalReport;

      const formData = new FormData();
      formData.append("StartDate", data.StartDate);
      formData.append("NumberOfDays", data.NumberOfDays.toString());
      formData.append("Description", data.Description);
      formData.append("PermitApproval", data.PermitApproval);
      formData.append("EmployeeId", data.EmployeeId.toString());
      formData.append("MedicalReport", file);
      return service.assign(formData);
    },
    onSuccess: ({ data, status }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickRequests.All] });
      if (status === 201)
        showToast("success", getTranslatedMessage(data.message, language));
    },
    onError: (error) =>
      handleApiError(error as AxiosError<IErrorResponse>, language),
  });
};

// Update sick leave text
export const useUpdateSickText = () => {
  const service = useSickRequestService();
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ISickRequestUpdateTextCredentials) =>
      service.updateText(data),
    onSuccess: ({ data, status }, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickRequests.My] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.SickRequests.MyDetails, variables.requestId],
      });
      if (status === 200)
        showToast("success", getTranslatedMessage(data.message, language));
    },
    onError: (error) =>
      handleApiError(error as AxiosError<IErrorResponse>, language),
  });
};

// Update sick leave report
export const useUpdateSickReport = () => {
  const service = useSickRequestService();
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ISickRequestUpdateReportCredentials) => {
      const file =
        data.MedicalReport instanceof FileList
          ? data.MedicalReport[0]
          : data.MedicalReport;

      const formData = new FormData();
      formData.append("RequestId", (data.RequestId || "").toString());
      formData.append("MedicalReport", file);
      return service.updateReport(formData);
    },
    onSuccess: ({ data, status }, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SickRequests.My] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.SickRequests.MyDetails, variables.RequestId],
      });
      if (status === 200)
        showToast("success", getTranslatedMessage(data.message, language));
    },
    onError: (error) =>
      handleApiError(error as AxiosError<IErrorResponse>, language),
  });
};
