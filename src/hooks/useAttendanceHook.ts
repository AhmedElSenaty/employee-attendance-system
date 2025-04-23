import { useSelector } from "react-redux";
import { selectToken } from "../context/slices/userSlice";
import { IAttendanceCredentials, IErrorResponse, initialMetadata, UseAttendanceDashboardResponse, UseGetAllAttendanceReturn, UseGetAllAttendanceSummaryReturn, UseGetAttendanceCalenderByEmployeeIDReturn, UseGetDetailedAttendanceReturn, UseGetLatestAttendance } from "../interfaces";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAttendance, deleteAttendanceByID, fetchAttendanceCalender, fetchAllAttendances, fetchDetailedAttendanceByID, updateAttendance, fetchAllAttendanceSummary, fetchAttendanceOverview, fetchLatestAttendance, fetchDepartmentAttendanceOverview } from "../services/admin/";
import { RootState } from "../context/store";
import { appendSecondsToTime, getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";

const ATTENDANCE_QUERY_KEY = "attendances"
const ATTENDANCE_DETAILED_QUERY_KEY = "detailedAttendance"
const ATTENDANCE_CALENDER_QUERY_KEY = "attendanceCalender"
const ATTENDANCE_SUMMARY_QUERY_KEY = "attendanceSummary"
const ATTENDANCE_OVERVIEW_QUERY_KEY = "attendanceOverview"
const LATEST_ATTENDANCE_QUERY_KEY = "latestAttendanceOverview"
const DEPARTMENT_ATTENDANCE_QUERY_KEY = "departmentAttendanceOverview"

const useGetAllAttendanceData = (
  page: number, pageSize: number, searchKey: string,
  debouncedSearchQuery: string, startDate: string, endDate: string,
  startTime: string, endTime: string, status: string, 
  searchByDepartmentId: number, searchBySubDeptartmentId: number
): UseGetAllAttendanceReturn => {
  const token = useSelector(selectToken); // Get token from Redux
  const { data, isLoading } = useQuery({
    queryKey: [ATTENDANCE_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery, startDate, endDate, startTime, endTime, status, searchByDepartmentId, searchBySubDeptartmentId],
    queryFn: () => fetchAllAttendances(page, pageSize, searchKey, debouncedSearchQuery, startDate, endDate, startTime, endTime, status, searchByDepartmentId, searchBySubDeptartmentId, token),
    enabled: !!token
  });
  return { 
    attendancesData: data?.data.attendances || [], 
    totalAttendances: data?.data.totalCount || 0, 
    metadata: data?.data.metadata || initialMetadata,
    isAttendancesDataLoading: isLoading 
  };
};

const useGetAttendanceOverview = (): UseAttendanceDashboardResponse => {
  const token = useSelector(selectToken); // Get token from Redux
  const { data, isLoading } = useQuery({
    queryKey: [ATTENDANCE_OVERVIEW_QUERY_KEY],
    queryFn: () => fetchAttendanceOverview(token),
    enabled: !!token
  });
  
  return { 
    attendanceOverviewDtos: data?.data.attendanceOverviewDtos, 
    dailyAttendanceDto: data?.data.dailyAttendanceDto, 
    isAttendanceOverviewLoading: isLoading 
  };
};

const useGetLatestAttendance = (): UseGetLatestAttendance => {
  const token = useSelector(selectToken); // Get token from Redux
  const { data, isLoading } = useQuery({
    queryKey: [LATEST_ATTENDANCE_QUERY_KEY],
    queryFn: () => fetchLatestAttendance(token),
    enabled: !!token
  });
  
  return { 
    latestAttendance: data?.data?.latestAttendance || [], 
    islatestAttendanceLoading: isLoading 
  };
};

const useGetDepartmentAttendanceOverview = (startDate: string, endDate: string, departmentID: number) => {
  const token = useSelector(selectToken); // Get token from Redux
  const { data, isLoading } = useQuery({
    queryKey: [DEPARTMENT_ATTENDANCE_QUERY_KEY, startDate, endDate, departmentID],
    queryFn: () => fetchDepartmentAttendanceOverview(startDate, endDate, departmentID, token),
    enabled: !!token
  });
  
  return { 
    departmentAttendanceOverview: data?.data, 
    isDepartmentAttendanceOverviewLoading: isLoading 
  };
};

const useGetAllAttendancSummary = (
  page: number, pageSize: number, searchKey: string,
  debouncedSearchQuery: string, startDate: string, 
  endDate: string
): UseGetAllAttendanceSummaryReturn => {
  const token = useSelector(selectToken);
  const { data, isLoading } = useQuery({
    queryKey: [ATTENDANCE_SUMMARY_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery, startDate, endDate],
    queryFn: () => fetchAllAttendanceSummary(page, pageSize, searchKey, debouncedSearchQuery, startDate, endDate, token),
    enabled: !!token
  });
  return { 
    attendanceSummary: data?.data.attendanceSummary || [], 
    totalAttendanceSummary: data?.data.totalCount || 0, 
    metadata: data?.data.metadata || initialMetadata, 
    isAttendanceSummaryLoading: isLoading,
  };
};

const useGetAttendanceCalenderByEmployeeID = (
  employeeID: string, startDate: string, endDate: string
): UseGetAttendanceCalenderByEmployeeIDReturn => {
  const token = useSelector(selectToken); // Get token from Redux
  const { data, isLoading } = useQuery({
    queryKey: [ATTENDANCE_CALENDER_QUERY_KEY, employeeID, startDate, endDate],
    queryFn: () => fetchAttendanceCalender(employeeID, startDate, endDate, token),
    enabled: !!token && !!employeeID
  });
  
  return { calenderDays: data?.data, isAttendanceCalenderLoading: isLoading };
};

const useGetDetailedAttendance = (attendanceID: number, resetInputs?: (data: IAttendanceCredentials) => void
): UseGetDetailedAttendanceReturn => {
  const token = useSelector(selectToken); // Get token from Redux
  const { data, isLoading } = useQuery({
    queryKey: [ATTENDANCE_DETAILED_QUERY_KEY, attendanceID],
    queryFn: () => fetchDetailedAttendanceByID(attendanceID, token),
    enabled: !!attendanceID && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetInputs?.(data.data);
    }
  }, [data, resetInputs]);

  return { detailedAttendance: data?.data, isDetailedAttendanceLoading: isLoading };
};

