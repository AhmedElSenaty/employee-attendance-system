import { useQuery } from "@tanstack/react-query";
import { ReportsService } from "../services/report.services";
import { useUserStore } from "../store/user.store";

const EXPORT_EMPLOYEE_ATTENDANCE_QUERY_KEY = "exportEmployeeAttendance"

export const useExportEmployeesAttendanceReport = (
  searchKey: string,
  debouncedSearchQuery: string,
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  status: string,
  departmentId: number,
  subDepartmentId: number
) => {
  const token = useUserStore((state) => state.token);
  const service = new ReportsService(token);

  const { refetch, isLoading } = useQuery({
    queryKey: [
      EXPORT_EMPLOYEE_ATTENDANCE_QUERY_KEY,
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
      service.fetchEmployeeAttendanceReport(
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
        startTime,
        endTime,
        status,
        departmentId,
        subDepartmentId
      ),
    enabled: false, // manual refetching
    retry: 3,
  });

  return {
    refetchExportData: refetch,
    isExportDataLoading: isLoading,
  };
};
