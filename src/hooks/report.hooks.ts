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
  checked?: boolean,
  departmentId?: number,
  subDepartmentId?: number
) => {
  const service = useReportService();

  const { refetch } = useQuery({
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
  checked?: boolean,
  departmentId?: number,
  subDepartmentId?: number,
  absenceOnly?: boolean
) => {
  const service = useReportService();

  const { refetch } = useQuery({
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
      absenceOnly,
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
        subDepartmentId,
        absenceOnly
      ),
    enabled: false, // manual refetching
    retry: 3,
  });

  return {
    refetchExportDataPDF: refetch,
  };
};
export const useExportAttendanceSummaryReport = (
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  startTime?: string,
  endTime?: string,
  status?: string,
  checked?: boolean,
  departmentId?: number,
  subDepartmentId?: number
) => {
  const service = useReportService();

  const { refetch } = useQuery({
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
      service.fetchEmployeeAttendanceSummaryReport(
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
  };
};

export const useExportAttendanceSummaryReportPDF = (
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  startTime?: string,
  endTime?: string,
  status?: string,
  checked?: boolean,
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
      service.fetchEmployeeAttendanceSummaryReportPDF(
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
export const useExportReport = (
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  type?: string,
  checked?: boolean,
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
      status,
      type,
      checked,
      departmentId,
      subDepartmentId,
    ],
    queryFn: () =>
      service.fetchEmployeeReport(
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
        status,
        type,
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
export const useExportReportPDF = (
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  type?: string,
  checked?: boolean,
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
      status,
      type,
      checked,
      departmentId,
      subDepartmentId,
    ],
    queryFn: () =>
      service.fetchEmployeeReportPDF(
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
        status,
        type,
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
export const useEmployeeRequestsSummaryReport = (
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  type?: string,
  checked?: boolean,
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
      status,
      type,
      checked,
      departmentId,
      subDepartmentId,
    ],
    queryFn: () =>
      service.fetchEmployeeRequestsSummaryReport(
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
        status,
        type,
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
export const useEmployeeRequestsSummaryReportPDF = (
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  status?: string,
  type?: string,
  checked?: boolean,
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
      status,
      type,
      checked,
      departmentId,
      subDepartmentId,
    ],
    queryFn: () =>
      service.fetchEmployeeRequestsSummaryReportPDF(
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
        status,
        type,
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

export const useExportVacationSaverReport = (
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  checked?: boolean,
  departmentId?: number,
  subDepartmentId?: number
) => {
  const service = useReportService();

  const { refetch } = useQuery({
    queryKey: [
      QueryKeys.Export.Excel,
      searchKey,
      debouncedSearchQuery,
      startDate,
      endDate,
      checked,
      departmentId,
      subDepartmentId,
    ],
    queryFn: () =>
      service.fetchVacationSaverReport(
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
        checked,
        departmentId,
        subDepartmentId
      ),
    enabled: false, // manual refetching
    retry: 3,
  });

  return {
    refetchExportData: refetch,
  };
};

export const useExportVacationSaverReportPDF = (
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  checked?: boolean,
  departmentId?: number,
  subDepartmentId?: number
) => {
  const service = useReportService();

  const { refetch } = useQuery({
    queryKey: [
      QueryKeys.Export.PDF,
      searchKey,
      debouncedSearchQuery,
      startDate,
      endDate,
      checked,
      departmentId,
      subDepartmentId,
    ],
    queryFn: () =>
      service.fetchVacationSaverReportPDF(
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
        checked,
        departmentId,
        subDepartmentId
      ),
    enabled: false, // manual refetching
    retry: 3,
  });
  return {
    refetchExportDataPDF: refetch,
  };
};

export const useExportAbsenceFromWorkReportPDF = (
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  checked?: boolean,
  departmentId?: number,
  subDepartmentId?: number,
  title?: string
) => {
  const service = useReportService();
  console.log(title);
  const { refetch } = useQuery({
    queryKey: [
      QueryKeys.Export.PDF,
      searchKey,
      debouncedSearchQuery,
      startDate,
      endDate,
      checked,
      departmentId,
      subDepartmentId,
      title,
    ],
    queryFn: () =>
      service.fetchAbsenceFromWorkReportPDF(
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
        checked,
        departmentId,
        subDepartmentId,
        title
      ),
    enabled: false, // manual refetching
    retry: 3,
  });
  return {
    refetchExportDataPDF: refetch,
  };
};

export const useExportAbsenceFromWorkReportExcel = (
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  checked?: boolean,
  departmentId?: number,
  subDepartmentId?: number
) => {
  const service = useReportService();

  const { refetch } = useQuery({
    queryKey: [
      QueryKeys.Export.PDF,
      searchKey,
      debouncedSearchQuery,
      startDate,
      endDate,
      checked,
      departmentId,
      subDepartmentId,
    ],
    queryFn: () =>
      service.fetchAbsenceFromWorkReportExcel(
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
        checked,
        departmentId,
        subDepartmentId
      ),
    enabled: false, // manual refetching
    retry: 3,
  });
  return {
    refetchExportData: refetch,
  };
};

export const useExportWorkOvertimeReportPDF = (
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  checked?: boolean,
  departmentId?: number,
  subDepartmentId?: number
) => {
  const service = useReportService();

  const { refetch } = useQuery({
    queryKey: [
      QueryKeys.Export.PDF,
      searchKey,
      debouncedSearchQuery,
      startDate,
      endDate,
      checked,
      departmentId,
      subDepartmentId,
    ],
    queryFn: () =>
      service.fetchWorkOvertimeReportPDF(
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
        checked,
        departmentId,
        subDepartmentId
      ),
    enabled: false, // manual refetching
    retry: 3,
  });
  return {
    refetchExportDataPDF: refetch,
  };
};

export const useExportWorkOvertimeReportExcel = (
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  checked?: boolean,
  departmentId?: number,
  subDepartmentId?: number
) => {
  const service = useReportService();

  const { refetch } = useQuery({
    queryKey: [
      QueryKeys.Export.PDF,
      searchKey,
      debouncedSearchQuery,
      startDate,
      endDate,
      checked,
      departmentId,
      subDepartmentId,
    ],
    queryFn: () =>
      service.fetchWorkOvertimeReportExcel(
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
        checked,
        departmentId,
        subDepartmentId
      ),
    enabled: false, // manual refetching
    retry: 3,
  });
  return {
    refetchExportData: refetch,
  };
};

export const useExportSummaryWorkOvertimeReportPDF = (
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  checked?: boolean,
  departmentId?: number,
  subDepartmentId?: number
) => {
  const service = useReportService();

  const { refetch } = useQuery({
    queryKey: [
      QueryKeys.Export.PDF,
      searchKey,
      debouncedSearchQuery,
      startDate,
      endDate,
      checked,
      departmentId,
      subDepartmentId,
    ],
    queryFn: () =>
      service.fetchSummaryWorkOvertimeReportPDF(
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
        checked,
        departmentId,
        subDepartmentId
      ),
    enabled: false, // manual refetching
    retry: 3,
  });
  return {
    refetchExportDataPDF: refetch,
  };
};

export const useExportSummaryWorkOvertimeReportExcel = (
  searchKey?: string,
  debouncedSearchQuery?: string,
  startDate?: string,
  endDate?: string,
  checked?: boolean,
  departmentId?: number,
  subDepartmentId?: number
) => {
  const service = useReportService();

  const { refetch } = useQuery({
    queryKey: [
      QueryKeys.Export.PDF,
      searchKey,
      debouncedSearchQuery,
      startDate,
      endDate,
      checked,
      departmentId,
      subDepartmentId,
    ],
    queryFn: () =>
      service.fetchSummaryWorkOvertimeReportExcel(
        searchKey,
        debouncedSearchQuery,
        startDate,
        endDate,
        checked,
        departmentId,
        subDepartmentId
      ),
    enabled: false, // manual refetching
    retry: 3,
  });
  return {
    refetchExportData: refetch,
  };
};

// export const useExportGetEmployeesVerificationPDF = (
//   includeDept?: boolean,
//   includeSubDept?: boolean
// ) => {
//   const service = useReportService();

//   console.log("dept ======> ", includeDept);
//   console.log("sub dept ======> ", includeSubDept);

//   const { refetch } = useQuery({
//     queryKey: [QueryKeys.Export.PDF],
//     queryFn: () =>
//       service.GetEmployeesVerificationPDF(includeDept, includeSubDept),
//     enabled: false, // manual refetching
//     retry: 3,
//   });
//   return {
//     refetchExportDataPDF: refetch,
//   };
// };

export const useExportGetEmployeesVerificationExcel = (
  includeDept?: boolean,
  includeSubDept?: boolean
) => {
  const service = useReportService();

  const { refetch } = useQuery({
    // ✅ include flags in the key so each combo has its own cache entry
    queryKey: [QueryKeys.Export.Excel, includeDept, includeSubDept],
    // ✅ derive the args from the queryKey to avoid stale closures
    queryFn: ({ queryKey }) => {
      const [, dept, sub] = queryKey as [
        string,
        boolean | undefined,
        boolean | undefined
      ];
      return service.GetEmployeesVerificationExcel(dept, sub);
    },
    enabled: false,
    retry: 3,
  });

  return { refetchExportDataExcel: refetch };
};
export const useExportGetEmployeesVerificationPDF = (
  includeDept?: boolean,
  includeSubDept?: boolean
) => {
  const service = useReportService();

  const { refetch } = useQuery({
    // ✅ include flags in the key so each combo has its own cache entry
    queryKey: [QueryKeys.Export.Excel, includeDept, includeSubDept],
    // ✅ derive the args from the queryKey to avoid stale closures
    queryFn: ({ queryKey }) => {
      const [, dept, sub] = queryKey as [
        string,
        boolean | undefined,
        boolean | undefined
      ];
      return service.GetEmployeesVerificationPDF(dept, sub);
    },
    enabled: false,
    retry: 3,
  });

  return { refetchExportDataPDF: refetch };
};
