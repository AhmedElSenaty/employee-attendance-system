// import { MoveUserAttendanceRequest, MoveUserAttendanceResponse } from "../interfaces";

// // Static service implementation for move user attendance
// export class MoveUserAttendanceService {
//   /**
//    * Move user attendance between devices
//    * @param request - The move request containing employee and device IDs
//    * @returns Promise with the move operation result
//    */
//   static async moveUserAttendance(request: MoveUserAttendanceRequest): Promise<MoveUserAttendanceResponse> {
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 2000));

//     // Simulate success response
//     const response: MoveUserAttendanceResponse = {
//       success: true,
//       message: Successfully moved ${request.employeeIds.length} employee(s) fingerprint(s) between devices,
//       movedEmployees: request.employeeIds.length,
//       sourceDevices: request.sourceDeviceIds.length,
//       targetDevices: request.targetDeviceIds.length,
//       timestamp: new Date().toISOString(),
//     };

//     // Simulate potential error (10% chance for demo purposes)
//     if (Math.random() < 0.1) {
//       throw new Error("Network error: Failed to connect to device");
//     }

//     return response;
//   }

//   /**
//    * Validate move request
//    * @param request - The move request to validate
//    * @returns Validation result
//    */
//   static validateMoveRequest(request: MoveUserAttendanceRequest): { isValid: boolean; errors: string[] } {
//     const errors: string[] = [];

//     if (!request.employeeIds || request.employeeIds.length === 0) {
//       errors.push("At least one employee must be selected");
//     }

//     if (!request.sourceDeviceIds || request.sourceDeviceIds.length === 0) {
//       errors.push("At least one source device must be selected");
//     }

//     if (!request.targetDeviceIds || request.targetDeviceIds.length === 0) {
//       errors.push("At least one target device must be selected");
//     }

//     // Check for overlapping source and target devices
//     const overlappingDevices = request.sourceDeviceIds.filter(id =>
//       request.targetDeviceIds.includes(id)
//     );

//     if (overlappingDevices.length > 0) {
//       errors.push("Source and target devices cannot be the same");
//     }

//     return {
//       isValid: errors.length === 0,
//       errors
//     };
//   }

//   /**
//    * Get move operation status (for future implementation)
//    * @param operationId - The operation ID
//    * @returns Operation status
//    */
//   static async getMoveOperationStatus(operationId: string): Promise<{
//     status: 'pending' | 'processing' | 'completed' | 'failed';
//     progress: number;
//     message: string;
//   }> {
//     // Simulate status check
//     await new Promise(resolve => setTimeout(resolve, 500));

//     return {
//       status: 'completed',
//       progress: 100,
//       message: 'Operation completed successfully'
//     };
//   }
// }
