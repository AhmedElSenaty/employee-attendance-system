import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, Monitor, Clock, X } from "lucide-react";
import { Button, Header, SectionHeader, Alert } from "../../../components/ui";
import { MoveUserAttendanceForm, MoveUserAttendanceSummary } from "./views";
import { useMoveUserAttendance, useGetDevicesList } from "../../../hooks";
import { DEMO_DEVICES } from "../../data/demoData";

export interface MoveUserAttendanceData {
  employeeIds: number[];
  sourceDeviceIds: number[];
  targetDeviceIds: number[];
}

const MoveUserAttendancePage = () => {
  const { t } = useTranslation();
  const { moveUserAttendance, isLoading, reset } = useMoveUserAttendance();

  // Get real devices data
  const { devices: devicesList } = useGetDevicesList();

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
    console.log("Form submitted, showing summary with data:", data);
    setMoveData(data);
    setShowSummary(true);
    setError(null);
    setSuccess(null);
  };

  const handleConfirmMove = async () => {
    console.log("Confirm move clicked with data:", moveData);
    setError(null);
    setSuccess(null);

    try {
      const response = await moveUserAttendance(moveData);
      console.log("Move operation successful:", response);
      setSuccess(
        response.data?.message || "User attendance moved successfully!"
      );
      setShowSummary(false);
      setMoveData({
        employeeIds: [],
        sourceDeviceIds: [],
        targetDeviceIds: [],
      });
      reset();
    } catch (err) {
      console.error("Move operation failed:", err);
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
    totalDevices: DEMO_DEVICES.length,
    onlineDevices: DEMO_DEVICES.filter((d) => d.status === "online").length,
  };

  const recentActivity = [
    {
      id: 1,
      type: "move",
      description: "Moved 5 employees from Device A to Device B",
      timestamp: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "move",
      description: "Moved 3 employees from Device C to Device D",
      timestamp: "1 day ago",
      status: "completed",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        heading={t("Move User Attendance")}
        subtitle={t("Transfer employee fingerprints between devices")}
      />

      {/* Alerts */}
      {error && (
        <Alert
          type="error"
          title={t("Error")}
          description={error}
          icon={<X className="w-5 h-5" />}
        />
      )}

      {success && (
        <Alert
          type="success"
          title={t("Success")}
          description={success}
          icon={<CheckCircle className="w-5 h-5" />}
        />
      )}

      {!showSummary ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <SectionHeader
            title={t("Move User Attendance")}
            description={t(
              "Select employees and devices for the transfer operation"
            )}
          />

          <MoveUserAttendanceForm
            onSubmit={handleFormSubmit}
            isProcessing={isLoading}
          />
        </div>
      ) : (
        <MoveUserAttendanceSummary
          moveData={moveData}
          devices={devicesList || []}
          onConfirm={handleConfirmMove}
          onCancel={handleCancel}
          isProcessing={isLoading}
        />
      )}

      {/* Demo Button */}
      <div className="mt-6">
        <Button
          variant="outline"
          onClick={() => setShowDemo(!showDemo)}
          className="text-sm"
        >
          {showDemo ? t("Hide Demo") : t("Show Demo")}
        </Button>
      </div>

      {/* Demo View */}
      {showDemo && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <SectionHeader
            title={t("Demo View")}
            description={t("This is how the move operation will work")}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">
                  {t("Total Devices")}
                </h3>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {stats.totalDevices}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">
                  {t("Online Devices")}
                </h3>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {stats.onlineDevices}
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-orange-900">
                  {t("Recent Activity")}
                </h3>
              </div>
              <p className="text-2xl font-bold text-orange-700">
                {recentActivity.length}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              {t("Recent Move Operations")}
            </h4>
            <div className="space-y-2">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.timestamp}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoveUserAttendancePage;
