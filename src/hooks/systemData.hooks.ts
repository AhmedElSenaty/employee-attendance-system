import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appendSecondsToTime, getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useMemo } from "react";
import { useUserStore, useLanguageStore } from "../store/";
import { SystemDataService } from "../services";
import { QueryKeys } from "../constants";
import { IErrorResponse, initialSystemData, ISystemDataCredentials } from "../interfaces";

/**
 * Custom hook to create an instance of `SystemDataService` using the current user's token.
 * 
 * @returns A memoized instance of `SystemDataService`.
 */
export const useSystemDataService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new SystemDataService(token);
  }, [token]);

  return service;
};

/**
 * Custom hook to fetch system data (such as attendance and leave rules) from the server.
 * Uses React Query's `useQuery` to perform and cache the request.
 * 
 * @returns An object containing:
 * - `systemData`: the fetched system data or a default value (`initialSystemData`)
 * - `isSystemDataLoading`: boolean indicating loading state
 */
export const useGetSystemData = () => {
  const token = useUserStore((state) => state.token);
  const systemDataService = useSystemDataService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.SystemData.All],
    queryFn: () => systemDataService.fetch(),
    enabled: !!token, // ensures query runs only if token exists
  });

  return {
    systemData: data?.data?.data || initialSystemData,
    isSystemDataLoading: isLoading,
  };
};

/**
 * Custom hook to update the system data configuration.
 * 
 * - Appends seconds to the time fields before sending the request.
 * - On success: shows a translated success toast and invalidates the cached system data query.
 * - On error: handles and displays a localized error using `handleApiError`.
 * 
 * @returns A mutation object from `useMutation` for triggering the update request.
 */
export const useUpdateSystemData = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const systemDataService = useSystemDataService();

  return useMutation({
    mutationFn: (systemData: ISystemDataCredentials) => {
      const formatted = {
        ...systemData,
        max_time_To_attend: appendSecondsToTime(systemData.max_time_To_attend || ""),
        min_time_To_Go: appendSecondsToTime(systemData.min_time_To_Go || ""),
      };
      return systemDataService.update(formatted)
    },
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SystemData.All] });
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
