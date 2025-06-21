import { Building } from "lucide-react";
import { Button, NormalSpinner, Popup } from "../../../../components/ui";
import { formatValue } from "../../../../utils";
import { HasPermission } from "../../../../components/auth";
import { useLanguageStore } from "../../../../store/";
import { Entity } from "../../../../interfaces";
import { useTranslation } from "react-i18next";
import { ENTITY_NS } from "../../../../constants";

interface Props {
  isOpen: boolean
  handleClose: () => void;
  handleDeletePopupOpen: () => void;
  handleEditPopupOpen: () => void;
  entity: Entity | null
  isLoading: boolean
}

const ShowPopup = ({ isOpen, handleClose, handleDeletePopupOpen, handleEditPopupOpen, entity, isLoading }: Props) => {
  const { t } = useTranslation([ENTITY_NS]);
  const { language } = useLanguageStore();

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
                <Building size={80} className="text-gray-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{entity?.name}</h2>
            </div>

            {/* Device Information */}
            <div className="mt-6 space-y-4 divide-y divide-gray-300">
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t("table.columns.id")}</span>
                <span className="text-gray-900 font-semibold">{formatValue(entity?.id || "", language)}</span>
              </div>
              <div className="grid grid-cols-1 gap-2 py-2">
                <span className="font-medium text-gray-600">{t("table.columns.description")}</span>
                <span className="text-gray-900 font-semibold">{entity?.description != null ? entity?.description: t("NA")}</span>
              </div>
            </div>
          </div>
        )
      }

      <div className="flex items-center space-x-3 mt-4">
        <HasPermission permission="Update Entity">
          <Button variant="info" type="button" fullWidth={true} onClick={handleEditPopupOpen}>
            {t("buttons.edit")}
          </Button>
        </HasPermission>
        <HasPermission permission="Delete Entity">
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

export default ShowPopup