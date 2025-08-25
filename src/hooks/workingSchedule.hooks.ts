import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../store/user.store";
import { WorkingScheduleService } from "../services/workingSchedule.services";
import { EmployeeWorkingScheduleCredentials } from "../interfaces/workingDays.interfaces";
import { QueryKeys } from "../constants";

// Hook to get working schedule service
export const useWorkingScheduleService = () => {
  const token = useUserStore((state) => state.token);
  return new WorkingScheduleService(token);
};

// Hook to get employee working schedule
export const useGetEmployeeSchedule = (employeeId: string | null) => {
  const service = useWorkingScheduleService();

  return useQuery({
    queryKey: [QueryKeys.WorkingSchedule.Employee, employeeId],
    queryFn: () => service.getEmployeeSchedule(employeeId!),
    enabled: !!employeeId,
  });
};

// Hook to get all employees schedules for manager
export const useGetAllEmployeesSchedules = () => {
  const service = useWorkingScheduleService();

  return useQuery({
    queryKey: [QueryKeys.WorkingSchedule.All],
    queryFn: () => service.getAllEmployeesSchedules(),
  });
};

// Hook to update employee working schedule
export const useUpdateEmployeeSchedule = () => {
  const service = useWorkingScheduleService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EmployeeWorkingScheduleCredentials) =>
      service.updateEmployeeSchedule(data),
    onSuccess: () => {
      // Invalidate and refetch working schedule queries
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.WorkingSchedule.Employee],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.WorkingSchedule.All],
      });
    },
  });
};

// Hook to delete employee working schedule
export const useDeleteEmployeeSchedule = () => {
  const service = useWorkingScheduleService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      scheduleId,
    }: {
      employeeId: string;
      scheduleId: string;
    }) => service.deleteEmployeeSchedule(employeeId, scheduleId),
    onSuccess: () => {
      // Invalidate and refetch working schedule queries
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.WorkingSchedule.Employee],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.WorkingSchedule.All],
      });
    },
  });
};

export const useGetSchedulesByEmployeeId = (employeeId: number) => {
  const token = useUserStore((state) => state.token);
  const service = useWorkingScheduleService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.WorkingScheduleEmployee, employeeId],
    queryFn: () => service.getSchedulesByEmployeeId(employeeId),
    enabled: !!token,
  });

  console.log("hook fires");
  console.log(employeeId);
  return {
    data: data?.data?.data || [],
    isLoading,
  };
};
