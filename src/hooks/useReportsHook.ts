import { useQuery } from "@tanstack/react-query";
import { fetchEmployeeAttendanceReport } from "../services/admin/reportsServices";
import { useUserStore } from "../store/user.store";

const EXPORT_EMPLOYEE_ATTENDANCE_QUERY_KEY = "exportEmployeeAttendance"

const useExportEmployeesAttendanceData = (searchKey: string, debouncedSearchQuery: string, startDate: string, endDate: string, startTime: string, endTime: string, status: string, searchByDepartmentId: number, searchBySubDeptartmentId: number) => {
  const token = useUserStore((state) => state.token);
  // Create a unique query key based on the parameters
  const queryKey = [
    EXPORT_EMPLOYEE_ATTENDANCE_QUERY_KEY,
    searchKey,
    debouncedSearchQuery,
    startDate,
    endDate,
    startTime,
    endTime,
    status,
    searchByDepartmentId,
    searchBySubDeptartmentId
  ];
  const { refetch, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchEmployeeAttendanceReport(searchKey, debouncedSearchQuery, startDate, endDate, startTime, endTime, status, searchByDepartmentId, searchBySubDeptartmentId, token),
    enabled: false,
    retry: 3,
  });
  return { refetch, isLoading };
};

export {
  useExportEmployeesAttendanceData
};
