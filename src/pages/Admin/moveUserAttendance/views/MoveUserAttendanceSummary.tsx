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

interface Employee {
  id: number;
  name: string;
  department: string;
  subDepartment: string;
}

interface Device {
  id: number;
  name: string;
  ip: string;
  port: number;
}

interface MoveUserAttendanceSummaryProps {
  moveData: MoveUserAttendanceData;
  employees: Employee[];
  devices: Device[];
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export const MoveUserAttendanceSummary = ({
  moveData,
  employees,
  devices,
  onConfirm,
  onCancel,
  isProcessing,
}: MoveUserAttendanceSummaryProps) => {
  const { t } = useTranslation();

  const selectedEmployees = employees.filter((emp) =>
    moveData.employeeIds.includes(emp.id)
  );
  const selectedSourceDevices = devices.filter((device) =>
    moveData.sourceDeviceIds.includes(device.id)
  );
  const selectedTargetDevices = devices.filter((device) =>
    moveData.targetDeviceIds.includes(device.id)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t("Review Move Operation")}
          </h3>
          <p className="text-sm text-gray-600">
            {t(
              "Please review the details before confirming the fingerprint transfer"
            )}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Employees Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {t("Employees")}
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-900 mb-2">
            {selectedEmployees.length}
          </div>
          <div className="text-xs text-blue-700">{t("employees selected")}</div>
        </div>

        {/* Source Devices Card */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Monitor className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-900">
              {t("Source Devices")}
            </span>
          </div>
          <div className="text-2xl font-bold text-red-900 mb-2">
            {selectedSourceDevices.length}
          </div>
          <div className="text-xs text-red-700">
            {t("devices to remove from")}
          </div>
        </div>

        {/* Target Devices Card */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Monitor className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              {t("Target Devices")}
            </span>
          </div>
          <div className="text-2xl font-bold text-green-900 mb-2">
            {selectedTargetDevices.length}
          </div>
          <div className="text-xs text-green-700">{t("devices to add to")}</div>
        </div>
      </div>

      {/* Detailed Lists */}
      <div className="space-y-6">
        {/* Selected Employees */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            {t("Selected Employees")}
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
            {selectedEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between py-1"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {employee.name}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {employee.department} - {employee.subDepartment}
                  </span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Transfer Flow */}
        <div className="flex items-center justify-center space-x-4">
          {/* Source Devices */}
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              {t("From (Source Devices)")}
            </h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-32 overflow-y-auto">
              {selectedSourceDevices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between py-1"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {device.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {device.ip}:{device.port}
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center">
            <div className="p-2 bg-blue-100 rounded-full">
              <ArrowRight className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500 mt-1">{t("Transfer")}</span>
          </div>

          {/* Target Devices */}
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              {t("To (Target Devices)")}
            </h4>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-h-32 overflow-y-auto">
              {selectedTargetDevices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between py-1"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {device.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {device.ip}:{device.port}
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Warning Message */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-900">
              {t("Important Notice")}
            </h4>
            <p className="text-sm text-yellow-800 mt-1">
              {t(
                "This operation will transfer fingerprint data for the selected employees from the source devices to the target devices. This action cannot be undone."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="px-6 py-2"
        >
          {t("Cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isProcessing}
          isLoading={isProcessing}
          className="px-6 py-2 bg-red-600 hover:bg-red-700"
        >
          {isProcessing ? t("Processing...") : t("Confirm Transfer")}
        </Button>
      </div>
    </div>
  );
};
