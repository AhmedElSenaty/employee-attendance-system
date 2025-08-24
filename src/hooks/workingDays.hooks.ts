import { useMemo } from "react";
import { useLanguageStore, useUserStore } from "../store";
import { WorkingDaysService } from "../services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../constants";
import { IErrorResponse, UpdateWorkingDays } from "../interfaces";
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

  const EmployeeDays = data?.data?.data?.employeeDays;
  return {
    myWorkingDays: EmployeeDays?.employeeWorkingDays || [],
    myRestDays: EmployeeDays?.employeeRestDays || [],
    scheduleStartDate: EmployeeDays?.startDate || null,
    scheduleEndDate: EmployeeDays?.endDate || null,
    prefex: EmployeeDays?.description || "",
    isLoading,
  };
};

export const useGetWorkingDaysByID = (employeeID: string | null) => {
  const token = useUserStore((state) => state.token);
  const service = useWorkingDaysService();

  const isEnabled = Boolean(employeeID && token);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [QueryKeys.WorkingDays.ByID, employeeID],
    queryFn: () => service.fetchByID(employeeID!),
    enabled: isEnabled,
  });

  return {
    workingDays: data?.data?.data || null,
    isWorkingDaysLoading: isLoading,
    refetchWorkingDays: refetch,
  };
};

export const useGetWorkingDaysByID1 = (employeeID: string) => {
  const token = useUserStore((state) => state.token);
  const service = useWorkingDaysService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.WorkingDays.ByID, employeeID],
    queryFn: () => service.fetchByID(employeeID),
    enabled: !!employeeID && !!token,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return {
    workingDays: data?.data?.data || null,
    isWorkingDaysLoading: isLoading,
  };
};

export const useRestorePreviousSchedule = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const service = useWorkingDaysService();

  return useMutation({
    mutationFn: (employeeID: string) =>
      service.restorePreviousSchedule(employeeID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Employees.All] });
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

export const useUpdateWorkingDays = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguageStore();
  const service = useWorkingDaysService();

  return useMutation({
    mutationFn: (data: UpdateWorkingDays) => service.update(data),
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
