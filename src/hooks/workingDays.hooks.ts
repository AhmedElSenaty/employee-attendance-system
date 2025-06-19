import { useMemo } from "react";
import { useLanguageStore, useUserStore } from "../store";
import { WorkingDaysService } from "../services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../constants";
import { IErrorResponse, IUpdateWorkingDays } from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";

export const useWorkingDaysService = () => {
  const token = useUserStore((state) => state.token);

  return useMemo(() => new WorkingDaysService(token), [token]);
};

export const useGetMyWorkingDays = () => {
  const token = useUserStore((state) => state.token);
  const service = useWorkingDaysService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.WorkingDays.Me],
    queryFn: () => service.fetchMe(),
    enabled: !!token,
  });

  return {
    myWorkingDays: data?.data?.data?.permission || [],
    isLoadingMyWorkingDays: isLoading,
  };
};

export const useGetWorkingDaysByID = (employeeID: string) => {
  const token = useUserStore((state) => state.token);
  const service = useWorkingDaysService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.WorkingDays.ByID, employeeID],
    queryFn: () => service.fetchByID(employeeID),
    enabled: !!employeeID && !!token,
  });

  return {
    workingDays: data?.data?.data || null,
    isWorkingDaysLoading: isLoading,
  };
};


export const useUpdateWorkingDays = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguageStore();
  const service = useWorkingDaysService();

  return useMutation({
    mutationFn: (data: IUpdateWorkingDays) => service.update(data),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.WorkingDays.Me] });
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