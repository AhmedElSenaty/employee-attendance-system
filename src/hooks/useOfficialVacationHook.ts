import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectToken } from "../context/slices/userSlice";
import { createOfficialVacation, deleteOfficialVacation, fetchAllOfficialVacations, fetchOfficialVacationByID, updateOfficialVacation } from "../services/admin";
import { IErrorResponse, initialMetadata, IOfficialVacationCredentials, UseGetAllOfficialVacationsReturn, UseGetOfficialVacationByIDReturn } from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useLanguageStore } from "../store/language.store";

const OFFICIAL_VACATIONS_QUERY_KEY = "OfficialVacations";
const OFFICIAL_VACATION_DETAILS_QUERY_KEY = "OfficialVacationDetails";


const useGetAllOfficialVacations = ( 
  page: number, 
  pageSize: number, 
  searchKey: string, 
  debouncedSearchQuery: string
): UseGetAllOfficialVacationsReturn => {
  const token = useSelector(selectToken);
  const { data, isLoading } = useQuery({
    queryKey: [OFFICIAL_VACATIONS_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => fetchAllOfficialVacations(page, pageSize, searchKey, debouncedSearchQuery, token),
    enabled: !!token,
  });

  return { 
    officialVacations: data?.data?.officialVacations || [], 
    metadata: data?.data?.metadata || initialMetadata, 
    totalOfficialVacations: data?.data?.totalCount,
    isOfficialVacationsDataLoading: isLoading,
  };
};

const useGetOfficialVacationByID = (
  officialVacationID: number, 
  resetInputs?: (data: IOfficialVacationCredentials) => void
): UseGetOfficialVacationByIDReturn => {
  const token = useSelector(selectToken); // Get token from Redux
  const { data, isLoading } = useQuery({
    queryKey: [OFFICIAL_VACATION_DETAILS_QUERY_KEY, officialVacationID],
    queryFn: () => fetchOfficialVacationByID(officialVacationID, token),
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
    isOfficialVacationDataLoading: isLoading
  };
};


const useManageOfficialVacations = () => {
  const token = useSelector(selectToken); // Get token from Redux
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (officialVacationData: IOfficialVacationCredentials) => createOfficialVacation(officialVacationData, token),
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

  const updateMutation = useMutation({
    mutationFn: (officialVacationData: IOfficialVacationCredentials) => updateOfficialVacation(officialVacationData, token),
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

  const deleteMutation = useMutation({
    mutationFn: (officialVacationID: number) => deleteOfficialVacation(officialVacationID, token),
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

  return {
    addOfficialVacation: addMutation.mutate,
    isAdding: addMutation.isPending,

    updateOfficialVacation: updateMutation.mutate,
    isUpdating: updateMutation.isPending,

    deleteOfficialVacation: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};

export {
  useGetAllOfficialVacations,
  useGetOfficialVacationByID,
  useManageOfficialVacations
}