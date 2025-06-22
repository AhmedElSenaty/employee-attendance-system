import { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  IErrorResponse,
  initialMetadata,
} from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { useLanguageStore, useUserStore } from "../store/";
import { SubDepartmentService } from "../services";
import { QueryKeys } from "../constants";
import { SubDepartmentFormValues } from "../validation";

export const useSubDepartmentService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new SubDepartmentService(token);
  }, [token]);

  return service;
};

export const useGetSubDepartments = (
  page?: number,
  pageSize?: number,
  searchKey?: string,
  searchQuery?: string
) => {
  const token = useUserStore((state) => state.token);
  const service = useSubDepartmentService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.SubDepartments.All,
      page, 
      pageSize, 
      `${searchKey && searchQuery ? [searchKey, searchQuery] : ""}`
    ],
    queryFn: () => service.fetchAll(page, pageSize, searchKey, searchQuery),
    enabled: !!token,
  });

  return {
    subDepartments: data?.data?.data?.subDepartments || [],
    metadata: data?.data?.data?.metadata || initialMetadata,
    count: data?.data?.data?.totalCount || 0,
    isLoading,
  };
};

export const useGetSubDepartmentByID = (
  subDepartmentID: number,
  resetInputs: (data: SubDepartmentFormValues) => void
) => {
  const token = useUserStore((state) => state.token);
  const service = useSubDepartmentService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.SubDepartments.Details, subDepartmentID],
    queryFn: () => service.fetchByID(subDepartmentID),
    enabled: !!subDepartmentID && !!token,
  });

  useEffect(() => {
    if (data?.data?.data) {
      resetInputs({
        id: data?.data?.data.subDepartmentId,
        name: data?.data?.data.name,
        entityId: data?.data?.data.entityId,
        departmentID: data?.data?.data.departmentId,
        description: data?.data?.data.description,
      });
    }
  }, [data, resetInputs]);

  return {
    subDepartment: data?.data?.data,
    isLoading,
  };
};

export const useGetSubDepartmentsList = () => {
  const token = useUserStore((state) => state.token);
  const service = useSubDepartmentService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.SubDepartments.List],
    queryFn: () => service.fetchList(),
    enabled: !!token,
  });

  return {
    subDepartmentsList: data?.data?.data ?? [],
    isLoading,
  };
};

export const useGetDepartmentSubDepartments = (departmentID: number) => {
  const token = useUserStore((state) => state.token);
  const service = useSubDepartmentService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.SubDepartments.List, departmentID],
    queryFn: () => service.fetchDepartmentSubDepartments(departmentID),
    enabled: !!token && !!departmentID,
  });

  return {
    subDepartmentsList: data?.data?.data ?? [],
    isLoading,
  };
};

export const useCreateSubDepartment = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const service = useSubDepartmentService();

  return useMutation({
    mutationFn: (data: SubDepartmentFormValues) => service.create(data),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SubDepartments.All] });

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

export const useUpdateSubDepartment = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const service = useSubDepartmentService();

  return useMutation({
    mutationFn: (data: SubDepartmentFormValues) => service.update(data),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SubDepartments.All] });

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

export const useDeleteSubDepartment = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const service = useSubDepartmentService();

  return useMutation({
    mutationFn: (subDepartmentID: number) => service.delete(subDepartmentID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SubDepartments.All] });

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
