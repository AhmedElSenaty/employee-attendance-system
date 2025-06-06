import { Popup } from "../../../../components/ui/Popup"
import { TFunction } from "i18next";
import { TreePalm } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { NormalSpinner } from "../../../../components/ui/Spinner";
import { IOfficialVacationData } from "../../../../interfaces";
import { OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE } from "..";
import { HasPermission } from "../../../../components/auth";
import { useLanguageStore } from "../../../../store/language.store";

interface IShowOfficialVacationPopupProps {
  isOpen: boolean
  handleClose: () => void;
  handleDeletePopupOpen: () => void;
  handleEditPopupOpen: () => void;
  officialVacation: IOfficialVacationData | null
  t: TFunction
  isLoading: boolean
}

const ShowOfficialVacationPopup = ({ isOpen, handleClose, handleDeletePopupOpen, handleEditPopupOpen, officialVacation, t, isLoading }: IShowOfficialVacationPopupProps) => {
    const { language } = useLanguageStore();

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.show.title", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
      description={t("popup.show.description", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
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
                <TreePalm size={80} className="text-gray-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{officialVacation?.name}</h2>
            </div>

            {/* Device Information */}
            <div className="mt-6 space-y-4 divide-y divide-gray-300">
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t("table.columns.id", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}</span>
                <span className="text-gray-900 font-semibold">{officialVacation?.id}</span>
              </div>
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t("table.columns.startDate", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}</span>
                <span className="text-gray-900 font-semibold">{new Date(officialVacation?.startDate || "").toLocaleDateString(language == "ar" ? "ar-EG" : "en-CA")}</span>
              </div>
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t("table.columns.endDate", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}</span>
                <span className="text-gray-900 font-semibold">{new Date(officialVacation?.endDate || "").toLocaleDateString(language == "ar" ? "ar-EG" : "en-CA")}</span>
              </div>
            </div>
          </div>
        )
      }

      <div className="flex items-center space-x-3 mt-4">
        <HasPermission permission="Update Official Vacation">
          <Button variant="info" type="button" fullWidth={true} onClick={handleEditPopupOpen}>
            {t("popup.show.editButton", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
          </Button>
        </HasPermission>
        <HasPermission permission="Delete Official Vacation">
          <Button variant="danger" type="button" fullWidth={true} onClick={handleDeletePopupOpen}>
            {t("popup.show.deleteButton", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
          </Button>
        </HasPermission>
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("popup.show.closeButton", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
        </Button>
      </div>
    </Popup>
  )
}

export default ShowOfficialVacationPopup