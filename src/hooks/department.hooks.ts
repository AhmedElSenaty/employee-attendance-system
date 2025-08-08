import { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  DepartmentCredentials,
  IErrorResponse,
  initialMetadata,
} from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { useUserStore, useLanguageStore } from "../store/";
import { DepartmentService } from "../services";
import { QueryKeys } from "../constants";
import { DepartmentFormValues } from "../validation";

export const useDepartmentService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new DepartmentService(token);
  }, [token]);

  return service;
};

export const useGetDepartments = (
  page?: number,
  pageSize?: number,
  searchKey?: string,
  searchQuery?: string
) => {
  const token = useUserStore((state) => state.token);
  const departmentService = useDepartmentService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.Departments.All,
      page,
      pageSize,
      `${searchKey && searchQuery ? [searchKey, searchQuery] : ""}`,
    ],
    queryFn: () =>
      departmentService.fetchAll(page, pageSize, searchKey, searchQuery),
    enabled: !!token,
  });
  return {
    departments: data?.data?.data?.departments || [],
    metadata: data?.data?.data?.metadata || initialMetadata,
    count: data?.data?.data?.totalCount || 0,
    isLoading,
  };
};

export const useGetDepartmentByID = (
  departmentID: number,
  resetInputs?: (data: DepartmentFormValues) => void
) => {
  const token = useUserStore((state) => state.token);
  const departmentService = useDepartmentService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Departments.Details, departmentID],
    queryFn: () => departmentService.fetchByID(departmentID),
    enabled: !!departmentID && !!token,
  });

  useEffect(() => {
    if (data?.data?.data) {
      resetInputs?.(data.data.data);
    }
  }, [data, resetInputs]);

  return {
    department: data?.data?.data,
    isLoading,
  };
};

export const useGetDepartmentsList = () => {
  const token = useUserStore((state) => state.token);
  const departmentService = useDepartmentService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Departments.List],
    queryFn: () => departmentService.fetchList(),
    enabled: !!token,
  });

  return {
    departmentsList: data?.data?.data ?? [],
    isLoading,
  };
};

export const useCreateDepartment = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const departmentService = useDepartmentService();

  return useMutation({
    mutationFn: (departmentData: DepartmentCredentials) =>
      departmentService.create(departmentData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Departments.All] });

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
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const departmentService = useDepartmentService();

  return useMutation({
    mutationFn: (departmentData: DepartmentCredentials) =>
      departmentService.update(departmentData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Departments.All] });
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
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const departmentService = useDepartmentService();

  return useMutation({
    mutationFn: (departmentID: number) =>
      departmentService.delete(departmentID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Departments.All] });

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
  const { language } = useLanguageStore();
  const departmentService = useDepartmentService();

  return useMutation({
    mutationFn: ({
      userID,
      departments,
    }: {
      userID: string;
      departments: number[];
    }) => {
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
