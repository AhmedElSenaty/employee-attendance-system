import { useState } from "react";
import {
  MoveUserAttendanceRequest,
  MoveUserAttendanceResponse,
} from "../interfaces";
// import { MoveUserAttendanceService } from "../services/moveUserAttendance.services";

export const useMoveUserAttendance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MoveUserAttendanceResponse | null>(null);

  /**
   * Move user attendance between devices
   * @param request - The move request
   * @returns Promise with the result
   */
  const moveUserAttendance = async (
    request: MoveUserAttendanceRequest
  ): Promise<MoveUserAttendanceResponse> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Validate request first
    //   const validation = MoveUserAttendanceService.validateMoveRequest(request);
    //   if (!validation.isValid) {
    //     throw new Error(validation.errors.join(", "));
    //   }

      // Perform the move operation
    //   const response = await MoveUserAttendanceService.moveUserAttendance(
    //   const response = await MoveUserAttendanceService.moveUserAttendance(
    //     request
    //   );

    //   setResult(response);
    //   return response;
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset the hook state
   */
  const reset = () => {
    setIsLoading(false);
    setError(null);
    setResult(null);
  };

  return {
    moveUserAttendance,
    isLoading,
    error,
    result,
    reset,
  };
};
