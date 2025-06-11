import { CalendarCheck } from "lucide-react";
import { NormalSpinner, Button, Popup } from "../../../../components/ui/";
import { useLanguageStore } from "../../../../store/language.store";
import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "..";
import { formatValue } from "../../../../utils";
import { IMissionRequestData } from "../../../../interfaces";

interface IShowPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  missionRequest: IMissionRequestData | null;
  isLoading: boolean;
}

const ShowPopup = ({
  isOpen,
  handleClose,
  missionRequest,
  isLoading,
}: IShowPopupProps) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation(TRANSLATION_NAMESPACE);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("showPopup.title")}
      description={t("showPopup.description")}
    >
      {isLoading ? (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg flex items-center justify-center min-h-[100px]">
          <NormalSpinner />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg">
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-gray-200 p-4 rounded-full">
              <CalendarCheck size={80} className="text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {t("showPopup.fields.missionAt")} {new Date(missionRequest?.date || "").toLocaleDateString(language === "ar" ? "ar-EG" : "en-CA")}
            </h2>
          </div>

          <div className="mt-6 space-y-4 divide-y divide-gray-300">
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">{t("showPopup.fields.employeeId")}</span>
              <span className="text-gray-900 font-semibold">{formatValue(missionRequest?.employeeId || 0, language)}</span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">{t("showPopup.fields.employeeName")}</span>
              <span className="text-gray-900 font-semibold">{missionRequest?.employeeName}</span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">{t("showPopup.fields.id")}</span>
              <span className="text-gray-900 font-semibold">{formatValue(missionRequest?.id || 0, language)}</span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">{t("showPopup.fields.requestedAt")}</span>
              <span className="text-gray-900 font-semibold">
                {new Date(missionRequest?.requestedAt || "").toLocaleDateString(language === "ar" ? "ar-EG" : "en-CA")}
              </span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">{t("showPopup.fields.type")}</span>
              <span className="text-gray-900 font-semibold">{t(`timeType.${missionRequest?.type as number}`)}</span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">{t("showPopup.fields.status")}</span>
              <span className="text-gray-900 font-semibold">{t(`status.${missionRequest?.status as number}`)}</span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">{t("showPopup.fields.description")}</span>
              <span className="text-gray-900 font-semibold">{missionRequest?.description}</span>
            </div>
            {missionRequest?.comment && (
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">{t("showPopup.fields.comment")}</span>
                <span className="text-gray-900 font-semibold">{missionRequest?.comment}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 mt-4">
        <Button variant="cancel" type="button" fullWidth onClick={handleClose}>
          {t("showPopup.buttons.close")}
        </Button>
      </div>
    </Popup>
  );
};

export default ShowPopup;
