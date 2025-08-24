import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import {
  Button,
  CustomMultiSelect,
  CustomSelect,
} from "../../../../components/ui";
import {
  useGetDevicesList,
  useGetDevicesWithIPList,
  useGetDeviceUsersByDeviceId,
} from "../../../../hooks";
import { EmployeeSummary } from "../../../../interfaces";
import { MoveUserAttendanceData } from "..";

interface Device {
  id: number;
  name: string;
  ip: string;
  port: number;
}

interface Option {
  value: number;
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

  // Devices
  const { devices: devicesList } = useGetDevicesWithIPList();

  // State
  const [selectedSourceDevice, setSelectedSourceDevice] = useState<
    number | null
  >(null);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectedTargetDevices, setSelectedTargetDevices] = useState<number[]>(
    []
  );
  const [cut, setCut] = useState(false);

  // Users on the selected source device
  const { deviceUsers, isLoading: isDeviceUsersLoading } =
    useGetDeviceUsersByDeviceId(selectedSourceDevice || 0);

  // Helpers
  const getIpById = (id: number | null) =>
    devicesList?.find((d: Device) => d.id === id)?.ip ?? null;

  // Options
  const deviceOptions: Option[] =
    devicesList?.map((device: Device) => ({
      value: device.id,
      label: `${device.name} (${device.ip})`,
    })) || [];

  const deviceEmployeeOptions: Option[] =
    deviceUsers?.map((u: EmployeeSummary) => ({
      value: u.id,
      label: u.name,
      subLabel: `${u.id}`,
    })) || [];

  // Select All (Employees)
  const [isAllEmployeesSelected, setIsAllEmployeesSelected] = useState(false);
  const handleSelectAllEmployees = () => {
    if (isAllEmployeesSelected) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(deviceEmployeeOptions.map((opt) => opt.value));
    }
    setIsAllEmployeesSelected(!isAllEmployeesSelected);
  };

  // Target options (exclude current source)
  const availableTargetOptions: Option[] = (deviceOptions || []).filter(
    (opt) => opt.value !== selectedSourceDevice
  );

  // Select All (Targets)
  const [isAllTargetsSelected, setIsAllTargetsSelected] = useState(false);
  const handleSelectAllTargets = () => {
    if (isAllTargetsSelected) {
      setSelectedTargetDevices([]);
    } else {
      setSelectedTargetDevices(availableTargetOptions.map((opt) => opt.value));
    }
    setIsAllTargetsSelected(!isAllTargetsSelected);
  };

  // Reset selections when source changes
  useEffect(() => {
    setSelectedEmployees([]);
    setSelectedTargetDevices([]);
    setIsAllEmployeesSelected(false);
    setIsAllTargetsSelected(false);
  }, [selectedSourceDevice]);

  // Sync employees "select all" checkbox with list
  useEffect(() => {
    setIsAllEmployeesSelected(
      deviceEmployeeOptions.length > 0 &&
        selectedEmployees.length === deviceEmployeeOptions.length
    );
  }, [deviceUsers, deviceEmployeeOptions.length, selectedEmployees.length]);

  // Submit → map IDs → IPs
  // Submit → keep names, but send IPs inside them
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    // resolve IDs -> IPs
    const sourceIp = getIpById(selectedSourceDevice);
    const targetIps = selectedTargetDevices
      .map((id) => getIpById(id))
      .filter((ip): ip is string => Boolean(ip));

    if (!sourceIp) {
      alert(t("Could not resolve source device IP"));
      return;
    }
    if (targetIps.length === 0) {
      alert(t("Could not resolve target device IPs"));
      return;
    }

    // ⚠️ keep the SAME property NAMES, but fill them with IP STRINGS
    // If your MoveUserAttendanceData types are number[], this cast keeps TS quiet.
    const submitData: MoveUserAttendanceData = {
      employeeIds: selectedEmployees,
      sourceDeviceIds: [sourceIp] as unknown as number[], // sending ["192.168.1.10"]
      targetDeviceIds: targetIps as unknown as number[], // sending ["192.168.1.20", ...]
      cut,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Source Device */}
      <div className="space-y-3 py-5">
        <label className="block text-sm font-medium text-gray-700">
          {t("moveUserAttendance.placeholders.chooseSourceDevice")} *
        </label>

        <CustomSelect
          className="w-full"
          placeholder={t("select")}
          options={deviceOptions}
          value={
            deviceOptions.find((opt) => opt.value === selectedSourceDevice) ||
            null
          }
          onChange={(option: Option | null) =>
            setSelectedSourceDevice(option ? option.value : null)
          }
          isSearchable
          isClearable
        />
      </div>

      {/* Employees */}
      {selectedSourceDevice && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {t("moveUserAttendance.form.selectEmployeesFromSource")} *
          </label>

          {isDeviceUsersLoading ? (
            <div className="text-sm text-gray-500">Loading employees...</div>
          ) : deviceEmployeeOptions.length === 0 ? (
            <div className="text-sm text-gray-500">
              {t("moveUserAttendance.states.noEmployeesFoundOnSource")}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  disabled={deviceEmployeeOptions.length === 0}
                  checked={
                    deviceEmployeeOptions.length > 0 &&
                    selectedEmployees.length === deviceEmployeeOptions.length
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
                options={deviceEmployeeOptions}
                value={deviceEmployeeOptions.filter((opt) =>
                  selectedEmployees.includes(opt.value)
                )}
                onChange={(options: Option[]) => {
                  const newSelected = options.map((opt) => opt.value);
                  setSelectedEmployees(newSelected);
                  setIsAllEmployeesSelected(
                    newSelected.length === deviceEmployeeOptions.length &&
                      deviceEmployeeOptions.length > 0
                  );
                }}
                isSearchable
                isClearable
              />
            </>
          )}
        </div>
      )}

      {/* Arrow */}
      {selectedSourceDevice && selectedEmployees.length > 0 && (
        <div className="flex justify-center">
          <div className="p-2 bg-blue-100 rounded-full">
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      )}

      {/* Targets */}
      {selectedSourceDevice && selectedEmployees.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {t("moveUserAttendance.placeholders.chooseTargetDevices")} *
          </label>

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
            value={availableTargetOptions.filter((opt) =>
              selectedTargetDevices.includes(opt.value)
            )}
            onChange={(options: Option[]) => {
              const selectedIds = options.map((opt) => opt.value);
              setSelectedTargetDevices(selectedIds);
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

      {/* Cut */}
      <label className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          checked={cut}
          onChange={(e) => setCut(e.target.checked)}
          className="form-checkbox"
        />
        <span>{t("moveUserAttendance.form.cutCheckboxLabel")}</span>
      </label>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <div className="flex flex-col items-end">
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
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                {t("moveUserAttendance.states.processing")}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {t("moveUserAttendance.states.reviewMoveOperation")}
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>

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
