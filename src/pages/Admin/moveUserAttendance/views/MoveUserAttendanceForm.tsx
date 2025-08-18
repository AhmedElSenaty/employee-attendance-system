import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import {
  Button,
  CustomMultiSelect,
  CustomSelect,
} from "../../../../components/ui";
import { MoveUserAttendanceData } from "../index";
import {
  useGetDevicesList,
  useGetDeviceUsersByDeviceId,
} from "../../../../hooks";
import { EmployeeSummary } from "../../../../interfaces";

interface Device {
  id: number;
  name: string;
  ip: string;
  port: number;
}

interface Option {
  value: number | string;
  label: string;
  subLabel?: string;
}

interface MoveUserAttendanceFormProps {
  onSubmit: (data: MoveUserAttendanceData) => void;
  isProcessing: boolean;
}

export const MoveUserAttendanceForm = ({
  onSubmit,
  isProcessing,
}: MoveUserAttendanceFormProps) => {
  const { t } = useTranslation();

  // Get devices list for device selection
  const { devices: devicesList } = useGetDevicesList();

  // State for selected source device (single)
  const [selectedSourceDevice, setSelectedSourceDevice] = useState<
    number | null
  >(null);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectedTargetDevices, setSelectedTargetDevices] = useState<number[]>(
    []
  );

  // Get device users for the selected source device
  const { deviceUsers, isLoading: isDeviceUsersLoading } =
    useGetDeviceUsersByDeviceId(selectedSourceDevice || 0);

  // Convert device users to employee options
  const deviceEmployeeOptions =
    deviceUsers?.map((deviceUser: EmployeeSummary) => ({
      value: deviceUser.id,
      label: deviceUser.name,
      subLabel: `${deviceUser.id}`,
    })) || [];

  const deviceOptions =
    devicesList?.map((device: Device) => ({
      value: device.id,
      label: `${device.name}`,
    })) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted with data:", {
      selectedSourceDevice,
      selectedEmployees,
      selectedTargetDevices,
    });

    if (!selectedSourceDevice) {
      alert(t("Please select a source device"));
      return;
    }

    if (selectedEmployees.length === 0) {
      alert(t("Please select at least one employee"));
      return;
    }

    if (selectedTargetDevices.length === 0) {
      alert(t("Please select at least one target device"));
      return;
    }

    const submitData = {
      employeeIds: selectedEmployees,
      sourceDeviceIds: [selectedSourceDevice],
      targetDeviceIds: selectedTargetDevices,
    };

    console.log("Submitting data:", submitData);
    onSubmit(submitData);
  };

  const getSelectedEmployeeNames = () => {
    return (
      deviceUsers
        ?.filter((deviceUser: EmployeeSummary) =>
          selectedEmployees.includes(deviceUser.id)
        )
        .map((deviceUser: EmployeeSummary) => deviceUser.name)
        .join(", ") || ""
    );
  };

  console.log(devicesList);

  const getSelectedSourceDeviceName = () => {
    return (
      devicesList?.find((device: Device) => device.id === selectedSourceDevice)
        ?.name || ""
    );
  };

  const getSelectedTargetDeviceNames = () => {
    return (
      devicesList
        ?.filter((device: Device) => selectedTargetDevices.includes(device.id))
        .map((device: Device) => device.name)
        .join(", ") || ""
    );
  };

  // Reset selections when source device changes
  useEffect(() => {
    setSelectedEmployees([]);
    setSelectedTargetDevices([]);
  }, [selectedSourceDevice]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Source Device Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          {t("Select Source Device")} *
        </label>

        <CustomSelect
          className="w-full"
          placeholder={t("Choose source device")}
          options={deviceOptions}
          value={deviceOptions.find(
            (opt: Option) => opt.value === selectedSourceDevice
          )}
          onChange={(option: Option | null) => {
            setSelectedSourceDevice(option ? (option.value as number) : null);
          }}
          isSearchable
          isClearable
        />

        {selectedSourceDevice && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <strong>{t("Selected Source Device")}:</strong>{" "}
            {getSelectedSourceDeviceName()}
          </div>
        )}
      </div>

      {/* Employee Selection (only show if source device is selected) */}
      {selectedSourceDevice && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {t("Select Employees from Source Device")} *
          </label>

          {isDeviceUsersLoading ? (
            <div className="text-sm text-gray-500">Loading employees...</div>
          ) : deviceEmployeeOptions.length === 0 ? (
            <div className="text-sm text-gray-500">
              No employees found on the selected source device
            </div>
          ) : (
            <>
              <CustomMultiSelect
                className="w-full"
                placeholder={t("Choose employees")}
                options={deviceEmployeeOptions}
                value={deviceEmployeeOptions.filter((opt: Option) =>
                  selectedEmployees.includes(opt.value as number)
                )}
                onChange={(options: Option[]) =>
                  setSelectedEmployees(
                    options.map((opt: Option) => opt.value as number)
                  )
                }
                isSearchable
                isClearable
                showSelectAll
              />

              {selectedEmployees.length > 0 && (
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>{t("Selected")}:</strong> {getSelectedEmployeeNames()}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Arrow Icon */}
      {selectedSourceDevice && selectedEmployees.length > 0 && (
        <div className="flex justify-center">
          <div className="p-2 bg-blue-100 rounded-full">
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      )}

      {/* Target Device Selection (only show if employees are selected) */}
      {selectedSourceDevice && selectedEmployees.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {t("Select Target Devices")} *
          </label>

          <CustomMultiSelect
            className="w-full"
            placeholder={t("Choose target devices")}
            options={deviceOptions.filter(
              (opt: Option) => opt.value !== selectedSourceDevice
            )}
            value={deviceOptions.filter((opt: Option) =>
              selectedTargetDevices.includes(opt.value as number)
            )}
            onChange={(options: Option[]) => {
              const selectedDeviceIds = options.map(
                (opt: Option) => opt.value as number
              );
              setSelectedTargetDevices(selectedDeviceIds);
            }}
            isSearchable
            isClearable
          />

          {selectedTargetDevices.length > 0 && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <strong>{t("Selected Target Devices")}:</strong>{" "}
              {getSelectedTargetDeviceNames()}
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={
            isProcessing ||
            !selectedSourceDevice ||
            selectedEmployees.length === 0 ||
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
