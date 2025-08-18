import { useDeviceMoveUserAttendance } from "./device.hooks";
import { MoveUserAttendanceData } from "../pages/Admin/moveUserAttendance";

export const useMoveUserAttendance = () => {
  const mutation = useDeviceMoveUserAttendance();

  const moveUserAttendance = async (moveData: MoveUserAttendanceData) => {
    return mutation.mutateAsync(moveData);
  };

  return {
    moveUserAttendance,
    isLoading: mutation.isPending,
    error: mutation.error,
    result: mutation.data,
    reset: mutation.reset,
  };
};
