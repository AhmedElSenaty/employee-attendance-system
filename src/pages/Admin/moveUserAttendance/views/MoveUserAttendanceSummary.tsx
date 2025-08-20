import { useTranslation } from "react-i18next";
import {
  Users,
  Monitor,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../../../components/ui";
import { MoveUserAttendanceData } from "../index";
import { useGetDeviceUsersByDeviceId } from "../../../../hooks";

interface Device {
  id: number;
  name: string;
  ip: string;
  port: number;
}

interface MoveUserAttendanceSummaryProps {
  moveData: MoveUserAttendanceData;
  devices: Device[];
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export const MoveUserAttendanceSummary = ({
  moveData,
  devices,
  onConfirm,
  onCancel,
  isProcessing,
}: MoveUserAttendanceSummaryProps) => {
  const { t } = useTranslation("moveUserFingerPrint");

  // Get source devices
  const sourceDeviceIds = moveData.sourceDeviceIds;

  // For simplicity, we'll get employees from the source device
  const sourceDeviceId = sourceDeviceIds[0];
  const { deviceUsers, isLoading: isDeviceUsersLoading } =
    useGetDeviceUsersByDeviceId(sourceDeviceId);

  const selectedEmployees =
    deviceUsers?.filter((deviceUser) =>
      moveData.employeeIds.includes(deviceUser.id)
    ) || [];

  const selectedSourceDevice = devices.find((device) =>
    moveData.sourceDeviceIds.includes(device.id)
  );

  const targetDeviceIds = moveData.targetDeviceIds;
  const targetDevices = devices.filter((device) =>
    targetDeviceIds.includes(device.id)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-10 my-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t("moveUserAttendance.summary.reviewTitle")}
          </h3>
          <p className="text-sm text-gray-600">
            {t("moveUserAttendance.summary.reviewDescription")}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Selected Employees */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-gray-600" />
            <h4 className="font-medium text-gray-900">
              {t("moveUserAttendance.summary.selectedEmployees")} (
              {selectedEmployees.length})
            </h4>
          </div>
          {isDeviceUsersLoading ? (
            <div className="text-sm text-gray-500">
              Loading employee details...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedEmployees.map((employee) => (
                <div
                  key={employee.employeeId}
                  className="flex items-center justify-between p-2 bg-white rounded border"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {employee.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ID: {employee.id}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transfer Direction */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4">
            {/* Source Devices */}
            <div className="bg-red-50 rounded-lg p-4 min-w-[200px]">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="w-4 h-4 text-red-600" />
                <h4 className="font-medium text-red-900">
                  {t("moveUserAttendance.summary.from")} (
                  {selectedSourceDevice ? 1 : 0})
                </h4>
              </div>
              <div className="space-y-2">
                {selectedSourceDevice && (
                  <div
                    key={selectedSourceDevice.id}
                    className="p-2 bg-white rounded border border-red-200"
                  >
                    <div className="text-sm font-medium text-red-900">
                      {selectedSourceDevice.name}
                    </div>
                    {/* <div className="text-xs text-red-700">
                      {selectedSourceDevice.ip}:{selectedSourceDevice.port}
                    </div> */}
                  </div>
                )}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center">
              <div className="p-2 bg-blue-100 rounded-full">
                <ArrowRight className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {t("moveUserAttendance.summary.transfer")}
              </span>
            </div>

            {/* Target Device */}
            <div className="bg-green-50 rounded-lg p-4 min-w-[200px]">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="w-4 h-4 text-green-600" />
                <h4 className="font-medium text-green-900">
                  {t("moveUserAttendance.summary.to")} ({targetDevices.length})
                </h4>
              </div>
              <div className="space-y-2">
                {targetDevices.map((device) => (
                  <div
                    key={device.id}
                    className="p-2 bg-white rounded border border-green-200"
                  >
                    <div className="text-sm font-medium text-green-900">
                      {device.name}
                    </div>
                    {/* <div className="text-xs text-green-700">
                      {device.ip}:{device.port}
                    </div> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">
                {t("moveUserAttendance.summary.importantNotice")}
              </h4>
              <p className="text-sm text-yellow-800">
                {t("moveUserAttendance.summary.importantNoticeMessage")}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-6 py-2"
          >
            {t("moveUserAttendance.summary.cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isProcessing}
            isLoading={isProcessing}
            className="
                        px-8 py-3 rounded-xl shadow-md transition-transform duration-200 hover:scale-105
                        disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed
                      "
          >
            {isProcessing
              ? t("moveUserAttendance.summary.processing")
              : t("moveUserAttendance.summary.confirmMove")}
          </Button>
        </div>
      </div>
    </div>
  );
};
