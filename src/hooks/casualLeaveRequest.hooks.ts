import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IAssignCasualLeaveRequestCredentials, ICasualLeaveRequestCredentials, ICasualLeaveRequestData, IRejectCasualLeaveRequestCredentials } from "../interfaces";
import { useEffect, useMemo } from "react";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { appendSecondsToTime, getTranslatedMessage, handleApiError, showToast } from "../utils";
import { CasualLeaveRequestService } from "../services/casualLeaveRequest.services";
import { AxiosError } from "axios";
import { IErrorResponse, initialMetadata } from "../interfaces";


export const CASUAL_LEAVE_REQUESTS_QUERY_KEY = "casualLeaveRequests";
export const MY_CASUAL_LEAVE_REQUESTS_QUERY_KEY = "myCasualLeaveRequests";
export const CASUAL_LEAVE_REQUEST_DETAILS_QUERY_KEY = "casualLeaveRequestDetails";
export const MY_CASUAL_LEAVE_REQUEST_DETAILS_QUERY_KEY = "myCasualLeaveRequestDetails";

export const useCasualLeaveRequestService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new CasualLeaveRequestService(token);
  }, [token]);

  return service;
};

export const useGetCasualLeaveRequests = (
  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string,
  status?: number,
  searchType?: string,
  searchQuery?: string
) => {
  const token = useUserStore((state) => state.token);
  const casualLeaveRequestService = useCasualLeaveRequestService();
  
  const { data, isLoading } = useQuery({
    queryKey: [CASUAL_LEAVE_REQUESTS_QUERY_KEY, page, pageSize, startDate, endDate, status, searchType, searchQuery],
    queryFn: () => casualLeaveRequestService.fetchCasualLeaveRequests(page, pageSize, startDate, endDate, status, searchType, searchQuery),
    enabled: !!token,
  });

  return {
    casualLeaveRequests: data?.data?.requests || [],
    totalRequests: data?.data?.totalCount || 0,
    metadata: data?.data?.metadata || initialMetadata,
    isCasualLeaveRequestsLoading: isLoading,
  };
};

export const useGetMyCasualLeaveRequests = (
  page = 1,
  pageSize = 10,
  startDate?: string,
  endDate?: string,
  status?: number
) => {
  const token = useUserStore((state) => state.token);
  const casualLeaveRequestService = useCasualLeaveRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [MY_CASUAL_LEAVE_REQUESTS_QUERY_KEY, page, pageSize, startDate, endDate, status],
    queryFn: () => casualLeaveRequestService.fetchMyCasualLeaveRequests(page, pageSize, startDate, endDate, status),
    enabled: !!token,
  });

  return {
    casualLeaveRequests: data?.data?.requests || [],
    totalRequests: data?.data?.totalCount || 0,
    metadata: data?.data?.metadata || initialMetadata,
    isCasualLeaveRequestsLoading: isLoading,
  };
};

export const useGetCasualLeaveRequestByID = (
  requestId: number,
) => {
  const token = useUserStore((state) => state.token);
  const casualLeaveRequestService = useCasualLeaveRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [CASUAL_LEAVE_REQUEST_DETAILS_QUERY_KEY, requestId],
    queryFn: () => casualLeaveRequestService.fetchCasualLeaveRequestById(requestId),
    enabled: !!requestId && !!token,
  });

  return {
    casualLeaveRequest: data?.data,
    isCasualLeaveRequestLoading: isLoading,
  };
};

export const useGetMyCasualLeaveRequestByID = (
  requestId: number,
  resetInputs?: (data: ICasualLeaveRequestData) => void
) => {
  const token = useUserStore((state) => state.token);
  const casualLeaveRequestService = useCasualLeaveRequestService();

  const { data, isLoading } = useQuery({
    queryKey: [MY_CASUAL_LEAVE_REQUEST_DETAILS_QUERY_KEY, requestId],
    queryFn: () => casualLeaveRequestService.fetchMyCasualLeaveRequestById(requestId),
    enabled: !!requestId && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetInputs?.(data.data);
    }
  }, [data, resetInputs]);

  return {
    casualLeaveRequest: data?.data,
    isCasualLeaveRequestLoading: isLoading,
  };
};

export const useCreateCasualLeaveRequest = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const casualLeaveRequestService = useCasualLeaveRequestService();

  return useMutation({
    mutationFn: (casualLeaveRequestData: ICasualLeaveRequestCredentials) => casualLeaveRequestService.create(casualLeaveRequestData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [MY_CASUAL_LEAVE_REQUESTS_QUERY_KEY] });
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
export const useUpdateCasualLeaveRequest = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const casualLeaveRequestService = useCasualLeaveRequestService();

  return useMutation({
    mutationFn: (casualLeaveRequestData: ICasualLeaveRequestCredentials) => casualLeaveRequestService.update(casualLeaveRequestData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [MY_CASUAL_LEAVE_REQUEST_DETAILS_QUERY_KEY] });
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

export const useAcceptCasualLeaveRequest = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const casualLeaveRequestService = useCasualLeaveRequestService();

  return useMutation({
    mutationFn: (requestId: number) => casualLeaveRequestService.accept(requestId),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [CASUAL_LEAVE_REQUESTS_QUERY_KEY] });
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

export const useRejectCasualLeaveRequest = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const casualLeaveRequestService = useCasualLeaveRequestService();

  return useMutation({
    mutationFn: (rejectCasualLeaveRequestData: IRejectCasualLeaveRequestCredentials) => casualLeaveRequestService.reject(rejectCasualLeaveRequestData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [CASUAL_LEAVE_REQUESTS_QUERY_KEY] });
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

export const useAssignCasualLeaveRequest = () => {
	const { language } = useLanguageStore();
	const queryClient = useQueryClient();
  const casualLeaveRequestService = useCasualLeaveRequestService();

	return useMutation({
			mutationFn: (casualLeaveRequestData: IAssignCasualLeaveRequestCredentials)=>{
				casualLeaveRequestData.startTime = appendSecondsToTime(casualLeaveRequestData.startTime)
				casualLeaveRequestData.endTime = appendSecondsToTime(casualLeaveRequestData.endTime)
				return casualLeaveRequestService.assign(casualLeaveRequestData)
			},
			onSuccess: ({ status, data }) => {
					queryClient.invalidateQueries({queryKey: [CASUAL_LEAVE_REQUESTS_QUERY_KEY]});
					if (status === 201) {
							const message = getTranslatedMessage(data.message ?? "", language);
							showToast("success", message);
					}
			},
			onError: (error) => {
					const axiosError = error as AxiosError<IErrorResponse>;
					handleApiError(axiosError, language);
			},
	})
}