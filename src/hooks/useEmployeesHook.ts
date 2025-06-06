import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectToken } from "../context/slices/userSlice";
import { createEmployee, deleteEmployee, fetchAllEmployees, fetchEmployeeByID, fetchEmployeesCount, fetchEmployeesList, updateEmployee } from "../services/admin/";
import { IEmployeeCredentials, IErrorResponse, initialMetadata, UseGetAllEmployeesReturn, UseGetEmployeeByIDReturn, UseGetEmployeesCountReturn, UseGetEmployeesListReturn } from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useLanguageStore } from "../store/language.store";

const EMPLOYEES_QUERY_KEY = "employees";
const EMPLOYEE_DETAILS_QUERY_KEY = "employeeDetails";
const EMPLOYEES_COUNT_QUERRY_KEY = "employeesCount";
const EMPLOYEES_LIST_QUERY_KEY = "employeesList";


const useGetAllEmployees = ( 
  page: number, 
  pageSize: number, 
  searchKey: string, 
  debouncedSearchQuery: string
): UseGetAllEmployeesReturn => {
  const token = useSelector(selectToken);

  const { data, isLoading } = useQuery({
    queryKey: [EMPLOYEES_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => fetchAllEmployees(page, pageSize, searchKey, debouncedSearchQuery, token),
    enabled: !!token,
  });

  return { 
    employees: data?.data?.employees || [], 
    metadata: data?.data?.metadata || initialMetadata, 
    isEmployeesDataLoading: isLoading 
  };
};

const useGetEmployeeByID = (
  employeeID: string, 
  resetInputs?: (data: IEmployeeCredentials) => void
): UseGetEmployeeByIDReturn => {
  const token = useSelector(selectToken); // Get token from Redux
  const { data, isLoading } = useQuery({
    queryKey: [EMPLOYEE_DETAILS_QUERY_KEY, employeeID],
    queryFn: () => fetchEmployeeByID(employeeID, token),
    enabled: !!employeeID && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetInputs?.({ 
        username: data?.data?.username, 
        email: data?.data?.email,
        fullName: data?.data?.fullName,
        hiringDate: data?.data?.hiringDate,
        oldId: data?.data?.oldId,
        ssn: data?.data?.ssn,
        phoneNumber: data?.data?.phoneNumber,
        subDepartmentId: data?.data?.subDepartmentId,
        delegateId: data?.data?.delegateId,
      });
    }
  }, [data, resetInputs]);
  return { employee: data?.data, isEmployeeDataLoading: isLoading };
};

const useGetEmployeesCount = (): UseGetEmployeesCountReturn => {
  const token = useSelector(selectToken);
  const { data, isLoading } = useQuery({
    queryKey: [EMPLOYEES_COUNT_QUERRY_KEY],
    queryFn: () => fetchEmployeesCount(token),
    enabled: !!token,
  });
  
  return { 
    totalCount: data?.data?.totalCount || 0, 
    lockedCount: data?.data?.lockedCount || 0, 
    blockedCount: data?.data?.blockedCount || 0,
    activatedCount: data?.data?.activatedCount || 0,
    deactivatedCount: data?.data?.deactivatedCount || 0,
    isEmployeesCountLoading: isLoading
  };
};

const useGetEmployeesList = (): UseGetEmployeesListReturn => {
  const token = useSelector(selectToken); // Get token from Redux
  const { data, isLoading } = useQuery({
    queryKey: [EMPLOYEES_LIST_QUERY_KEY],
    queryFn: () => fetchEmployeesList(token),
    enabled: !!token,
  });
  return { employeesList: data ?? [], isEmployeesListLoading: isLoading };
};

const useManageEmployees = () => {
  const token = useSelector(selectToken); // Get token from Redux
  const { language } = useLanguageStore();
  
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (employeeData: IEmployeeCredentials) => createEmployee(employeeData, token),
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

  const updateMutation = useMutation({
    mutationFn: (employeeData: IEmployeeCredentials) => updateEmployee(employeeData, token),
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

  const deleteMutation = useMutation({
    mutationFn: (employeeID: string) => deleteEmployee(employeeID, token),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_QUERY_KEY] });
      if (response.status === 200) {
        const message = getTranslatedMessage(response.data.message ?? "", language);
        showToast("success", message);
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError<IErrorResponse>;
      handleApiError(axiosError, language);
    },
  });

  return {
    addEmployeeAndGetUserID: addMutation.mutateAsync,
    isAdding: addMutation.isPending,

    deleteEmployee: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,

    updateEmployee: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};


export {
  useGetAllEmployees,
  useGetEmployeeByID,
  useGetEmployeesCount,
  useGetEmployeesList,
  useManageEmployees
};
