import { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  IAttendanceCredentials,
  IErrorResponse,
  initialAttendanceEntry,
  initialMetadata,
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
import { QueryKeys } from "../constants";

export const useAttendanceService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new AttendanceService(token);
  }, [token]);

  return service;
};

// Get all attendance records
export const useGetAttendances = (
  page?: number,
  pageSize?: number,
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  startTime?: string,
  endTime?: string,
  status?: string,
  departmentId?: number,
  subDepartmentId?: number
) => {
  const token = useUserStore((state) => state.token);
  const service = useAttendanceService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.Attendance.All,
      page,
      pageSize,
      `${searchKey && debouncedSearchQuery ? [searchKey, debouncedSearchQuery] : ""}`, 
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
    attendancesData: data?.data?.data.attendances || [],
    totalAttendances: data?.data?.data.totalCount || 0,
    metadata: data?.data?.data.metadata || initialMetadata,
    isAttendancesDataLoading: isLoading,
  };
};

// Get attendance summary
export const useGetAttendanceSummary = (
  page?: number,
  pageSize?: number,
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string
) => {
  const token = useUserStore((state) => state.token);
  const service = useAttendanceService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.Attendance.Summary,
      page,
      pageSize,
      startDate,
      endDate,
      `${searchKey && debouncedSearchQuery ? [searchKey, debouncedSearchQuery] : ""}`, 
    ],
    queryFn: () =>
      service.fetchSummary(
        page,
        pageSize,
        startDate,
        endDate,
        searchKey,
        debouncedSearchQuery,
      ),
    enabled: !!token,
  });

  return {
    attendanceSummary: data?.data?.data.attendanceSummary || [],
    totalAttendanceSummary: data?.data?.data.totalCount || 0,
    metadata: data?.data?.data.metadata || initialMetadata,
    isAttendanceSummaryLoading: isLoading,
  };
};

// Get calendar data by employee ID
export const useGetAttendanceCalendar = (
  employeeID?: string,
  startDate?: string,
  endDate?: string
) => {
  const token = useUserStore((state) => state.token);
  const service = useAttendanceService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Attendance.Calendar, employeeID, startDate, endDate],
    queryFn: () => service.fetchCalendar(employeeID, startDate, endDate),
    enabled: !!token && !!employeeID,
  });

  return {
    calenderDays: data?.data?.data,
    isAttendanceCalenderLoading: isLoading,
  };
};

// Get detailed attendance
export const useGetAttendanceDetails = (
  attendanceID: number,
  resetInputs?: (data: IAttendanceCredentials) => void
) => {
  const token = useUserStore((state) => state.token);
  const service = useAttendanceService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Attendance.Details, attendanceID],
    queryFn: () => service.fetchByID(attendanceID),
    enabled: !!attendanceID && !!token,
  });

  useEffect(() => {
    if (data?.data?.data) {
      resetInputs?.(data.data.data);
    }
  }, [data, resetInputs]);

  return {
    detailedAttendance: data?.data?.data,
    isDetailedAttendanceLoading: isLoading,
  };
};

// Get attendance dashboard overview
export const useGetAttendanceOverview = () => {
  const token = useUserStore((state) => state.token);
  const service = useAttendanceService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Attendance.Overview],
    queryFn: () => service.fetchOverview(),
    enabled: !!token,
  });

  return {
    attendanceOverviewDtos: data?.data?.data.attendanceOverviewDtos,
    dailyAttendanceDto: data?.data?.data.dailyAttendanceDto,
    isAttendanceOverviewLoading: isLoading,
  };
};

// Get latest attendance
export const useGetLatestAttendance = () => {
  const token = useUserStore((state) => state.token);
  const service = useAttendanceService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Attendance.Latest],
    queryFn: () => service.fetchLatest(),
    enabled: !!token,
  });

  return {
    latestAttendance: data?.data?.data?.latestAttendance || [],
    islatestAttendanceLoading: isLoading,
  };
};

// Get department attendance overview
export const useGetDepartmentAttendanceOverview = (
  startDate?: string,
  endDate?: string,
  departmentID?: number
) => {
  const token = useUserStore((state) => state.token);
  const service = useAttendanceService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Attendance.DepartmentOverview, startDate, endDate, departmentID],
    queryFn: () =>
      service.fetchDepartmentOverview(startDate, endDate, departmentID),
    enabled: !!token,
  });

  return {
    departmentAttendanceOverview: data?.data?.data,
    isDepartmentAttendanceOverviewLoading: isLoading,
  };
};

// Create Attendance
export const useCreateAttendance = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const attendanceService = useAttendanceService();

  return useMutation({
    mutationFn: (attendanceData: IAttendanceCredentials) => {
      const formatted = {
        ...attendanceData,
        attendanceTime: appendSecondsToTime(attendanceData.attendanceTime || ""),
      };
      return attendanceService.create(formatted);
    },
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Attendance.All] });
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
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const attendanceService = useAttendanceService();

  return useMutation({
    mutationFn: (attendanceData: IAttendanceCredentials) => {
      const formatted = {
        ...attendanceData,
        attendanceTime: appendSecondsToTime(attendanceData.attendanceTime || ""),
      };
      return attendanceService.update(formatted);
    },
    onSuccess: ({ status, data }, attendanceData) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Attendance.All] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Attendance.Details, attendanceData.id],
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
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const attendanceService = useAttendanceService();

  return useMutation({
    mutationFn: (attendanceID: number) => attendanceService.delete(attendanceID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Attendance.All] });
      if (status === 200) {
        showToast("success", getTranslatedMessage(data.message ?? "", language));
      }
    },
    onError: (error) => {
      handleApiError(error as AxiosError<IErrorResponse>, language);
    },
  });
};

// Get all attendance records
export const useGetAttendanceWithVacations = (
  page?: number,
  pageSize?: number,
  searchKey?: string,
  debouncedSearchQuery?: string,
  departmentId?: number,
  subDepartmentId?: number
  
) => {
  const token = useUserStore((state) => state.token);
  const service = useAttendanceService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.Attendance.Vacations,
      page,
      pageSize,
      `${searchKey && debouncedSearchQuery ? [searchKey, debouncedSearchQuery] : ""}`, 
      departmentId,
      subDepartmentId,
    ],
    queryFn: () =>
      service.fetchWithVacations(
        page,
        pageSize,
        searchKey,
        debouncedSearchQuery,
        departmentId,
        subDepartmentId,
      ),
    enabled: !!token,
  });

  return {
    attendanceWithVacations: data?.data?.data.attendance || [],
    totalAttendances: data?.data?.data.totalCount || 0,
    metadata: data?.data?.data.metadata || initialMetadata,
    isAttendanceWithVacationsLoading: isLoading,
  };
};

// Get all attendance records
export const useGetEmployeeTodayAttendance = () => {
  const token = useUserStore((state) => state.token);
  const service = useAttendanceService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Attendance.EmployeeToday],
    queryFn: () =>
      service.fetchEmployeeTodayAttendance(),
    enabled: !!token,
  });

  return {
    todayAttendance: data?.data?.data || initialAttendanceEntry,
    isTodayAttendanceLoading: isLoading,
  };
};