import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import {
  IErrorResponse,
  initialMetadata,
  ProfileCredentials,
} from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { ProfileService } from "../services"; // Assuming you have this service class
import { QueryKeys } from "../constants";
import { useLanguageStore, useUserStore } from "../store";
import { ProfileFormValues } from "../validation";


export const useProfileService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new ProfileService(token);
  }, [token]);

  return service;
};

export const useGetProfiles = (
  page?: number,
  pageSize?: number,
  searchKey?: string,
  searchQuery?: string
) => {
  const token = useUserStore((state) => state.token);
  const profileService = useProfileService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.Profiles.All, page, pageSize, 
      `${searchKey && searchQuery ? [searchKey, searchQuery] : ""}`, 
    ],
    queryFn: () => profileService.fetchAll(page, pageSize, searchKey, searchQuery),
    enabled: !!token,
  });

  return {
    profiles: data?.data?.data?.profiles || [],
    metadata: data?.data?.data?.metadata || initialMetadata,
    count: data?.data?.data?.totalCount || 0,
    isLoading,
  };
};

export const useGetProfileByID = (
  id: string,
  resetInputs?: (data: ProfileFormValues) => void
) => {
  const token = useUserStore((state) => state.token);
  const profileService = useProfileService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Profiles.Details, id],
    queryFn: () => profileService.fetchByID(id),
    enabled: !!id && !!token,
  });

  useEffect(() => {
    if (data?.data?.data) {
      resetInputs?.(data?.data?.data);
    }
  }, [data, resetInputs]);

  return {
    profile: data?.data?.data,
    isLoading,
  };
};

export const useGetProfilesList = () => {
  const token = useUserStore((state) => state.token);
  const profileService = useProfileService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Profiles.List],
    queryFn: () => profileService.fetchList(),
    enabled: !!token,
  });

  return {
    profilesList: data?.data?.data ?? [],
    isLoading,
  };
};

export const useGetProfilePermissions = (id: number) => {
  const token = useUserStore((state) => state.token);
  const profileService = useProfileService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Profiles.Permissions, id],
    queryFn: () => profileService.fetchPermissions(id),
    enabled: !!token && !!id,
  });
  
  return {
    permissions: data?.data?.data?.permission ?? [],
    isLoading,
  };
};

export const useCreateProfile = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const profileService = useProfileService();

  return useMutation({
    mutationFn: (profile: ProfileCredentials) => profileService.create(profile),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Profiles.All] });

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
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const profileService = useProfileService();

  return useMutation({
    mutationFn: (profile: ProfileCredentials) => profileService.update(profile),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Profiles.All] });

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
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const profileService = useProfileService();

  return useMutation({
    mutationFn: (id: string) => profileService.delete(id),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Profiles.All] });

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
