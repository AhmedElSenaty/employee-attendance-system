import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  IAttendanceCredentials,
  IErrorResponse,
  initialMetadata,
  UseAttendanceDashboardResponse,
  UseGetAllAttendanceReturn,
  UseGetAllAttendanceSummaryReturn,
  UseGetAttendanceCalenderByEmployeeIDReturn,
  UseGetDetailedAttendanceReturn,
  UseGetLatestAttendance,
} from "../interfaces";
import {
  appendSecondsToTime,
  getTranslatedMessage,
  handleApiError,
  showToast,
} from "../utils";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { AttendanceService } from "../services";

// Query keys
export const ATTENDANCE_QUERY_KEY = "attendances";
export const ATTENDANCE_DETAILS_QUERY_KEY = "attendanceDetails";
export const ATTENDANCE_CALENDAR_QUERY_KEY = "attendanceCalendar";
export const ATTENDANCE_SUMMARY_QUERY_KEY = "attendanceSummary";
export const ATTENDANCE_OVERVIEW_QUERY_KEY = "attendanceOverview";
export const LATEST_ATTENDANCE_QUERY_KEY = "latestAttendance";
export const DEPARTMENT_ATTENDANCE_QUERY_KEY = "departmentAttendanceOverview";

// Get all attendance records
export const useGetAttendances = (
  page: number,
  pageSize: number,
  searchKey: string,
  debouncedSearchQuery: string,
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  status: string,
  departmentId: number,
  subDepartmentId: number
): UseGetAllAttendanceReturn => {
  const token = useUserStore((state) => state.token);
  const service = new AttendanceService(token);

  const { data, isLoading } = useQuery({
    queryKey: [
      ATTENDANCE_QUERY_KEY,
      page,
      pageSize,
      searchKey,
      debouncedSearchQuery,
      startDate,
      endDate,
      startTime,
      endTime,
      status,
      departmentId,
      subDepartmentId,
    ],
    queryFn: () =>
      service.fetchAll(
        page,
        pageSize,
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
        startTime,
        endTime,
        status,
        departmentId,
        subDepartmentId,
      ),
    enabled: !!token,
  });

  return {
    attendancesData: data?.data.attendances || [],
    totalAttendances: data?.data.totalCount || 0,
    metadata: data?.data.metadata || initialMetadata,
    isAttendancesDataLoading: isLoading,
  };
};

// Get attendance summary
export const useGetAttendanceSummary = (
  page: number,
  pageSize: number,
  searchKey: string,
  debouncedSearchQuery: string,
  startDate: string,
  endDate: string
): UseGetAllAttendanceSummaryReturn => {
  const token = useUserStore((state) => state.token);
  const service = new AttendanceService(token);

  const { data, isLoading } = useQuery({
    queryKey: [
      ATTENDANCE_SUMMARY_QUERY_KEY,
      page,
      pageSize,
      searchKey,
      debouncedSearchQuery,
      startDate,
      endDate,
    ],
    queryFn: () =>
      service.fetchSummary(
        page,
        pageSize,
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
      ),
    enabled: !!token,
  });

  return {
    attendanceSummary: data?.data.attendanceSummary || [],
    totalAttendanceSummary: data?.data.totalCount || 0,
    metadata: data?.data.metadata || initialMetadata,
    isAttendanceSummaryLoading: isLoading,
  };
};

// Get calendar data by employee ID
export const useGetAttendanceCalendar = (
  employeeID: string,
  startDate: string,
  endDate: string
): UseGetAttendanceCalenderByEmployeeIDReturn => {
  const token = useUserStore((state) => state.token);
  const service = new AttendanceService(token);

  const { data, isLoading } = useQuery({
    queryKey: [ATTENDANCE_CALENDAR_QUERY_KEY, employeeID, startDate, endDate],
    queryFn: () => service.fetchCalendar(employeeID, startDate, endDate),
    enabled: !!token && !!employeeID,
  });

  return {
    calenderDays: data?.data,
    isAttendanceCalenderLoading: isLoading,
  };
};

