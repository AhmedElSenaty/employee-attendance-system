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
  const { t } = useTranslation("moveUserFingerPrint");

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
      cut,
    };

    console.log("Submitting data:", submitData);
    onSubmit(submitData);
  };

  const [cut, setCut] = useState(false);

  // ================================= handle select all target devices ==============================
  // NEW: flag for target "select all"
  const [isAllTargetsSelected, setIsAllTargetsSelected] = useState(false);

  // Keep options for targets (exclude source)
  const availableTargetOptions: Option[] = (deviceOptions || []).filter(
    (opt: Option) => opt.value !== selectedSourceDevice
  );

  // NEW: select-all handler for targets
  const handleSelectAllTargets = () => {
    if (isAllTargetsSelected) {
      setSelectedTargetDevices([]);
    } else {
      setSelectedTargetDevices(
        availableTargetOptions.map((opt: Option) => opt.value as number)
      );
    }
    setIsAllTargetsSelected(!isAllTargetsSelected);
  };

  // Reset when source device changes (you already reset targets; also reset the flag)
  useEffect(() => {
    setSelectedEmployees([]);
    setSelectedTargetDevices([]);
    setIsAllTargetsSelected(false); // NEW
  }, [selectedSourceDevice]);

  // Reset selections when source device changes
  useEffect(() => {
    setSelectedEmployees([]);
    setSelectedTargetDevices([]);
  }, [selectedSourceDevice]);

  // ================================= handle select all employees ==============================

  // NEW: select-all flag for employees
  const [isAllEmployeesSelected, setIsAllEmployeesSelected] = useState(false);

  // Employees available for selection (from the chosen source)
  const availableEmployeeOptions: Option[] = deviceEmployeeOptions;

  // Toggle all employees
  const handleSelectAllEmployees = () => {
    if (isAllEmployeesSelected) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(
        availableEmployeeOptions.map((opt: Option) => opt.value as number)
      );
    }
    setIsAllEmployeesSelected(!isAllEmployeesSelected);
  };

  // Keep flags clean when source changes (you already reset selections)
  useEffect(() => {
    setIsAllEmployeesSelected(false);
  }, [selectedSourceDevice]);

  // If the device users list changes (after fetch), resync the flag
  useEffect(() => {
    setIsAllEmployeesSelected(
      availableEmployeeOptions.length > 0 &&
        selectedEmployees.length === availableEmployeeOptions.length
    );
  }, [deviceUsers, availableEmployeeOptions.length, selectedEmployees.length]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Source Device Selection */}
      <div className="space-y-3 py-5">
        <label className="block text-sm font-medium text-gray-700">
          {t("moveUserAttendance.placeholders.chooseSourceDevice")} *
        </label>

        <CustomSelect
          className="w-full"
          placeholder={t("select")}
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
        {/* 
        {selectedSourceDevice && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <strong>{t("Selected Source Device")}:</strong>{" "}
            {getSelectedSourceDeviceName()}
          </div>
        )} */}
      </div>

      {/* Employee Selection (only show if source device is selected) */}
      {selectedSourceDevice && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {t("moveUserAttendance.form.selectEmployeesFromSource")} *
          </label>

          {isDeviceUsersLoading ? (
            <div className="text-sm text-gray-500">Loading employees...</div>
          ) : availableEmployeeOptions.length === 0 ? (
            <div className="text-sm text-gray-500">
              {t("moveUserAttendance.states.noEmployeesFoundOnSource")}
            </div>
          ) : (
            <>
              {/* NEW: Select All checkbox for employees */}
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  disabled={availableEmployeeOptions.length === 0}
                  checked={
                    availableEmployeeOptions.length > 0 &&
                    selectedEmployees.length === availableEmployeeOptions.length
                  }
                  onChange={handleSelectAllEmployees}
                />
                <span className="text-sm">
                  {t(
                    "moveUserAttendance.form.selectAllEmployees",
                    "Select all employees"
                  )}
                </span>
              </div>

              <CustomMultiSelect
                className="w-full"
                placeholder={t("select")}
                options={availableEmployeeOptions}
                value={availableEmployeeOptions.filter((opt: Option) =>
                  selectedEmployees.includes(opt.value as number)
                )}
                onChange={(options: Option[]) => {
                  const newSelected = options.map(
                    (opt: Option) => opt.value as number
                  );
                  setSelectedEmployees(newSelected);

                  // Keep select-all checkbox in sync
                  setIsAllEmployeesSelected(
                    newSelected.length === availableEmployeeOptions.length &&
                      availableEmployeeOptions.length > 0
                  );
                }}
                isSearchable
                isClearable
                // You can keep/remove showSelectAll if your component supports it,
                // but the external checkbox is now the source of truth.
              />
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
            {t("moveUserAttendance.placeholders.chooseTargetDevices")} *
          </label>

          {/* NEW: Select All checkbox for target devices */}
          <div className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              className="form-checkbox"
              disabled={availableTargetOptions.length === 0}
              checked={
                availableTargetOptions.length > 0 &&
                selectedTargetDevices.length === availableTargetOptions.length
              }
              onChange={handleSelectAllTargets}
            />
            <span className="text-sm">
              {t(
                "moveUserAttendance.form.selectAllTargets",
                "Select all target devices"
              )}
            </span>
          </div>

          <CustomMultiSelect
            className="w-full"
            placeholder={t("select")}
            options={availableTargetOptions}
            value={availableTargetOptions.filter((opt: Option) =>
              selectedTargetDevices.includes(opt.value as number)
            )}
            onChange={(options: Option[]) => {
              const selectedIds = options.map(
                (opt: Option) => opt.value as number
              );
              setSelectedTargetDevices(selectedIds);

              // Keep select-all checkbox in sync
              setIsAllTargetsSelected(
                selectedIds.length === availableTargetOptions.length &&
                  availableTargetOptions.length > 0
              );
            }}
            isSearchable
            isClearable
          />
        </div>
      )}

      <label className="flex items-center space-x-2 mt-4">
        <input
          type="checkbox"
          checked={cut}
          onChange={(e) => setCut(e.target.checked)}
          className="form-checkbox"
        />
        <span>{t("moveUserAttendance.form.cutCheckboxLabel")}</span>
      </label>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        {/* <Button
          type="submit"
          variant="secondary"
          disabled={
            isProcessing ||
            !selectedSourceDevice ||
            selectedEmployees.length === 0 ||
            selectedTargetDevices.length === 0
          }
          isLoading={isProcessing}
          className="px-6 py-2"
        >
          {isProcessing
            ? t("moveUserAttendance.states.processing")
            : t("moveUserAttendance.states.reviewMoveOperation")}
        </Button> */}

        <div className="flex flex-col items-end pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={
              isProcessing ||
              !selectedSourceDevice ||
              selectedEmployees.length === 0 ||
              selectedTargetDevices.length === 0
            }
            isLoading={isProcessing}
            className="
                        px-8 py-3 rounded-xl shadow-md transition-transform duration-200 hover:scale-105
                        disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed
                      "
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                {t("moveUserAttendance.states.processing")}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {t("moveUserAttendance.states.reviewMoveOperation")}
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>

          {/* Inline helper text */}
          {(!selectedSourceDevice ||
            selectedEmployees.length === 0 ||
            selectedTargetDevices.length === 0) && (
            <p className="mt-2 text-xs text-red-500">
              {!selectedSourceDevice
                ? t(
                    "moveUserAttendance.hints.selectSourceFirst",
                    "⚠️ Please select a source device"
                  )
                : !selectedEmployees.length
                ? t(
                    "moveUserAttendance.hints.selectEmployeesFirst",
                    "⚠️ Please select at least one employee"
                  )
                : t(
                    "moveUserAttendance.hints.selectTargetsFirst",
                    "⚠️ Please select at least one target device"
                  )}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};
