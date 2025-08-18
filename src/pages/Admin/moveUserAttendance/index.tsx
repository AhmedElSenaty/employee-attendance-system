import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  AlertTriangle,
  Info,
  CheckCircle,
  Monitor,
  Clock,
} from "lucide-react";
import { Button, Header, SectionHeader, Alert } from "../../../components/ui";
import { MoveUserAttendanceForm, MoveUserAttendanceSummary } from "./views";
import { useMoveUserAttendance } from "../../../hooks";
import { DEMO_EMPLOYEES, DEMO_DEVICES } from "../../data/demoData";

export interface MoveUserAttendanceData {
  employeeIds: number[];
  sourceDeviceIds: number[];
  targetDeviceIds: number[];
}

const MoveUserAttendancePage = () => {
  const { t } = useTranslation();
  const {
    moveUserAttendance,
    isLoading,
    error: hookError,
    result,
    reset,
  } = useMoveUserAttendance();

  const [moveData, setMoveData] = useState<MoveUserAttendanceData>({
    employeeIds: [],
    sourceDeviceIds: [],
    targetDeviceIds: [],
  });
  const [showSummary, setShowSummary] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFormSubmit = (data: MoveUserAttendanceData) => {
    setMoveData(data);
    setShowSummary(true);
    setError(null);
    setSuccess(null);
  };

  const handleConfirmMove = async () => {
    setError(null);
    setSuccess(null);

    try {
      const response = await moveUserAttendance(moveData);
      setSuccess(response.message);
      setShowSummary(false);
      setMoveData({
        employeeIds: [],
        sourceDeviceIds: [],
        targetDeviceIds: [],
      });
      reset();
    } catch (err) {
      setError("Failed to move user attendance. Please try again.");
    }
  };

  const handleCancel = () => {
    setShowSummary(false);
    setMoveData({
      employeeIds: [],
      sourceDeviceIds: [],
      targetDeviceIds: [],
    });
    setError(null);
    setSuccess(null);
  };

  const stats = {
    totalEmployees: DEMO_EMPLOYEES.length,
    totalDevices: DEMO_DEVICES.length,
    onlineDevices: DEMO_DEVICES.filter((d) => d.status === "online").length,
    departments: [...new Set(DEMO_EMPLOYEES.map((emp) => emp.department))]
      .length,
  };

  const recentActivity = [
    {
      id: 1,
      action: "Fingerprint transfer completed",
      details: "3 employees moved from Main Entrance to Back Office",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      action: "Device maintenance",
      details: "Warehouse device went offline for maintenance",
      time: "4 hours ago",
      status: "warning",
    },
    {
      id: 3,
      action: "New device added",
      details: "Training Center device added to network",
      time: "1 day ago",
      status: "success",
    },
  ];

  // Demo view
  if (showDemo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header heading={undefined} />

        <div className="container mx-auto px-4 py-8">
          <SectionHeader
            title={t("Move User Attendance - Demo")}
            description={t("Transfer employee fingerprints between devices")}
          />

          {/* Demo Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  {t("Demo Mode")}
                </h3>
                <p className="text-blue-800 mb-4">
                  {t(
                    "This is a demonstration of the Move User Attendance functionality. All data shown is static and no actual transfers will occur."
                  )}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">
                      {stats.totalEmployees}
                    </div>
                    <div className="text-sm text-blue-700">
                      {t("Employees")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">
                      {stats.totalDevices}
                    </div>
                    <div className="text-sm text-blue-700">
                      {t("Total Devices")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">
                      {stats.onlineDevices}
                    </div>
                    <div className="text-sm text-blue-700">
                      {t("Online Devices")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-900">
                      {stats.departments}
                    </div>
                    <div className="text-sm text-blue-700">
                      {t("Departments")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Data Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t("Sample Employees")}
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {DEMO_EMPLOYEES.slice(0, 6).map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <div className="font-medium text-sm">{employee.name}</div>
                      <div className="text-xs text-gray-500">
                        {employee.department}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      ID: {employee.id}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                {t("Sample Devices")}
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {DEMO_DEVICES.slice(0, 6).map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <div className="font-medium text-sm">{device.name}</div>
                      <div className="text-xs text-gray-500">
                        {device.ip}:{device.port}
                      </div>
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded ${
                        device.status === "online"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {device.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t("Recent Activity")}
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded"
                >
                  <div
                    className={`p-1 rounded ${
                      activity.status === "success"
                        ? "bg-green-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    {activity.status === "success" ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.action}</div>
                    <div className="text-xs text-gray-500">
                      {activity.details}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setShowDemo(false)}
              className="px-8 py-3 text-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              {t("Start Move User Attendance")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main functionality view
  return (
    <div className="min-h-screen bg-gray-50">
      <Header heading={undefined} />

      <div className="container mx-auto px-4 py-8">
        <SectionHeader
          title={t("Move User Attendance")}
          description={t("Transfer employee fingerprints between devices")}
        />

        {(error || hookError) && (
          <Alert
            type="error"
            icon={<AlertTriangle className="w-5 h-5" />}
            title={t("Error")}
            description={error || hookError || ""}
          />
        )}

        {success && (
          <Alert
            type="success"
            icon={<CheckCircle className="w-5 h-5" />}
            title={t("Success")}
            description={success}
          />
        )}

        {!showSummary ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("Select Employees and Devices")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t(
                    "Choose employees to move and specify source and target devices"
                  )}
                </p>
              </div>
            </div>

            <MoveUserAttendanceForm
              employees={DEMO_EMPLOYEES}
              devices={DEMO_DEVICES}
              onSubmit={handleFormSubmit}
              isProcessing={isLoading}
            />
          </div>
        ) : (
          <MoveUserAttendanceSummary
            moveData={moveData}
            employees={DEMO_EMPLOYEES}
            devices={DEMO_DEVICES}
            onConfirm={handleConfirmMove}
            onCancel={handleCancel}
            isProcessing={isLoading}
          />
        )}

        {/* Demo Button */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setShowDemo(true)}
            className="px-6 py-2"
          >
            <Info className="w-4 h-4 mr-2" />
            {t("View Demo")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MoveUserAttendancePage;
