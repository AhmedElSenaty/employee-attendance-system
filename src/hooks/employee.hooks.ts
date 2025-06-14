import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  IEmployeeCredentials,
  IErrorResponse,
  initialMetadata,
} from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { EmployeeService } from "../services";

export const EMPLOYEES_QUERY_KEY = "employees";
export const EMPLOYEE_DETAILS_QUERY_KEY = "employeeDetails";
export const EMPLOYEES_COUNT_QUERY_KEY = "employeesCount";
export const EMPLOYEES_LIST_QUERY_KEY = "employeesList";

export const useGetAllEmployees = (
  page: number,
  pageSize: number,
  searchKey: string,
  debouncedSearchQuery: string
) => {
  const token = useUserStore((state) => state.token);
  const employeeService = new EmployeeService(token);

  const { data, isLoading } = useQuery({
    queryKey: [EMPLOYEES_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => employeeService.fetchAll(page, pageSize, searchKey, debouncedSearchQuery),
    enabled: !!token,
  });

  return {
    employees: data?.data?.employees || [],
    metadata: data?.data?.metadata || initialMetadata,
    isEmployeesDataLoading: isLoading,
  };
};

export const useGetEmployeeByID = (
  employeeID: string,
  resetInputs?: (data: IEmployeeCredentials) => void
) => {
  const token = useUserStore((state) => state.token);
  const employeeService = new EmployeeService(token);

  const { data, isLoading } = useQuery({
    queryKey: [EMPLOYEE_DETAILS_QUERY_KEY, employeeID],
    queryFn: () => employeeService.fetchByID(employeeID),
    enabled: !!employeeID && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetInputs?.(data.data);
    }
  }, [data, resetInputs]);

  return {
    employee: data?.data,
    isEmployeeDataLoading: isLoading,
  };
};

export const useGetEmployeesCount = () => {
  const token = useUserStore((state) => state.token);
  const employeeService = new EmployeeService(token);

  const { data, isLoading } = useQuery({
    queryKey: [EMPLOYEES_COUNT_QUERY_KEY],
    queryFn: () => employeeService.fetchCount(),
    enabled: !!token,
  });

  return {
    totalCount: data?.data?.totalCount || 0,
    lockedCount: data?.data?.lockedCount || 0,
    blockedCount: data?.data?.blockedCount || 0,
    activatedCount: data?.data?.activatedCount || 0,
    deactivatedCount: data?.data?.deactivatedCount || 0,
    isEmployeesCountLoading: isLoading,
  };
};

export const useGetEmployeesList = () => {
  const token = useUserStore((state) => state.token);
  const employeeService = new EmployeeService(token);

  const { data, isLoading } = useQuery({
    queryKey: [EMPLOYEES_LIST_QUERY_KEY],
    queryFn: () => employeeService.fetchList(),
    enabled: !!token,
  });

  return {
    employeesList: data ?? [],
    isEmployeesListLoading: isLoading,
  };
};

export const useCreateEmployee = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const employeeService = new EmployeeService(token);

  return useMutation({
    mutationFn: (employeeData: IEmployeeCredentials) => employeeService.create(employeeData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_QUERY_KEY] });
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
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const employeeService = new EmployeeService(token);

  return useMutation({
    mutationFn: (employeeData: IEmployeeCredentials) => employeeService.update(employeeData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_QUERY_KEY] });
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
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const employeeService = new EmployeeService(token);

  return useMutation({
    mutationFn: (employeeID: string) => employeeService.toggleReportStatus(employeeID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_QUERY_KEY] });
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
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const employeeService = new EmployeeService(token);

  return useMutation({
    mutationFn: (employeeID: string) => employeeService.delete(employeeID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_QUERY_KEY] });
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
