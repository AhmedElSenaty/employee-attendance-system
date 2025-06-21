import { Fingerprint } from "lucide-react";
import { HasPermission } from "../../../../components/auth";
import { Button, NormalSpinner, Popup } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { DEVICES_NS } from "../../../../constants";
import { Device } from "../../../../interfaces";

interface IShowDevicePopupProps {
  isOpen: boolean
  handleClose: () => void;
  handleDeletePopupOpen: () => void;
  handleEditPopupOpen: () => void;
  device: Device | null
  isLoading: boolean
}

const ShowDevicePopup = ({ isOpen, handleClose, handleDeletePopupOpen, handleEditPopupOpen, device, isLoading }: IShowDevicePopupProps) => {
  const { t } = useTranslation([DEVICES_NS]);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("showPopup.title")}
      description={t("showPopup.description")}
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
                <Fingerprint size={80} className="text-gray-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{device?.device_name}</h2>
            </div>

            {/* Device Information */}
            <div className="mt-6 space-y-4 divide-y divide-gray-300">
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t("table.columns.id")}</span>
                <span className="text-gray-900 font-semibold">{device?.id}</span>
              </div>
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t("table.columns.ip_address")}</span>
                <span className="text-gray-900 font-semibold">{device?.iP_Address}</span>
              </div>
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t("table.columns.port")}</span>
                <span className="text-gray-900 font-semibold">{device?.port}</span>
              </div>
            </div>
          </div>
        )
      }

      <div className="flex items-center space-x-3 mt-4">
        <HasPermission permission="Update Device">
          <Button variant="info" type="button" fullWidth={true} onClick={handleEditPopupOpen}>
            {t("buttons.edit")}
          </Button>
        </HasPermission>
        <HasPermission permission="Delete Device">
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

export default ShowDevicePopup