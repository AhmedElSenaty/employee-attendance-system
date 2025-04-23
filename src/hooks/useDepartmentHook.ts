import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IDepartmentCredentials, IErrorResponse, initialMetadata, UseGetAllDepartmentsReturn, UseGetDepartmentnByIDReturn } from "../interfaces";
import { AxiosError } from "axios";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { useSelector } from "react-redux";
import { RootState } from "../context/store";
import { createDepartment, deleteDepartmentByID, fetchDepartmentByID, fetchAllDepartments, fetchDepartmentsList, updateDepartment, updateUserDepartments } from "../services/admin";
import { selectToken } from "../context/slices/userSlice";

const DEPARTMENTS_QUERY_KEY = "departments";
const DEPARTMENTS_LSIT_QUERY_KEY = "departmentsList";
const DEPARTMENTS_DETAILS_QUERY_KEY = "departmentDetails";

const useGetAllDepartments = (
  page: number, 
  pageSize: number, 
  searchKey: string, 
  debouncedSearchQuery: string
): UseGetAllDepartmentsReturn => {
  const token = useSelector(selectToken);
  const { data, isLoading } = useQuery({
    queryKey: [DEPARTMENTS_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => fetchAllDepartments(page, pageSize, searchKey, debouncedSearchQuery, token),
    enabled: !! token,
  });
  return {
    departments: data?.data.departments || [], 
    totalDepartments: data?.data.totalCount || 0, 
    metadata: data?.data.metadata || initialMetadata,
    isDepartmentsDataLoading: isLoading 
  };
};


const useGetDepartmentByID = (
  departmentID: number, 
  resetInputs?: (data: IDepartmentCredentials) => void
): UseGetDepartmentnByIDReturn => {
  const token = useSelector(selectToken);
  const { data, isLoading } = useQuery({
    queryKey: [DEPARTMENTS_DETAILS_QUERY_KEY, departmentID],
    queryFn: () => fetchDepartmentByID(departmentID, token),
    enabled: !!departmentID && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetInputs?.(data.data);
    }
  }, [data, resetInputs]);

  return { department: data?.data, isDepartmentDataLoading: isLoading };
};

const useGetDepartmentsList = () => {
  const token = useSelector(selectToken);
  const { data, isLoading } = useQuery({
    queryKey: [DEPARTMENTS_LSIT_QUERY_KEY],
    queryFn: () => fetchDepartmentsList(token),
    enabled: !!token,
  });
  return { departmentsList: data ?? [], isDepartmentsLoading: isLoading };
};

const useManageDepartments = () => {
  const token = useSelector(selectToken);
  const { language } = useSelector((state: RootState) => state.language);
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (departmentData: IDepartmentCredentials) => createDepartment(departmentData, token),
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

  const updateMutation = useMutation({
    mutationFn: (departmentData: IDepartmentCredentials) => updateDepartment(departmentData, token),
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

  const deleteMutation = useMutation({
    mutationFn: (departmentID: number) => deleteDepartmentByID(departmentID, token),
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

  const updateUserDepartmentsMutation = useMutation({
    mutationFn: ({ userID, departments }: { userID: string; departments: number[] }) => {
      const data = {
        departmentsIds: departments,
        userId: userID
      }
      return updateUserDepartments(data, token);
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


  return {
    addDepartment: addMutation.mutate,
    isAdding: addMutation.isPending,

    updateDepartment: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    
    deleteDepartment: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    
    updateUserDepartments: updateUserDepartmentsMutation.mutate,
    isUserDepartmentsUpdating: updateUserDepartmentsMutation.isPending
  };
};


export {
  useGetAllDepartments,
  useGetDepartmentsList,
  useGetDepartmentByID,
  useManageDepartments
};
