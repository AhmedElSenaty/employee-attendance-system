import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ILeaveRequestCredentials, ILeaveRequestData } from "../interfaces/leaveRequest.interfaces";
import { useEffect } from "react";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { LeaveRequestService } from "../services/leaveRequest.services";
import { AxiosError } from "axios";
import { IErrorResponse, initialMetadata } from "../interfaces";
import useURLSearchParams from "./URLSearchParams.hook";

export const MY_LEAVE_REQUESTS_QUERY_KEY = "myLeaveRequests";
export const MY_LEAVE_REQUEST_DETAILS_QUERY_KEY = "myLeaveRequestDetails";

export const useGetMyLeaveRequests = () => {
  const token = useUserStore((state) => state.token);
  const leaveService = new LeaveRequestService(token);

  const {
    getParam,
  } = useURLSearchParams();
  const rawPage = getParam('page');
  const rawPageSize = getParam('pageSize');
  const rawStartDate = getParam('startDate');
  const rawEndDate = getParam('endDate');
  const rawStatus = getParam('status');
  
  const page = rawPage ? Number(rawPage) : 1;
  const pageSize = rawPageSize ? Number(rawPageSize) : 10;
  const startDate = rawStartDate || undefined;
  const endDate = rawEndDate || undefined;
  const status = rawStatus !== null && rawStatus !== '' ? Number(rawStatus) : undefined;

  const { data, isLoading } = useQuery({
    queryKey: [MY_LEAVE_REQUESTS_QUERY_KEY, page, pageSize, startDate, endDate, status],
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
  resetInputs?: (data: ILeaveRequestData) => void
) => {
  const token = useUserStore((state) => state.token);
  const leaveService = new LeaveRequestService(token);

  const { data, isLoading } = useQuery({
    queryKey: [MY_LEAVE_REQUEST_DETAILS_QUERY_KEY, requestId],
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
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const leaveService = new LeaveRequestService(token);

  return useMutation({
    mutationFn: (leaveData: ILeaveRequestCredentials) => leaveService.create(leaveData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [MY_LEAVE_REQUESTS_QUERY_KEY] });
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
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const leaveService = new LeaveRequestService(token);

  return useMutation({
    mutationFn: (leaveData: ILeaveRequestCredentials) => leaveService.update(leaveData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [MY_LEAVE_REQUESTS_QUERY_KEY] });
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
