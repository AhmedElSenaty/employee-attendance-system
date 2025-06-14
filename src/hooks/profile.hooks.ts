import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";

import {
  IErrorResponse,
  initialMetadata,
  IProfileCredentials,
} from "../interfaces";

import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { ProfileService } from "../services"; // Assuming you have this service class

export const PROFILES_QUERY_KEY = "profiles";
export const PROFILES_LIST_QUERY_KEY = "profilesList";
export const PROFILE_DETAILS_QUERY_KEY = "profileDetails";
export const PROFILE_PERMISSIONS_QUERY_KEY = "profilePermissions";

export const useGetProfiles = (
  page: number,
  pageSize: number,
  searchKey: string,
  debouncedSearchQuery: string
) => {
  const token = useUserStore((state) => state.token);
  const profileService = new ProfileService(token);

  const { data, isLoading } = useQuery({
    queryKey: [PROFILES_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => profileService.fetchAll(page, pageSize, searchKey, debouncedSearchQuery),
    enabled: !!token,
  });

  return {
    profiles: data?.data?.profiles || [],
    metadata: data?.data?.metadata || initialMetadata,
    totalProfiles: data?.data?.totalCount || 0,
    isProfilesDataLoading: isLoading,
  };
};

export const useGetProfileByID = (
  id: string,
  resetInputs?: (data: IProfileCredentials) => void
) => {
  const token = useUserStore((state) => state.token);
  const profileService = new ProfileService(token);

  const { data, isLoading } = useQuery({
    queryKey: [PROFILE_DETAILS_QUERY_KEY, id],
    queryFn: () => profileService.fetchByID(id),
    enabled: !!id && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetInputs?.({
        id: data.data.id,
        nameEn: data.data.nameEn,
        nameAr: data.data.nameAr,
        permissionsIds: data.data.permissionsIds,
      });
    }
  }, [data, resetInputs]);

  return {
    profile: data?.data,
    isProfileDataLoading: isLoading,
  };
};

export const useGetProfilesList = () => {
  const token = useUserStore((state) => state.token);
  const profileService = new ProfileService(token);

  const { data, isLoading } = useQuery({
    queryKey: [PROFILES_LIST_QUERY_KEY],
    queryFn: () => profileService.fetchList(),
    enabled: !!token,
  });

  return {
    profilesList: data ?? [],
    profilesListIsLoading: isLoading,
  };
};

export const useGetProfilePermissions = (id: number) => {
  const token = useUserStore((state) => state.token);
  const profileService = new ProfileService(token);

  const { data, isLoading } = useQuery({
    queryKey: [PROFILE_PERMISSIONS_QUERY_KEY, id],
    queryFn: () => profileService.fetchPermissions(id),
    enabled: !!token && !!id,
  });

  return {
    profilePermissions: data ?? [],
    profilePermissionsIsLoading: isLoading,
  };
};

export const useCreateProfile = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const profileService = new ProfileService(token);

  return useMutation({
    mutationFn: (profile: IProfileCredentials) => profileService.create(profile),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [PROFILES_QUERY_KEY] });

      if (status === 201) {
        const message = getTranslatedMessage(data.message ?? "", language);
        showToast("success", message);
      }
    },
    onError: (error) => {
      handleApiError(error as AxiosError<IErrorResponse>, language);
    },
  });
};

export const useUpdateProfile = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const profileService = new ProfileService(token);

  return useMutation({
    mutationFn: (profile: IProfileCredentials) => profileService.update(profile),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [PROFILES_QUERY_KEY] });

      if (status === 200) {
        const message = getTranslatedMessage(data.message ?? "", language);
        showToast("success", message);
      }
    },
    onError: (error) => {
      handleApiError(error as AxiosError<IErrorResponse>, language);
    },
  });
};

export const useDeleteProfile = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const profileService = new ProfileService(token);

  return useMutation({
    mutationFn: (id: string) => profileService.delete(id),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [PROFILES_QUERY_KEY] });

      if (status === 200) {
        const message = getTranslatedMessage(data.message ?? "", language);
        showToast("success", message);
      }
    },
    onError: (error) => {
      handleApiError(error as AxiosError<IErrorResponse>, language);
    },
  });
};
