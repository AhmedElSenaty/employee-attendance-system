import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../store/user.store";
import { AxiosError } from "axios";
import { IAssignMissionRequestCredentials, IErrorResponse, IMissionRequestCredentials, IMissionRequestData, initialMetadata, IRejectMissionRequestCredentials } from "../interfaces";
import { useLanguageStore } from "../store/language.store";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { useEffect, useMemo } from "react";
import { MissionRequestService } from "../services/mission.services";

export const MISSION_REQUESTS_QUERY_KEY = "missionRequests";
export const MY_MISSION_REQUESTS_QUERY_KEY = "myMissionRequests";
export const MISSION_REQUEST_DETAILS_QUERY_KEY = "missionRequestDetails";
export const MY_MISSION_REQUEST_DETAILS_QUERY_KEY = "myMissionRequestDetails";

export const useMissionRequestService = () => {
	const token = useUserStore((state) => state.token);

	const service = useMemo(() => {
		return new MissionRequestService(token);
	}, [token]);

	return service;
};

export const useGetMissionRequests = (
	page = 1,
	pageSize = 10,
	startDate?: string,
	endDate?: string,
	status?: number,
	searchType?: string,
	searchQuery?: string
) => {
	const token = useUserStore((state) => state.token);
	const missionService = useMissionRequestService();

	const { data, isLoading } = useQuery({
			queryKey: [MISSION_REQUESTS_QUERY_KEY, page, pageSize, startDate, endDate, status, searchType, searchQuery],
			queryFn: () => missionService.fetchMissionRequests(page, pageSize, startDate, endDate, status, searchType, searchQuery),
			enabled: !!token,
	})

	return {
			missionRequests: data?.data?.requests || [],
			totalMissionRequests: data?.data?.totalCount || 0,
			metadata: data?.data?.metadata || initialMetadata,
			isMissionRequestsLoading: isLoading,
	}
}

export const useGetMyMissionRequests = (
	page = 1,
	pageSize = 10,
	startDate?: string,
	endDate?: string,
	status?: number,
) => {
	const token = useUserStore((state) => state.token);
	const missionService = useMissionRequestService();

	const { data , isLoading} = useQuery({
			queryKey: [MY_MISSION_REQUESTS_QUERY_KEY, page, pageSize, startDate, endDate, status],
			queryFn: ()=> missionService.fetchMyMissionRequests(page, pageSize, startDate, endDate, status),
			enabled: !!token
	});

	return {
			missionRequests: data?.data?.requests || [],
			totalMissionRequests: data?.data?.totalCount || 0,
			metadata: data?.data?.metadata || initialMetadata,
			isMissionRequestsLoading: isLoading,
	}
}

export const useGetMissionRequestByID = (
	missionId: number,
) => {
	const token = useUserStore((state) => state.token);
	const missionService = useMissionRequestService();

	const { data, isLoading } = useQuery({
			queryKey: [MISSION_REQUEST_DETAILS_QUERY_KEY, missionId],
			queryFn: () => missionService.fetchMissionRequestById(missionId),
			enabled: !!missionId && !!token,
	});

	return {
			missionRequest: data?.data,
			isMissionRequestLoading: isLoading,
	}
}

export const useGetMyMissionRequestByID = (
	missionId: number,
	resetInputs?: (data: IMissionRequestData) => void
) => {
	const token = useUserStore((state) => state.token);
	const missionService = useMissionRequestService();
	
	const { data, isLoading } = useQuery({
			queryKey: [MY_MISSION_REQUEST_DETAILS_QUERY_KEY, missionId],
			queryFn: () => missionService.fetchMyMissionRequestById(missionId),
			enabled: !!missionId && !!token,
	});
	
  useEffect(() => {
    if (data?.data) {
      resetInputs?.(data.data);
    }
  }, [data, resetInputs]);

	return {
			missionRequest: data?.data,
			isMissionRequestLoading: isLoading,
	}
}

export const useCreateMissionRequest = () => {
	const { language } = useLanguageStore();
	const queryClient = useQueryClient();
	const missionService = useMissionRequestService();

	return useMutation({
		mutationFn: (missionData: IMissionRequestCredentials) => missionService.create(missionData),
		onSuccess: ({ status, data }) => {
				queryClient.invalidateQueries({queryKey: [MY_MISSION_REQUESTS_QUERY_KEY]});
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

export const useAssignMissionRequest = () => {
	const { language } = useLanguageStore();
	const queryClient = useQueryClient();
	const missionService = useMissionRequestService();

	return useMutation({
			mutationFn: (missionData: IAssignMissionRequestCredentials) => missionService.assign(missionData),
			onSuccess: ({ status, data }) => {
					queryClient.invalidateQueries({queryKey: [MISSION_REQUESTS_QUERY_KEY]});
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

export const useUpdateMissionRequest = () => {
	const { language } = useLanguageStore();
	const queryClient = useQueryClient();
	const missionService = useMissionRequestService();

	return useMutation({
			mutationFn: (missionData: IMissionRequestCredentials) => missionService.update(missionData),
			onSuccess: ({ status, data } ) => {
					queryClient.invalidateQueries({queryKey: [MY_MISSION_REQUESTS_QUERY_KEY]});
					if (status === 200) {
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

export const useAcceptMissionRequest = () => {
	const { language } = useLanguageStore();
	const queryClient = useQueryClient();
	const missionService = useMissionRequestService();

	return useMutation({
			mutationFn: (missionId: number) => missionService.accept(missionId),
			onSuccess: ({ status, data }) => {
					queryClient.invalidateQueries({queryKey: [MISSION_REQUESTS_QUERY_KEY]});
					if (status === 200) {
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

export const useRejectMissionRequest = () => {
	const { language } = useLanguageStore();
	const queryClient = useQueryClient();
	const missionService = useMissionRequestService();

	return useMutation({
			mutationFn: (missionData: IRejectMissionRequestCredentials) => missionService.reject(missionData),
			onSuccess: ({ status, data }) => {
					queryClient.invalidateQueries({queryKey: [MISSION_REQUESTS_QUERY_KEY]});
					if (status === 200) {
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