// Get detailed attendance
export const useGetAttendanceDetails = (
  attendanceID: number,
  resetInputs?: (data: IAttendanceCredentials) => void
): UseGetDetailedAttendanceReturn => {
  const token = useUserStore((state) => state.token);
  const service = new AttendanceService(token);

  const { data, isLoading } = useQuery({
    queryKey: [ATTENDANCE_DETAILS_QUERY_KEY, attendanceID],
    queryFn: () => service.fetchByID(attendanceID),
    enabled: !!attendanceID && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetInputs?.(data.data);
    }
  }, [data, resetInputs]);

  return {
    detailedAttendance: data?.data,
    isDetailedAttendanceLoading: isLoading,
  };
};

// Get attendance dashboard overview
export const useGetAttendanceOverview = (): UseAttendanceDashboardResponse => {
  const token = useUserStore((state) => state.token);
  const service = new AttendanceService(token);

  const { data, isLoading } = useQuery({
    queryKey: [ATTENDANCE_OVERVIEW_QUERY_KEY],
    queryFn: () => service.fetchOverview(),
    enabled: !!token,
  });

  return {
    attendanceOverviewDtos: data?.data.attendanceOverviewDtos,
    dailyAttendanceDto: data?.data.dailyAttendanceDto,
    isAttendanceOverviewLoading: isLoading,
  };
};

// Get latest attendance
export const useGetLatestAttendance = (): UseGetLatestAttendance => {
  const token = useUserStore((state) => state.token);
  const service = new AttendanceService(token);

  const { data, isLoading } = useQuery({
    queryKey: [LATEST_ATTENDANCE_QUERY_KEY],
    queryFn: () => service.fetchLatest(),
    enabled: !!token,
  });

  return {
    latestAttendance: data?.data?.latestAttendance || [],
    islatestAttendanceLoading: isLoading,
  };
};

// Get department attendance overview
export const useGetDepartmentAttendanceOverview = (
  startDate: string,
  endDate: string,
  departmentID: number
) => {
  const token = useUserStore((state) => state.token);
  const service = new AttendanceService(token);

  const { data, isLoading } = useQuery({
    queryKey: [DEPARTMENT_ATTENDANCE_QUERY_KEY, startDate, endDate, departmentID],
    queryFn: () =>
      service.fetchDepartmentOverview(startDate, endDate, departmentID),
    enabled: !!token,
  });

  return {
    departmentAttendanceOverview: data?.data,
    isDepartmentAttendanceOverviewLoading: isLoading,
  };
};

// Create Attendance
export const useCreateAttendance = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const attendanceService = new AttendanceService(token);

  return useMutation({
    mutationFn: (attendanceData: IAttendanceCredentials) => {
      const formatted = {
        ...attendanceData,
        attendanceTime: appendSecondsToTime(attendanceData.attendanceTime || ""),
      };
      return attendanceService.create(formatted);
    },
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEY] });
      if (status === 201) {
        showToast("success", getTranslatedMessage(data.message ?? "", language));
      }
    },
    onError: (error) => {
      handleApiError(error as AxiosError<IErrorResponse>, language);
    },
  });
};

// Update Attendance
export const useUpdateAttendance = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const attendanceService = new AttendanceService(token);

  return useMutation({
    mutationFn: (attendanceData: IAttendanceCredentials) => {
      const formatted = {
        ...attendanceData,
        attendanceTime: appendSecondsToTime(attendanceData.attendanceTime || ""),
      };
      return attendanceService.update(formatted);
    },
    onSuccess: ({ status, data }, variables) => {
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [ATTENDANCE_DETAILS_QUERY_KEY, variables.id],
      });
      if (status === 200) {
        showToast("success", getTranslatedMessage(data.message ?? "", language));
      }
    },
    onError: (error) => {
      handleApiError(error as AxiosError<IErrorResponse>, language);
    },
  });
};

// Delete Attendance
export const useDeleteAttendance = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const attendanceService = new AttendanceService(token);

  return useMutation({
    mutationFn: (attendanceID: number) => attendanceService.delete(attendanceID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEY] });
      if (status === 200) {
        showToast("success", getTranslatedMessage(data.message ?? "", language));
      }
    },
    onError: (error) => {
      handleApiError(error as AxiosError<IErrorResponse>, language);
    },
  });
};
