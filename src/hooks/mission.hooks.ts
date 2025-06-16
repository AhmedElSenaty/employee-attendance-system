import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../store/user.store";
import { AxiosError } from "axios";
import { IAssignMissionRequestCredentials, IErrorResponse, IMissionRequestCredentials, IMissionRequestData, initialMetadata, IRejectMissionRequestCredentials } from "../interfaces";
import { useLanguageStore } from "../store/language.store";
import { appendSecondsToTime, getTranslatedMessage, handleApiError, showToast } from "../utils";
import { useEffect, useMemo } from "react";
import { MissionRequestService } from "../services/mission.services";
import { QueryKeys } from "../constants";

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
			queryKey: [QueryKeys.MissionRequests.All, page, pageSize, startDate, endDate, status, 
				`${searchType && searchQuery ? [searchType, searchQuery] : ""}`, 
			],
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
			queryKey: [QueryKeys.MissionRequests.My, page, pageSize, startDate, endDate, status],
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
			queryKey: [QueryKeys.MissionRequests.Details, missionId],
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
			queryKey: [QueryKeys.MissionRequests.MyDetails, missionId],
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
				queryClient.invalidateQueries({queryKey: [QueryKeys.MissionRequests.My]});
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
			mutationFn: (missionData: IAssignMissionRequestCredentials)=> {
				const formatted = {
					...missionData,
					startTime: appendSecondsToTime(missionData.startTime || ""),
					endTime: appendSecondsToTime(missionData.endTime || ""),
				};
				return missionService.assign(formatted)
			},
			onSuccess: ({ status, data }) => {
					queryClient.invalidateQueries({queryKey: [QueryKeys.MissionRequests.All]});
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
			onSuccess: ({ status, data }, missionData) => {
					queryClient.invalidateQueries({queryKey: [QueryKeys.MissionRequests.My]});
					queryClient.invalidateQueries({queryKey: [QueryKeys.MissionRequests.MyDetails, missionData.requestId]});
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
			onSuccess: ({ status, data }, missionId) => {
					queryClient.invalidateQueries({queryKey: [QueryKeys.MissionRequests.All]});
					queryClient.invalidateQueries({queryKey: [QueryKeys.MissionRequests.Details, missionId]});
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
			onSuccess: ({ status, data }, missionData) => {
					queryClient.invalidateQueries({queryKey: [QueryKeys.MissionRequests.All]});
					queryClient.invalidateQueries({queryKey: [QueryKeys.MissionRequests.Details, missionData.requestId]});
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
