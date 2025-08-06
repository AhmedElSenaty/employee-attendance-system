import { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  AttendanceCredentials,
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
import { AttendanceService } from "../services";
import { QueryKeys } from "../constants";
import { useLanguageStore, useUserStore } from "../store";

export const useAttendanceService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new AttendanceService(token);
  }, [token]);

  return service;
};
export const useUploadAttendanceExcel = () => {
  const { language } = useLanguageStore();
  const attendanceService = useAttendanceService();

  return useMutation({
    mutationFn: (file: File) => {
      return attendanceService.uploadExcelFile(file);
    },
    onSuccess: (response) => {
      if (response?.status === 200 || response?.status === 201) {
        showToast(
          "success",
          getTranslatedMessage(
            response?.data?.message ?? "Import successful",
            language
          )
        );
      }
    },
    onError: (error) => {
      handleApiError(error as AxiosError<IErrorResponse>, language);
    },
  });
};

// Get all attendance records
export const useGetAttendances = (
  page?: number,
  pageSize?: number,
  searchKey?: string,
  searchQuery?: string,
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
      `${searchKey && searchQuery ? [searchKey, searchQuery] : ""}`,
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
        searchQuery,
        startDate,
        endDate,
        startTime,
        endTime,
        status,
        departmentId,
        subDepartmentId
      ),
    enabled: !!token,
  });

  return {
    attendancesData: data?.data?.data.attendances || [],
    count: data?.data?.data.totalCount || 0,
    metadata: data?.data?.data.metadata || initialMetadata,
    isLoading,
  };
};

// Get attendance summary
export const useGetAttendanceSummary = (
  page?: number,
  pageSize?: number,
  searchKey?: string,
  searchQuery?: string,
  startDate?: string,
  endDate?: string,
  departmentId?: number,
  subDepartmentId?: number
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
      `${searchKey && searchQuery ? [searchKey, searchQuery] : ""}`,
    ],
    queryFn: () =>
      service.fetchSummary(
        page,
        pageSize,
        startDate,
        endDate,
        searchKey,
        searchQuery,
        departmentId,
        subDepartmentId
      ),
    enabled: !!token,
  });

  return {
    attendanceSummary: data?.data?.data.attendanceSummary || [],
    count: data?.data?.data.totalCount || 0,
    metadata: data?.data?.data.metadata || initialMetadata,
    isLoading,
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
    isLoading,
  };
};

// Get detailed attendance
export const useGetAttendanceDetails = (
  attendanceID: number,
  resetInputs?: (data: AttendanceCredentials) => void
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
    isLoading,
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
    isLoading,
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
    isLoading,
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
    queryKey: [
      QueryKeys.Attendance.DepartmentOverview,
      startDate,
      endDate,
      departmentID,
    ],
    queryFn: () =>
      service.fetchDepartmentOverview(startDate, endDate, departmentID),
    enabled: !!token,
  });

  return {
    departmentAttendanceOverview: data?.data?.data,
    isLoading,
  };
};

// Create Attendance
export const useCreateAttendance = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const attendanceService = useAttendanceService();

  return useMutation({
    mutationFn: (attendanceData: AttendanceCredentials) => {
      const formatted = {
        ...attendanceData,
        attendanceTime: appendSecondsToTime(
          attendanceData.attendanceTime || ""
        ),
      };
      return attendanceService.create(formatted);
    },
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Attendance.All] });
      if (status === 201) {
        showToast(
          "success",
          getTranslatedMessage(data.message ?? "", language)
        );
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
    mutationFn: (attendanceData: AttendanceCredentials) => {
      const formatted = {
        ...attendanceData,
        attendanceTime: appendSecondsToTime(
          attendanceData.attendanceTime || ""
        ),
      };
      return attendanceService.update(formatted);
    },
    onSuccess: ({ status, data }, attendanceData) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Attendance.All] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.Attendance.Details, attendanceData.id],
      });
      if (status === 200) {
        showToast(
          "success",
          getTranslatedMessage(data.message ?? "", language)
        );
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
    mutationFn: (attendanceID: number) =>
      attendanceService.delete(attendanceID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Attendance.All] });
      if (status === 200) {
        showToast(
          "success",
          getTranslatedMessage(data.message ?? "", language)
        );
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
  searchQuery?: string,
  departmentId?: number,
  subDepartmentId?: number,
  startDate?: string,
  endDate?: string
) => {
  const token = useUserStore((state) => state.token);
  const service = useAttendanceService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.Attendance.Vacations,
      page,
      pageSize,
      `${searchKey && searchQuery ? [searchKey, searchQuery] : ""}`,
      departmentId,
      subDepartmentId,
      startDate,
      endDate,
    ],
    queryFn: () =>
      service.fetchWithVacations(
        page,
        pageSize,
        searchKey,
        searchQuery,
        departmentId,
        subDepartmentId,
        startDate
      ),
    enabled: !!token,
  });

  return {
    attendanceWithVacations: data?.data?.data.attendance || [],
    count: data?.data?.data.totalCount || 0,
    metadata: data?.data?.data.metadata || initialMetadata,
    isLoading,
  };
};

// Get all attendance records
export const useGetAttendanceStatus = (status: string) => {
  const token = useUserStore((state) => state.token);
  const service = useAttendanceService();
  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Attendance.Vacations, status],
    queryFn: () => service.fetchStatus(status),
    enabled: !!token,
  });

  return {
    attendanceWithVacations: data?.data?.data || [],
    count: data?.data?.data.totalCount || 0,
    metadata: data?.data?.data.metadata || initialMetadata,
    isLoading,
  };
};

// Get all attendance records
export const useGetEmployeeTodayAttendance = () => {
  const token = useUserStore((state) => state.token);
  const service = useAttendanceService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Attendance.EmployeeToday],
    queryFn: () => service.fetchEmployeeTodayAttendance(),
    enabled: !!token,
  });

  return {
    todayAttendance: data?.data?.data || initialAttendanceEntry,
    isLoading,
  };
};
