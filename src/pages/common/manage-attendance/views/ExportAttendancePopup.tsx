import { TFunction } from "i18next";
import { Button } from "../../../../components/ui/Button";
import { Popup } from "../../../../components/ui/Popup";
import { AlertTriangle, CheckCircle, Fingerprint } from "lucide-react";
import { StatusBadge } from "../../../../components/ui/StatusBadge";
import { ATTENDANCE_TRANSLATION_NAMESPACE } from "..";

interface IExportAttendancePopupProps {
  isOpen: boolean
  handleClose: () => void;
  handleDownload: () => void;
  filteredData: {
    searchKey: string,
    search: string,
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string,
    status: string,
    searchByDepartmentId: number,
    searchBySubDeptartmentId: number
  },
  isLoading: boolean
  t: TFunction
}

const ExportAttendancePopup = ({ isOpen, handleClose, handleDownload, filteredData, isLoading, t }: IExportAttendancePopupProps) => {
  
  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.exportAttendance.title", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
      description={t("popup.exportAttendance.description", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
    >
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg">
        {/* Device Icon */}
        <div className="flex flex-col items-center space-y-3">
          <div className="bg-gray-200 p-4 rounded-full">
            <Fingerprint size={80} className="text-gray-600" />
          </div>
        </div>

        {/* Device Information */}
        <div className="mt-6 space-y-4 divide-y divide-gray-300">
          {
            filteredData.searchKey != "" && filteredData.search != "" && (
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t(`searchBy.${filteredData.searchKey}`, { ns: ATTENDANCE_TRANSLATION_NAMESPACE }) ?? ""}</span>
                <span className="text-gray-900 font-semibold">{filteredData.search}</span>
              </div>
            )
          }
          {
            filteredData.searchByDepartmentId != 0 && (
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t(`searchBy.searchByDepartmentId`, { ns: ATTENDANCE_TRANSLATION_NAMESPACE }) ?? ""}</span>
                <span className="text-gray-900 font-semibold">{filteredData.searchByDepartmentId}</span>
              </div>
            )
          }
          {
            filteredData.searchBySubDeptartmentId != 0 && (
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t(`searchBy.SearchBySubDeptartmentId`, { ns: ATTENDANCE_TRANSLATION_NAMESPACE }) ?? ""}</span>
                <span className="text-gray-900 font-semibold">{filteredData.searchBySubDeptartmentId}</span>
              </div>
            )
          }
          <div className="grid grid-cols-1 py-2">
            {
              filteredData.startDate != "" && (
                <div className="grid grid-cols-2 py-1">
                  <span className="font-medium text-gray-600">{t("dateAndTime.startDate")}</span>
                  <span className="text-gray-900 font-semibold">{filteredData.startDate}</span>
                </div>
              )
            }
            {
              filteredData.endDate != "" && (
                <div className="grid grid-cols-2 py-1">
                  <span className="font-medium text-gray-600">{t("dateAndTime.endDate")}</span>
                  <span className="text-gray-900 font-semibold">{filteredData.endDate}</span>
                </div>
              )
            }
          </div>
          <div className="grid grid-cols-1 py-2">
            {
              filteredData.startTime != "" && (
                <div className="grid grid-cols-2 py-1">
                  <span className="font-medium text-gray-600">{t("dateAndTime.startTime")}</span>
                  <span className="text-gray-900 font-semibold">{filteredData.startTime}</span>
                </div>
              )
            }
            {
              filteredData.endTime != "" && (
                <div className="grid grid-cols-2 py-1">
                  <span className="font-medium text-gray-600">{t("dateAndTime.endTime")}</span>
                  <span className="text-gray-900 font-semibold">{filteredData.endTime}</span>
                </div>
              )
            }
          </div>
          {
            filteredData.status != "" && (
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t("status")}</span>
                <StatusBadge
                  variant={filteredData.status == "حضور" ? "success" : "warning"}
                  size={"medium"}
                  icon={filteredData.status ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  >
                  {filteredData.status}
                </StatusBadge>
              </div>
            )
          }
        </div>
      </div>

      <div className="flex items-center space-x-3 mt-4">
        <Button variant="success" type="button" fullWidth={true} onClick={handleDownload} isLoading={isLoading}>
          {t("buttons.download")}
        </Button>
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("buttons.close")}
        </Button>
      </div>
    </Popup>
  )
}

export default ExportAttendancePopup