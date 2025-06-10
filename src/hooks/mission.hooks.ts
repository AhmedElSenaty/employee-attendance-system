import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IMissionCredentials, IRejectMissionCredentials,
        IAssignMissionCredentials, IMissionData } from "../interfaces";
import { useUserStore } from "../store/user.store";
import { MissionService } from "../services/mission.services";
import { AxiosError } from "axios";
import { IErrorResponse, initialMetadata } from "../interfaces";
import { useLanguageStore } from "../store/language.store";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { useMemo } from "react";

export const MISSIONS_QUERY_KEY = "missions";
export const MY_MISSIONS_QUERY_KEY = "myMissions";
export const MISSION_DETAILS_QUERY_KEY = "missionDetails";
export const MY_MISSION_DETAILS_QUERY_KEY = "myMissionDetails";

export const useMissionService = () => {
    const token = useUserStore((state) => state.token);
  
    const service = useMemo(() => {
      return new MissionService(token);
    }, [token]);
  
    return service;
  };

export const useGetMissions = (
    page = 1,
    pageSize = 10,
    startDate?: string,
    endDate?: string,
    status?: number,
    searchType?: string,
    searchQuery?: string
) => {
    const token = useUserStore((state) => state.token);
    const missionService = useMissionService();

    const { data, isLoading } = useQuery({
        queryKey: [MISSIONS_QUERY_KEY, page, pageSize, startDate, endDate, status, searchType, searchQuery],
        queryFn: () => missionService.fetchMissionRequests(page, pageSize, startDate, endDate, status, searchType, searchQuery),
        enabled: !!token,
    })

    return {
        missions: data?.data?.missions || [],
        totalMissions: data?.data?.totalCount || 0,
        metadata: data?.data?.metadata || initialMetadata,
        isMissionsLoading: isLoading,
    }
}

export const useGetMyMissions = (
    page = 1,
    pageSize = 10,
    startDate?: string,
    endDate?: string,
    status?: number,
) => {
    const token = useUserStore((state) => state.token);
    const missionService = useMissionService();

    const { data , isLoading} = useQuery({
        queryKey: [MY_MISSIONS_QUERY_KEY, page, pageSize, startDate, endDate, status],
        queryFn: ()=> missionService.fetchMyMissionRequests(page, pageSize, startDate, endDate, status),
        enabled: !!token
    });

    return {
        missions: data?.data?.missions || [],
        totalMissions: data?.data?.totalCount || 0,
        metadata: data?.data?.metadata || initialMetadata,
        isMissionsLoading: isLoading,
    }
}

export const useGetMissionByID = (
    missionId: number,
) => {
    const token = useUserStore((state) => state.token);
    const missionService = useMissionService();

    const { data, isLoading } = useQuery({
        queryKey: [MISSION_DETAILS_QUERY_KEY, missionId],
        queryFn: () => missionService.fetchMissionRequestById(missionId),
        enabled: !!missionId && !!token,
    });

    return {
        mission: data?.data,
        isMissionLoading: isLoading,
    }
}

export const useGetMyMissionByID = (
    missionId: number,
) => {
    const token = useUserStore((state) => state.token);
    const missionService = useMissionService();
    
    const { data, isLoading } = useQuery({
        queryKey: [MY_MISSION_DETAILS_QUERY_KEY, missionId],
        queryFn: () => missionService.fetchMyMissionRequestById(missionId),
        enabled: !!missionId && !!token,
    });
    
    return {
        mission: data?.data,
        isMissionLoading: isLoading,
    }
}

export const useCreateMission = () => {
    const { language } = useLanguageStore();
    const queryClient = useQueryClient();
    const missionService = useMissionService();

    return useMutation({
        mutationFn: (missionData: IMissionCredentials) => missionService.create(missionData),
        onSuccess: ({ status, data }) => {
            queryClient.invalidateQueries({queryKey: [MY_MISSIONS_QUERY_KEY]});
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

export const useAssignMission = () => {
    const { language } = useLanguageStore();
    const queryClient = useQueryClient();
    const missionService = useMissionService();
 
    return useMutation({
        mutationFn: (missionData: IAssignMissionCredentials) => missionService.assign(missionData),
        onSuccess: ({ status, data }) => {
            queryClient.invalidateQueries({queryKey: [MISSIONS_QUERY_KEY]});
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

export const useUpdateMission = () => {
    const { language } = useLanguageStore();
    const queryClient = useQueryClient();
    const missionService = useMissionService();

    return useMutation({
        mutationFn: (missionData: IMissionData) => missionService.update(missionData),
        onSuccess: ({ status, data }, missionData ) => {
            queryClient.invalidateQueries({queryKey: [MY_MISSIONS_QUERY_KEY]});
            queryClient.invalidateQueries({queryKey: [MY_MISSION_DETAILS_QUERY_KEY, missionData.id]});
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

export const useRejectMission = () => {
    const { language } = useLanguageStore();
    const queryClient = useQueryClient();
    const missionService = useMissionService();

    return useMutation({
        mutationFn: (missionData: IRejectMissionCredentials) => missionService.reject(missionData),
        onSuccess: ({ status, data }) => {
            queryClient.invalidateQueries({queryKey: [MISSIONS_QUERY_KEY]});
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

export const useAcceptMission = () => {
    const { language } = useLanguageStore();
    const queryClient = useQueryClient();
    const missionService = useMissionService();

    return useMutation({
        mutationFn: (missionId: number) => missionService.accept(missionId),
        onSuccess: ({ status, data }) => {
            queryClient.invalidateQueries({queryKey: [MISSIONS_QUERY_KEY]});
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




