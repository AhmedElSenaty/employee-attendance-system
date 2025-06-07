import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  IDepartmentCredentials,
  IErrorResponse,
  UseGetAllDepartmentsReturn,
  UseGetDepartmentnByIDReturn,
  initialMetadata,
  UseGetDepartmentsListReturn,
} from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { DepartmentService } from "../services";

export const DEPARTMENTS_QUERY_KEY = "departments";
export const DEPARTMENT_DETAILS_QUERY_KEY = "departmentDetails";
export const DEPARTMENTS_LIST_QUERY_KEY = "departmentsList";

export const useGetDepartments = (
  page: number,
  pageSize: number,
  searchKey: string,
  debouncedSearchQuery: string
): UseGetAllDepartmentsReturn => {
  const token = useUserStore((state) => state.token);
  const departmentService = new DepartmentService(token);

  const { data, isLoading } = useQuery({
    queryKey: [DEPARTMENTS_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => departmentService.fetchAll(page, pageSize, searchKey, debouncedSearchQuery),
    enabled: !!token,
  });

  return {
    departments: data?.data?.departments || [],
    metadata: data?.data?.metadata || initialMetadata,
    totalDepartments: data?.data?.totalCount || 0,
    isDepartmentsDataLoading: isLoading,
  };
};

export const useGetDepartmentByID = (
  departmentID: number,
  resetInputs?: (data: IDepartmentCredentials) => void
): UseGetDepartmentnByIDReturn => {
  const token = useUserStore((state) => state.token);
  const departmentService = new DepartmentService(token);

  const { data, isLoading } = useQuery({
    queryKey: [DEPARTMENT_DETAILS_QUERY_KEY, departmentID],
    queryFn: () => departmentService.fetchByID(departmentID),
    enabled: !!departmentID && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetInputs?.(data.data);
    }
  }, [data, resetInputs]);

  return {
    department: data?.data,
    isDepartmentDataLoading: isLoading,
  };
};

export const useGetDepartmentsList = (): UseGetDepartmentsListReturn => {
  const token = useUserStore((state) => state.token);
  const departmentService = new DepartmentService(token);

  const { data, isLoading } = useQuery({
    queryKey: [DEPARTMENTS_LIST_QUERY_KEY],
    queryFn: () => departmentService.fetchList(),
    enabled: !!token,
  });

  return {
    departmentsList: data ?? [],
    isDepartmentsLoading: isLoading,
  };
};

export const useCreateDepartment = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const departmentService = new DepartmentService(token);

  return useMutation({
    mutationFn: (departmentData: IDepartmentCredentials) => departmentService.create(departmentData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });

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

export const useUpdateDepartment = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const departmentService = new DepartmentService(token);

  return useMutation({
    mutationFn: (departmentData: IDepartmentCredentials) => departmentService.update(departmentData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });

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

export const useDeleteDepartment = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const departmentService = new DepartmentService(token);

  return useMutation({
    mutationFn: (departmentID: number) => departmentService.delete(departmentID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });

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

export const useUpdateUserDepartments = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const departmentService = new DepartmentService(token);

  return useMutation({
    mutationFn: ({ userID, departments }: { userID: string; departments: number[] }) => {
      return departmentService.updateUserDepartments(userID, departments);
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
