import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IErrorResponse, initialMetadata, OfficialVacationCredentials } from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import { useLanguageStore, useUserStore } from "../store/";
import { OfficialVacationService } from "../services";
import { QueryKeys } from "../constants";
import { OfficialVacationFormValues } from "../validation";

export const useOfficialVacationService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new OfficialVacationService(token);
  }, [token]);

  return service;
};

export const useGetOfficialVacations = (
  page?: number,
  pageSize?: number,
  startDate?: string,
  endDate?: string,
  searchKey?: string,
  searchQuery?: string
) => {
  const token = useUserStore((state) => state.token);

  const officialVacationService = useOfficialVacationService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.OfficialVacations.All, 
      page, 
      pageSize, 
      startDate,
      endDate,
      `${searchKey && searchQuery ? [searchKey, searchQuery] : ""}`
    ],
    queryFn: () => officialVacationService.fetchAll(page, pageSize, startDate, endDate, searchKey, searchQuery),
    enabled: !!token,
  });

  return {
    officialVacations: data?.data?.data?.officialVacations || [],
    count: data?.data?.data?.totalCount,
    metadata: data?.data?.data?.metadata || initialMetadata,
    isLoading,
  };
};

export const useGetOfficialVacationById = (
  id: number,
  resetInputs?: (data: OfficialVacationFormValues) => void
) => {
  const token = useUserStore((state) => state.token);
  const officialVacationService = useOfficialVacationService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.OfficialVacations.Details, id],
    queryFn: () => officialVacationService.fetchByID(id),
    enabled: !!id && !!token,
  });

  useEffect(() => {
    if (data?.data?.data) {
      resetInputs?.(data?.data?.data);
    }
  }, [data, resetInputs]);

  return {
    officialVacation: data?.data?.data,
    isLoading,
  };
};
export const useCreateOfficialVacation = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const officialVacationService = useOfficialVacationService();

  return useMutation({
    mutationFn: (officialVacationData: OfficialVacationCredentials) =>
      officialVacationService.create(officialVacationData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.OfficialVacations.All] });

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

export const useUpdateOfficialVacation = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const officialVacationService = useOfficialVacationService();

  return useMutation({
    mutationFn: (officialVacationData: OfficialVacationCredentials) =>
      officialVacationService.update(officialVacationData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.OfficialVacations.All] });

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

export const useDeleteOfficialVacation = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const officialVacationService = useOfficialVacationService();

  return useMutation({
    mutationFn: (officialVacationID: number) => officialVacationService.delete(officialVacationID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.OfficialVacations.All] });

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