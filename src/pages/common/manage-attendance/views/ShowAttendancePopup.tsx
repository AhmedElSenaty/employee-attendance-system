import { TFunction } from "i18next";
import { AlertTriangle, CalendarSearch, CheckCircle } from "lucide-react";
import { IAttendanceData } from "../../../../interfaces";
import { Popup, Button, NormalSpinner, StatusBadge } from "../../../../components/ui";
import { ATTENDANCE_TRANSLATION_NAMESPACE } from "..";
import { HasPermission } from "../../../../components/auth";

interface IShowAttendancePopupProps {
  isOpen: boolean
  handleClose: () => void;
  handleDeletePopupOpen: () => void;
  handleEditPopupOpen: () => void;
  attendance: IAttendanceData
  t: TFunction
  isLoading: boolean
}

const ShowAttendancePopup = ({ isOpen, handleClose, handleDeletePopupOpen, handleEditPopupOpen, attendance, t, isLoading }: IShowAttendancePopupProps) => {
  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.viewAttendance.title", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
      description={t("popup.viewAttendance.description", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
    >
      {/* Device Details */}
      {
        isLoading ? (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg flex items-center justify-center min-h-[100px]">
            <NormalSpinner /> 
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg">
            {/* Device Icon */}
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-gray-200 p-4 rounded-full">
                <CalendarSearch size={80} className="text-gray-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{attendance?.empName}</h2>
            </div>

            {/* Device Information */}
            <div className="mt-6 space-y-4 divide-y divide-gray-300">
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t("table.columns.id", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</span>
                <span className="text-gray-900 font-semibold">{attendance?.id}</span>
              </div>
              <div className="grid grid-cols-1 py-2">
                <div className="grid grid-cols-2 py-1">
                  <span className="font-medium text-gray-600">{t("table.columns.deviceId", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</span>
                  <span className="text-gray-900 font-semibold">{attendance?.deviceId}</span>
                </div>
                <div className="grid grid-cols-2 py-1">
                  <span className="font-medium text-gray-600">{t("table.columns.deviceName", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</span>
                  <span className="text-gray-900 font-semibold">{attendance?.deviceName}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 py-2">
                <div className="grid grid-cols-2 py-1">
                  <span className="font-medium text-gray-600">{t("table.columns.employeeId", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</span>
                  <span className="text-gray-900 font-semibold">{attendance?.employeeId}</span>
                </div>
                <div className="grid grid-cols-2 py-1">
                  <span className="font-medium text-gray-600">{t("table.columns.empName", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</span>
                  <span className="text-gray-900 font-semibold">{attendance?.empName}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t("table.columns.attendanceDate", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</span>
                <span className="text-gray-900 font-semibold">{attendance?.attendanceDate}</span>
              </div>
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t("table.columns.attendanceTime", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</span>
                <span className="text-gray-900 font-semibold">{attendance?.attendanceTime}</span>
              </div>
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t("table.columns.status", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</span>
                <StatusBadge
                  variant={attendance?.status == "حضور" ? "success" : "warning"}
                  size={"medium"}
                  icon={attendance?.status ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  >
                  {attendance?.status}
                </StatusBadge>
              </div>

              <div className="grid grid-cols-1 py-2">
                <div className="grid grid-cols-2 py-1">
                  <span className="font-medium text-gray-600">{t("table.columns.department", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</span>
                  <span className="text-gray-900 font-semibold">{attendance?.department}</span>
                </div>
                <div className="grid grid-cols-2 py-1">
                  <span className="font-medium text-gray-600">{t("table.columns.subdepartment", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</span>
                  <span className="text-gray-900 font-semibold">{attendance?.subdepartment}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 py-2">
                <div className="grid grid-cols-2 py-1">
                  <span className="font-medium text-gray-600">{t("table.columns.delegeteDepartment", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</span>
                  <span className="text-gray-900 font-semibold">{attendance?.delegeteDepartment}</span>
                </div>
                <div className="grid grid-cols-2 py-1">
                  <span className="font-medium text-gray-600">{t("table.columns.delegeteSubdepartment", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</span>
                  <span className="text-gray-900 font-semibold">{attendance?.delegeteSubdepartment}</span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      <div className="flex items-center space-x-3 mt-4">
        <HasPermission permission="Update Attendance">
          <Button variant="info" type="button" fullWidth={true} onClick={handleEditPopupOpen}>
            {t("buttons.edit")}
          </Button>
        </HasPermission>
        <HasPermission permission="Delete Attendance">
          <Button variant="danger" type="button" fullWidth={true} onClick={handleDeletePopupOpen}>
            {t("buttons.delete")}
          </Button>
        </HasPermission>
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("buttons.close")}
        </Button>
      </div>
    </Popup>
  )
}

export default ShowAttendancePopup