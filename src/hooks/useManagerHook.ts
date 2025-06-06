import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectToken } from "../context/slices/userSlice";
import { createManager, deleteManagerByID, fetchAllManagers, fetchManagerByID, fetchManagersCount, updateManager } from "../services/admin";
import { IErrorResponse, IManagerCredentials, initialMetadata, UseGetAllManagersReturn, UseGetManagerByIDReturn, UseGetManagersCountReturn } from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useLanguageStore } from "../store/language.store";

const MANAGERS_QUERY_KEY = "managers";
const MAMANGER_DETAILS_QUERY_KEY = "managerDetails";
const MANAGERS_COUNT_QUERY_KEY = "managersCount";

const useGetAllManagers = ( 
  page: number, 
  pageSize: number, 
  searchKey: string, 
  debouncedSearchQuery: string
): UseGetAllManagersReturn => {
  const token = useSelector(selectToken);

  const { data, isLoading } = useQuery({
    queryKey: [MANAGERS_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => fetchAllManagers(page, pageSize, searchKey, debouncedSearchQuery, token),
    enabled: !!token,
  });

  return { 
    managers: data?.data?.managers || [], 
    metadata: data?.data?.metadata || initialMetadata, 
    isManagersDataLoading: isLoading 
  };
};


const useGetManagerByID = (
  managerID: string, 
  resetInputs?: (data: IManagerCredentials) => void
): UseGetManagerByIDReturn => {
  const token = useSelector(selectToken); // Get token from Redux
  const { data, isLoading } = useQuery({
    queryKey: [MAMANGER_DETAILS_QUERY_KEY, managerID],
    queryFn: () => fetchManagerByID(managerID, token),
    enabled: !!managerID && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetInputs?.({ 
        username: data?.data?.username, 
        email: data?.data?.email, 
        password: ""
      });
    }
  }, [data, resetInputs]);

  return { 
    manager: data?.data, 
    isManagerDataLoading: isLoading
  };
};

const useGetManagersCount = (): UseGetManagersCountReturn => {
  const token = useSelector(selectToken);
  const { data, isLoading } = useQuery({
    queryKey: [MANAGERS_COUNT_QUERY_KEY],
    queryFn: () => fetchManagersCount(token),
    enabled: !!token,
  });
  
  return { 
    totalCount: data?.data?.totalCount || 0, 
    lockedCount: data?.data?.lockedCount || 0, 
    blockedCount: data?.data?.blockedCount || 0,
    isManagersCountLoading: isLoading
  };
};

const useManageManagers = () => {
  const token = useSelector(selectToken); // Get token from Redux
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (managerData: IManagerCredentials) => createManager(managerData, token),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [MANAGERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MANAGERS_COUNT_QUERY_KEY] });

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
    mutationFn: (managerData: IManagerCredentials) => updateManager(managerData, token),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [MANAGERS_QUERY_KEY] });

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
    mutationFn: (managerID: string) => deleteManagerByID(managerID, token),
    onSuccess: ({ data, status }) => {
      queryClient.invalidateQueries({ queryKey: [MANAGERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MANAGERS_COUNT_QUERY_KEY] });
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
    addManagerAndGetUserID: addMutation.mutateAsync,
    isAdding: addMutation.isPending,

    updateManager: updateMutation.mutate,
    isupdateing: updateMutation.isPending,

    deleteManager: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};

export {
  useGetAllManagers,
  useGetManagerByID,
  useGetManagersCount,
  useManageManagers
}