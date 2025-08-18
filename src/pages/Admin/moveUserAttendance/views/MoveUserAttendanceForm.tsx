import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Users,
  Monitor,
  ArrowRight,
} from "lucide-react";
import { Button, CustomSelect } from "../../../../components/ui";
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

interface MoveUserAttendanceFormProps {
  employees: Employee[];
  devices: Device[];
  onSubmit: (data: MoveUserAttendanceData) => void;
  isProcessing: boolean;
}

export const MoveUserAttendanceForm = ({
  employees,
  devices,
  onSubmit,
  isProcessing,
}: MoveUserAttendanceFormProps) => {
  const { t } = useTranslation();
  const deviceOptions =
    devices?.map((device) => ({
      value: device.id,
      label: `${device.name} (${device.ip}:${device.port})`,
    })) || [];

  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectedSourceDevices, setSelectedSourceDevices] = useState<number[]>(
    []
  );
  const [selectedTargetDevices, setSelectedTargetDevices] = useState<number[]>(
    []
  );
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [showSourceDeviceDropdown, setShowSourceDeviceDropdown] =
    useState(false);
  const [showTargetDeviceDropdown, setShowTargetDeviceDropdown] =
    useState(false);

  const handleEmployeeToggle = (employeeId: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSourceDeviceToggle = (deviceId: number) => {
    setSelectedSourceDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleTargetDeviceToggle = (deviceId: number) => {
    setSelectedTargetDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedEmployees.length === 0) {
      alert(t("Please select at least one employee"));
      return;
    }

    if (selectedSourceDevices.length === 0) {
      alert(t("Please select at least one source device"));
      return;
    }

    if (selectedTargetDevices.length === 0) {
      alert(t("Please select at least one target device"));
      return;
    }

    onSubmit({
      employeeIds: selectedEmployees,
      sourceDeviceIds: selectedSourceDevices,
      targetDeviceIds: selectedTargetDevices,
    });
  };

  const getSelectedEmployeeNames = () => {
    return employees
      .filter((emp) => selectedEmployees.includes(emp.id))
      .map((emp) => emp.name)
      .join(", ");
  };

  const getSelectedSourceDeviceNames = () => {
    return devices
      .filter((device) => selectedSourceDevices.includes(device.id))
      .map((device) => device.name)
      .join(", ");
  };

  const getSelectedTargetDeviceNames = () => {
    return devices
      .filter((device) => selectedTargetDevices.includes(device.id))
      .map((device) => device.name)
      .join(", ");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Employee Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          {t("Select Employees")} *
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
            className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-900">
                {selectedEmployees.length > 0
                  ? ` ${selectedEmployees.length} employee(s) selected`
                  : t("Choose employees")}
              </span>
            </div>
            {showEmployeeDropdown ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {showEmployeeDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {employees.map((employee) => (
                <label
                  key={employee.id}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => handleEmployeeToggle(employee.id)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {employee.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {employee.department} - {employee.subDepartment}
                    </div>
                  </div>
                  {selectedEmployees.includes(employee.id) && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {selectedEmployees.length > 0 && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <strong>{t("Selected")}:</strong> {getSelectedEmployeeNames()}
          </div>
        )}
      </div>

      {/* Source Devices Selection */}
      {/* Source Devices Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          {t("Select Source Devices")} *
        </label>

        <CustomSelect
          className="w-full"
          placeholder={t("Choose source devices")}
          options={deviceOptions}
          value={deviceOptions.filter((opt) =>
            selectedSourceDevices.includes(opt.value as number)
          )}
          onChange={(options) =>
            setSelectedSourceDevices(options.map((opt) => opt.value as number))
          }
          isMulti
          isSearchable
          isClearable
        />

        {selectedSourceDevices.length > 0 && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <strong>{t("Selected")}:</strong> {getSelectedSourceDeviceNames()}
          </div>
        )}
      </div>

      {/* Arrow Icon */}
      <div className="flex justify-center">
        <div className="p-2 bg-blue-100 rounded-full">
          <ArrowRight className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      {/* Target Devices Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          {t("Select Target Devices")} *
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setShowTargetDeviceDropdown(!showTargetDeviceDropdown)
            }
            className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-900">
                {selectedTargetDevices.length > 0
                  ? ` ${selectedTargetDevices.length} device(s) selected`
                  : t("Choose target devices")}
              </span>
            </div>
            {showTargetDeviceDropdown ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {showTargetDeviceDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {devices.map((device) => (
                <label
                  key={device.id}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTargetDevices.includes(device.id)}
                    onChange={() => handleTargetDeviceToggle(device.id)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {device.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {device.ip}:{device.port}
                    </div>
                  </div>
                  {selectedTargetDevices.includes(device.id) && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {selectedTargetDevices.length > 0 && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <strong>{t("Selected")}:</strong> {getSelectedTargetDeviceNames()}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={
            isProcessing ||
            selectedEmployees.length === 0 ||
            selectedSourceDevices.length === 0 ||
            selectedTargetDevices.length === 0
          }
          isLoading={isProcessing}
          className="px-6 py-2"
        >
          {isProcessing ? t("Processing...") : t("Review Move Operation")}
        </Button>
      </div>
    </form>
  );
};