const useManageAttendance = () => {
  const token = useSelector(selectToken); // Get token from Redux
  const { language } = useSelector((state: RootState) => state.language);
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (attendanceData: IAttendanceCredentials) => {
      const formattedAttendanceData = {
        ...attendanceData,
        attendanceTime: appendSecondsToTime(attendanceData.attendanceTime || ""),
      };
      return createAttendance(formattedAttendanceData, token);
    },
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEY] });

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
    mutationFn: (attendanceData: IAttendanceCredentials) => {
      const formattedAttendanceData = {
        ...attendanceData,
        attendanceTime: appendSecondsToTime(attendanceData.attendanceTime || ""),
      };
      
      return updateAttendance(formattedAttendanceData, token)
    },
    onSuccess: ({ status, data }, attendanceData) => {
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_DETAILED_QUERY_KEY, attendanceData.id] });
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
    mutationFn: (attendanceID: number) => deleteAttendanceByID(attendanceID, token),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEY] });

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
    addAttendance: addMutation.mutate,
    isAdding: addMutation.isPending,

    updateAttendance: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    
    deleteAttendance: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};

export {
  useGetAllAttendanceData,
  useGetAllAttendancSummary,
  useGetAttendanceCalenderByEmployeeID,
  useGetDetailedAttendance,
  useManageAttendance,
  useGetAttendanceOverview,
  useGetLatestAttendance,
  useGetDepartmentAttendanceOverview
};