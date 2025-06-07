import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  ISubDepartmentCredentials,
  IErrorResponse,
  ISubDepartmentData,
  UseGetAllSubDepartmentsReturn,
  UseGetSubDepartmentnByIDReturn,
  initialMetadata,
  UseGetSubDepartmentsListReturn,
} from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { SubDepartmentService } from "../services";

export const SUB_DEPARTMENTS_QUERY_KEY = "subDepartments";
export const SUB_DEPARTMENT_DETAILS_QUERY_KEY = "subDepartmentDetails";
export const SUB_DEPARTMENTS_LIST_QUERY_KEY = "subDepartmentsList";

export const useGetSubDepartments = (
  page: number,
  pageSize: number,
  searchKey: string,
  debouncedSearchQuery: string
): UseGetAllSubDepartmentsReturn => {
  const token = useUserStore((state) => state.token);
  const service = new SubDepartmentService(token);

  const { data, isLoading } = useQuery({
    queryKey: [SUB_DEPARTMENTS_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => service.fetchAll(page, pageSize, searchKey, debouncedSearchQuery),
    enabled: !!token,
  });

  return {
    subDepartments: data?.data?.subDepartments || [],
    metadata: data?.data?.metadata || initialMetadata,
    totalSubDepartments: data?.data?.totalCount || 0,
    isSubDepartmentsDataLoading: isLoading,
  };
};

export const useGetSubDepartmentByID = (
  subDepartmentID: number,
  resetInputs?: (data: ISubDepartmentCredentials) => void
): UseGetSubDepartmentnByIDReturn => {
  const token = useUserStore((state) => state.token);
  const service = new SubDepartmentService(token);

  const { data, isLoading } = useQuery({
    queryKey: [SUB_DEPARTMENT_DETAILS_QUERY_KEY, subDepartmentID],
    queryFn: () => service.fetchByID(subDepartmentID),
    enabled: !!subDepartmentID && !!token,
  });

  useEffect(() => {
    if (data?.data && resetInputs) {
      const sub = data.data as ISubDepartmentData;
      resetInputs({
        id: sub.subDepartmentId,
        name: sub.name,
        entityId: sub.entityId,
        departmentID: sub.departmentId,
        description: sub.description,
      });
    }
  }, [data, resetInputs]);

  return {
    subDepartment: data?.data,
    isSubDepartmentDataLoading: isLoading,
  };
};

export const useGetSubDepartmentsList = (): UseGetSubDepartmentsListReturn => {
  const token = useUserStore((state) => state.token);
  const service = new SubDepartmentService(token);

  const { data, isLoading } = useQuery({
    queryKey: [SUB_DEPARTMENTS_LIST_QUERY_KEY],
    queryFn: () => service.fetchList(),
    enabled: !!token,
  });

  return {
    subDepartmentsList: data ?? [],
    isSubDepartmentsLoading: isLoading,
  };
};

export const useGetDepartmentSubDepartments = (departmentID: number): UseGetSubDepartmentsListReturn => {
  const token = useUserStore((state) => state.token);
  const service = new SubDepartmentService(token);

  const { data, isLoading } = useQuery({
    queryKey: [SUB_DEPARTMENTS_LIST_QUERY_KEY, departmentID],
    queryFn: () => service.fetchDepartmentSubDepartments(departmentID),
    enabled: !!token && !!departmentID,
  });

  return {
    subDepartmentsList: data ?? [],
    isSubDepartmentsLoading: isLoading,
  };
};

export const useCreateSubDepartment = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const service = new SubDepartmentService(token);

  return useMutation({
    mutationFn: (data: ISubDepartmentCredentials) => service.create(data),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [SUB_DEPARTMENTS_QUERY_KEY] });

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
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const service = new SubDepartmentService(token);

  return useMutation({
    mutationFn: (data: ISubDepartmentCredentials) => service.update(data),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [SUB_DEPARTMENTS_QUERY_KEY] });

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
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const service = new SubDepartmentService(token);

  return useMutation({
    mutationFn: (subDepartmentID: number) => service.delete(subDepartmentID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [SUB_DEPARTMENTS_QUERY_KEY] });

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
