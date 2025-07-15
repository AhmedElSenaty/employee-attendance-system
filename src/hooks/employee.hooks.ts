import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EmployeeWorkingHours, IErrorResponse, initialMetadata } from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { EmployeeService } from "../services";
import { EmployeeFormValues } from "../validation";
import { QueryKeys } from "../constants";
import { useAccountService } from "./me.hooks";

export const useEmployeeService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new EmployeeService(token);
  }, [token]);

  return service;
};

export const useGetAllEmployees = (
  page?: number,
  pageSize?: number,
  searchKey?: string,
  searchQuery?: string
) => {
  const token = useUserStore((state) => state.token);
  const employeeService = useEmployeeService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.Employees.All,
      page,
      pageSize,
      `${searchKey && searchQuery ? [searchKey, searchQuery] : ""}`,
    ],
    queryFn: () =>
      employeeService.fetchAll(page, pageSize, searchKey, searchQuery),
    enabled: !!token,
  });

  return {
    employees: data?.data?.data?.employees || [],
    metadata: data?.data?.data?.metadata || initialMetadata,
    isLoading,
  };
};

export const useGetEmployeeByID = (
  employeeID: string,
  resetInputs?: (data: EmployeeFormValues) => void
) => {
  const token = useUserStore((state) => state.token);
  const employeeService = useEmployeeService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Employees.Details, employeeID],
    queryFn: () => employeeService.fetchByID(employeeID),
    enabled: !!employeeID && !!token,
  });

  useEffect(() => {
    if (data?.data?.data) {
      resetInputs?.(data.data.data);
    }
  }, [data, resetInputs]);

  return {
    employee: data?.data?.data,
    isLoading,
  };
};

export const useGetEmployeeVacationsByID = (employeeID: string) => {
  const token = useUserStore((state) => state.token);
  const employeeService = useEmployeeService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Employees.Vacations, employeeID],
    queryFn: () => employeeService.fetchVacationsByID(employeeID),
    enabled: !!employeeID && !!token,
  });

  return {
    employeeVacations: data?.data?.data,
    isLoading,
  };
};

export const useGetEmployeesCount = () => {
  const token = useUserStore((state) => state.token);
  const employeeService = useEmployeeService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Employees.Count],
    queryFn: () => employeeService.fetchCount(),
    enabled: !!token,
  });

  return {
    totalCount: data?.data?.data?.totalCount || 0,
    lockedCount: data?.data?.data?.lockedCount || 0,
    blockedCount: data?.data?.data?.blockedCount || 0,
    activatedCount: data?.data?.data?.activatedCount || 0,
    deactivatedCount: data?.data?.data?.deactivatedCount || 0,
    isLoading,
  };
};

export const useGetEmployeesList = () => {
  const token = useUserStore((state) => state.token);
  const employeeService = useEmployeeService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Employees.List],
    queryFn: () => employeeService.fetchList(),
    enabled: !!token,
  });

  return {
    employeesList: data?.data?.data ?? [],
    isLoading,
  };
};

export const useGetEmployeeMyVacations = () => {
  const token = useUserStore((state) => state.token);
  const employeeService = useEmployeeService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Employees.MyVacations],
    queryFn: () => employeeService.fetchMyVacations(),
    enabled: !!token,
  });

  return {
    myVacations: data?.data?.data,
    isLoading,
  };
};

export const useCreateEmployee = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const employeeService = useEmployeeService();

  return useMutation({
    mutationFn: (employeeData: EmployeeFormValues) =>
      employeeService.create(employeeData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Employees.All] });
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

export const useUpdateEmployee = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const employeeService = useEmployeeService();

  return useMutation({
    mutationFn: (employeeData: EmployeeFormValues) =>
      employeeService.update(employeeData),
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

export const useToggleReportEmployeeStatus = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const employeeService = useEmployeeService();

  return useMutation({
    mutationFn: (employeeID: string) =>
      employeeService.toggleReportStatus(employeeID),
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

export const useDeleteEmployee = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const employeeService = useEmployeeService();

  return useMutation({
    mutationFn: (employeeID: string) => employeeService.delete(employeeID),
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

export const useRestEmployeeTimeVacations = () => {
  const { language } = useLanguageStore();
  const employeeService = useEmployeeService();

  return useMutation({
    mutationFn: (time: number) => employeeService.resetEmployeeVacations(time),
    onSuccess: ({ status, data }) => {
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

export const useResetEmployeePassword = () => {
  const { language } = useLanguageStore();
  const accountService = useAccountService();

  return useMutation({
    mutationFn: (employeeID: string) =>
      accountService.resetEmployeePassword(employeeID),
    onSuccess: ({ status, data }) => {
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

export const useUpdateEmployeeWorkingHours = () => {
  const { language } = useLanguageStore();
  const employeeService = useEmployeeService();

  return useMutation({
    mutationFn: (data: EmployeeWorkingHours) => {

      data.MedicalReport = data.MedicalReport[0]
      return employeeService.updateWorkingHours(data)
    },
    onSuccess: ({ status, data }) => {
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