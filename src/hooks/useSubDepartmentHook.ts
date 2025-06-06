import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ISubDepartmentCredentials, IErrorResponse, initialMetadata, ISubDepartmentData, UseGetAllSubDepartmentsReturn, UseGetSubDepartmentnByIDReturn } from "../interfaces";
import { AxiosError } from "axios";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { useSelector } from "react-redux";
import { createSubDepartment, deleteSubDepartmentByID, fetchSubDepartmentByID, fetchAllSubDepartments, updateSubDepartment, fetchDepartmentSubDepartments, fetchSubDepartmentsList } from "../services/admin/";
import { selectToken } from "../context/slices/userSlice";
import { useLanguageStore } from "../store/language.store";

const SUB_DEPARTMENTS_QUERY_KEY = "subDepartments";
const SUB_DEPARTMENTS_LIST_QUERY_KEY = "subDepartmentsList";
const SUB_DEPARTMENT_DETAILS_QUERY_KEY = "subDepartmentDetails";

const useGetAllSubDepartments = (
  page: number, 
  pageSize: number, 
  searchKey: string, 
  debouncedSearchQuery: string
): UseGetAllSubDepartmentsReturn => {
  const token = useSelector(selectToken);
  const { data, isLoading } = useQuery({
    queryKey: [SUB_DEPARTMENTS_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => fetchAllSubDepartments(page, pageSize, searchKey, debouncedSearchQuery, token),
    enabled: !!token
  });

  return { 
    subDepartments: data?.data.subDepartments || [], 
    totalSubDepartments: data?.data.totalCount || 0, 
    metadata: data?.data.metadata || initialMetadata, 
    isSubDepartmentsDataLoading: isLoading 
  };
};


const useGetSubDepartmentByID = (
  subDepartmentID: number, 
  resetInputs?: (data: ISubDepartmentCredentials) => void
): UseGetSubDepartmentnByIDReturn => {
    const token = useSelector(selectToken);
  const { data, isLoading } = useQuery({
    queryKey: [SUB_DEPARTMENT_DETAILS_QUERY_KEY, subDepartmentID],
    queryFn: () => fetchSubDepartmentByID(subDepartmentID, token),
    enabled: !!subDepartmentID && !!token,
  });


  const subDepartmentData = data?.data as ISubDepartmentData;
  useEffect(() => {
    if (subDepartmentData && resetInputs) {
      resetInputs({ 
        id: subDepartmentData.subDepartmentId,
        name: subDepartmentData.name,
        entityId: subDepartmentData.entityId,
        departmentID: subDepartmentData.departmentId,
        description: subDepartmentData.description,
      });
    }
  }, [subDepartmentData, resetInputs]);

  return { subDepartment: subDepartmentData, isSubDepartmentDataLoading: isLoading };
};

const useDepartmentSubDepartmentsList = (departmentID: number) => {
  const token = useSelector(selectToken);
  const { data, isLoading } = useQuery({
    queryKey: [SUB_DEPARTMENTS_LIST_QUERY_KEY, departmentID],
    queryFn: () => fetchDepartmentSubDepartments(departmentID, token),
    enabled: !!token && !!departmentID,
  });
  return { subDepartmentsList: data ?? [], isSubDepartmentsLoading: isLoading };
};

const useGetSubDepartmentsList = () => {
  const token = useSelector(selectToken);
  const { data, isLoading } = useQuery({
    queryKey: [SUB_DEPARTMENTS_LIST_QUERY_KEY],
    queryFn: () => fetchSubDepartmentsList(token),
    enabled: !!token,
  });
  return { subDepartmentsList: data ?? [], isLoading };
};

const useManageSubDepartments = () => {
    const token = useSelector(selectToken);
    const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (subDepartmentData: ISubDepartmentCredentials) => createSubDepartment(subDepartmentData, token),
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

  const updateMutation = useMutation({
    mutationFn: (subDepartmentData: ISubDepartmentCredentials) => updateSubDepartment(subDepartmentData, token),
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

  const deleteMutation = useMutation({
    mutationFn: (subDepartmentID: number) => deleteSubDepartmentByID(subDepartmentID, token),
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

  return {
    addSubDepartment: addMutation.mutate,
    isAdding: addMutation.isPending,
    
    updateSubDepartment: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    
    deleteSubDepartment: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};


export {
  useGetAllSubDepartments,
  useGetSubDepartmentByID,
  useGetSubDepartmentsList,
  useDepartmentSubDepartmentsList,
  useManageSubDepartments
};
