import { useQuery } from "@tanstack/react-query";
import { ReportsService } from "../services/report.services";
import { useUserStore } from "../store/user.store";
import { useMemo } from "react";
import { QueryKeys } from "../constants";


export const useReportService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new ReportsService(token);
  }, [token]);

  return service;
};

export const useExportAttendanceReport = (
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  startTime?: string,
  endTime?: string,
  status?: string,
  checked?:boolean,
  departmentId?: number,
  subDepartmentId?: number
) => {
  const service = useReportService();

  const { refetch, isLoading } = useQuery({
    queryKey: [
      QueryKeys.Export.Excel,
      searchKey,
      debouncedSearchQuery,
      startDate,
      endDate,
      startTime,
      endTime,
      status,
      checked,
      departmentId,
      subDepartmentId,
    ],
    queryFn: () =>
      service.fetchEmployeeAttendanceReport(
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
        startTime,
        endTime,
        status,
        checked,
        departmentId,
        subDepartmentId
      ),
    enabled: false, // manual refetching
    retry: 3,
  });

  return {
    refetchExportData: refetch,
    isLoading,
  };
};
export const useExportAttendanceReportPDF = (
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  startTime?: string,
  endTime?: string,
  status?: string,
  checked?:boolean,
  departmentId?: number,
  subDepartmentId?: number
) => {
  const service = useReportService();

  const { refetch, isLoading } = useQuery({
    queryKey: [
      QueryKeys.Export.PDF,
      searchKey,
      debouncedSearchQuery,
      startDate,
      endDate,
      startTime,
      endTime,
      status,
      checked,
      departmentId,
      subDepartmentId,
    ],
    queryFn: () =>
      service.fetchEmployeeAttendanceReportPDF(
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
        startTime,
        endTime,
        status,
        checked,
        departmentId,
        subDepartmentId
      ),
    enabled: false, // manual refetching
    retry: 3,
    
  });
  return {
    refetchExportDataPDF: refetch,
    isLoadingPDF: isLoading,
  };
};
