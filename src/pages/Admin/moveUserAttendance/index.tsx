import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, X } from "lucide-react";
import { Header, SectionHeader, Alert } from "../../../components/ui";
import { MoveUserAttendanceForm, MoveUserAttendanceSummary } from "./views";
import { useMoveUserAttendance, useGetDevicesList } from "../../../hooks";

export interface MoveUserAttendanceData {
  employeeIds: number[];
  sourceDeviceIds: number[];
  targetDeviceIds: number[];
  cut?: boolean;
}

const MoveUserAttendancePage = () => {
  const { t } = useTranslation("moveUserFingerPrint");
  const { moveUserAttendance, isLoading, reset } = useMoveUserAttendance();

  // Get real devices data
  const { devices: devicesList } = useGetDevicesList();

  const [moveData, setMoveData] = useState<MoveUserAttendanceData>({
    employeeIds: [],
    sourceDeviceIds: [],
    targetDeviceIds: [],
    cut: false,
  });
  const [showSummary, setShowSummary] = useState(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        heading={t("moveUserAttendance.pageTitle")}
        subtitle={t("moveUserAttendance.pageSubtitle")}
      />

      {/* Alerts */}
      {error && (
        <Alert
          type="error"
          title={t("moveUserAttendance.errorTitle")}
          description={error}
          icon={<X className="w-5 h-5" />}
        />
      )}

      {/* {success && (
        <Alert
          type="success"
          title={t("moveUserAttendance.successTitle")}
          description={success}
          icon={<CheckCircle className="w-5 h-5" />}
        />
      )} */}

      {!showSummary ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-10 my-5">
          <SectionHeader
            title={t("moveUserAttendance.form.title")}
            description={t("moveUserAttendance.form.description")}
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
    </div>
  );
};

export default MoveUserAttendancePage;
