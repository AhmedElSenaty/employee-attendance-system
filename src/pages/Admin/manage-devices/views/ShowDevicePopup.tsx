import { Popup } from "../../../../components/ui/Popup"
import { TFunction } from "i18next";
import { Fingerprint } from "lucide-react";
import { IDeviceData } from "../../../../interfaces";
import { DEVICE_TRANSLATION_NAMESPACE } from "..";
import { HasPermission } from "../../../../components/auth";
import { Button, NormalSpinner } from "../../../../components/ui";

interface IShowDevicePopupProps {
  isOpen: boolean
  handleClose: () => void;
  handleDeletePopupOpen: () => void;
  handleEditPopupOpen: () => void;
  device: IDeviceData | null
  t: TFunction
  isLoading: boolean
}

const ShowDevicePopup = ({ isOpen, handleClose, handleDeletePopupOpen, handleEditPopupOpen, device, t, isLoading }: IShowDevicePopupProps) => {

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.show.title", { ns: DEVICE_TRANSLATION_NAMESPACE })}
      description={t("popup.show.description", { ns: DEVICE_TRANSLATION_NAMESPACE })}
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
                <span className="font-medium text-gray-600">{t("table.columns.id", { ns: DEVICE_TRANSLATION_NAMESPACE })}</span>
                <span className="text-gray-900 font-semibold">{device?.id}</span>
              </div>
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t("table.columns.ip_address", { ns: DEVICE_TRANSLATION_NAMESPACE })}</span>
                <span className="text-gray-900 font-semibold">{device?.iP_Address}</span>
              </div>
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t("table.columns.port", { ns: DEVICE_TRANSLATION_NAMESPACE })}</span>
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