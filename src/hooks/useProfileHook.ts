import { useSelector } from "react-redux";
import { selectToken } from "../context/slices/userSlice";
import { IErrorResponse, initialMetadata, IProfileCredentials, UseGetAllProfilesReturn, UseGetProfileByIDReturn } from "../interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RootState } from "../context/store";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { createProfile, deleteProfileByID, fetchAllProfiles, fetchProfileByID, fetchProfilePermissions, fetchProfilesList, updateProfile } from "../services/admin";

const PROFILES_QUERY_KEY = "profiles";
const PROFILES_LIST_QUERY_KEY = "profilesList";
const PROFILE_DETAILS_QUERY_KEY = "profileDetails";
const PROFILE_PERMISSIONS_QUERY_KEY = "profilePermissions";

const useGetAllProfiles = (
  page: number, 
  pageSize: number, 
  searchKey: string, 
  debouncedSearchQuery: string
): UseGetAllProfilesReturn => {
  const token = useSelector(selectToken); // Get token from Redux

  const { data, isLoading } = useQuery({
    queryKey: [PROFILES_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => fetchAllProfiles(page, pageSize, searchKey, debouncedSearchQuery, token),
    enabled: !!token,
  });

  return { 
    profiles: data?.data.profiles || [], 
    totalProfiles: data?.data.totalCount || 0, 
    metadata: data?.data.metadata || initialMetadata, 
    isProfilesDataLoading: isLoading 
  };
};

const useGetProfileByID = (
  id: string, 
  resetInputs?: (data: IProfileCredentials) => void
): UseGetProfileByIDReturn => {
  const token = useSelector(selectToken);
  const { data, isLoading } = useQuery({
    queryKey: [PROFILE_DETAILS_QUERY_KEY, id],
    queryFn: () => fetchProfileByID(id, token),
    enabled: !!id && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetInputs?.({ 
        id: data.data.id, 
        nameEn: data.data.nameEn, 
        nameAr: data.data.nameAr, 
        permissionsIds: data.data.permissionsIds 
      });
    }
  }, [data, resetInputs, id, token]);

  return { profile: data?.data, isProfileDataLoading: isLoading };
};

const useGetProfilesList = () => {
  const token = useSelector(selectToken);
  const { data, isLoading } = useQuery({
    queryKey: [PROFILES_LIST_QUERY_KEY],
    queryFn: () => fetchProfilesList(token),
    enabled: !!token,
  });
  return { profilesList: data ?? [], profilesListIsLoading: isLoading };
};

const useGetProfilePermissions = (id: number) => {
  const token = useSelector(selectToken);
  const { data, isLoading } = useQuery({
    queryKey: [PROFILE_PERMISSIONS_QUERY_KEY, id],
    queryFn: () => fetchProfilePermissions(id, token),
    enabled: !!token && !!id,
  });
  return { profilePermissions: data ?? [], profilePermissionsIsLoading: isLoading };
};

const useManageProfiles = () => {
  const token = useSelector(selectToken); // Get token from Redux
  const { language } = useSelector((state: RootState) => state.language);
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (profile: IProfileCredentials) => createProfile(profile, token),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [PROFILES_QUERY_KEY] });
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

  const updateMutation = useMutation({
    mutationFn: (profile: IProfileCredentials) => updateProfile(profile, token),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [PROFILES_QUERY_KEY] });
      
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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProfileByID(id, token),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [PROFILES_QUERY_KEY] });

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

  return {
    addProfileAndGetID: addMutation.mutateAsync,
    updateProfile: updateMutation.mutate,
    deleteProfile: deleteMutation.mutate,
    isAdding: addMutation.isPending,
    isUpdateing: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};

export {
  useGetAllProfiles,
  useGetProfileByID,
  useManageProfiles,
  useGetProfilesList,
  useGetProfilePermissions
};
