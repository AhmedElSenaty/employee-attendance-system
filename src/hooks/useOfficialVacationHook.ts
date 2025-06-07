import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IErrorResponse, initialMetadata, IOfficialVacationCredentials, UseGetAllOfficialVacationsReturn, UseGetOfficialVacationByIDReturn } from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { OfficialVacationService } from "../services";

const OFFICIAL_VACATIONS_QUERY_KEY = "OfficialVacations";
const OFFICIAL_VACATION_DETAILS_QUERY_KEY = "OfficialVacationDetails";

export const useGetOfficialVacations = (
  page: number,
  pageSize: number,
  searchKey: string,
  debouncedSearchQuery: string
): UseGetAllOfficialVacationsReturn => {
  const token = useUserStore((state) => state.token);

  const officialVacationService = new OfficialVacationService(token);

  const { data, isLoading } = useQuery({
    queryKey: [OFFICIAL_VACATIONS_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => officialVacationService.fetchAll(page, pageSize, searchKey, debouncedSearchQuery),
    enabled: !!token,
  });

  return {
    officialVacations: data?.data?.officialVacations || [],
    metadata: data?.data?.metadata || initialMetadata,
    totalOfficialVacations: data?.data?.totalCount,
    isOfficialVacationsDataLoading: isLoading,
  };
};

export const useGetOfficialVacationById = (
  officialVacationID: number,
  resetInputs?: (data: IOfficialVacationCredentials) => void
): UseGetOfficialVacationByIDReturn => {
  const token = useUserStore((state) => state.token);
  const officialVacationService = new OfficialVacationService(token);

  const { data, isLoading } = useQuery({
    queryKey: [OFFICIAL_VACATION_DETAILS_QUERY_KEY, officialVacationID],
    queryFn: () => officialVacationService.fetchByID(officialVacationID),
    enabled: !!officialVacationID && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetInputs?.({
        name: data?.data?.name,
        startDate: data?.data?.startDate,
        endDate: data?.data?.endDate,
      });
    }
  }, [data, resetInputs]);

  return {
    officialVacation: data?.data,
    isOfficialVacationDataLoading: isLoading,
  };
};
export const useCreateOfficialVacation = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const officialVacationService = new OfficialVacationService(token);

  return useMutation({
    mutationFn: (officialVacationData: IOfficialVacationCredentials) =>
      officialVacationService.create(officialVacationData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [OFFICIAL_VACATIONS_QUERY_KEY] });

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
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const officialVacationService = new OfficialVacationService(token);

  return useMutation({
    mutationFn: (officialVacationData: IOfficialVacationCredentials) =>
      officialVacationService.update(officialVacationData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [OFFICIAL_VACATIONS_QUERY_KEY] });

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
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const officialVacationService = new OfficialVacationService(token);

  return useMutation({
    mutationFn: (officialVacationID: number) => officialVacationService.delete(officialVacationID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [OFFICIAL_VACATIONS_QUERY_KEY] });

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