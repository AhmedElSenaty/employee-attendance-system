import { Bed } from "lucide-react";
import { NormalSpinner, Button, Popup } from "../../../../components/ui/";
import { useLanguageStore } from "../../../../store/";
import { useTranslation } from "react-i18next";
import { formatValue } from "../../../../utils";
import { SICK_REQUESTS_NS } from "../../../../constants";
import { ISickRequestData } from "../../../../interfaces";
import { RequestStatusType } from "../../../../enums";

interface IShowPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleAcceptPopupOpen: (id: number) => void;
  handleRejectPopupOpen: (id: number) => void;
  sickRequest: ISickRequestData | null;
  isLoading: boolean;
}

const ShowPopup = ({
  isOpen,
  handleClose,
  handleAcceptPopupOpen,
  handleRejectPopupOpen,
  sickRequest,
  isLoading,
}: IShowPopupProps) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation(SICK_REQUESTS_NS);
  const handleOpenFile = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };
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
              <Bed size={80} className="text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {t("showPopup.fields.numberOfDays")}{" "}
              {formatValue(sickRequest?.numberOfDays || 0, language)}
            </h2>
          </div>

          <div className="mt-6 space-y-4 divide-y divide-gray-300">
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("showPopup.fields.employeeId")}
              </span>
              <span className="text-gray-900 font-semibold">
                {formatValue(sickRequest?.employeeId || 0, language)}
              </span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("showPopup.fields.employeeName")}
              </span>
              <span className="text-gray-900 font-semibold">
                {sickRequest?.employeeName}
              </span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("showPopup.fields.id")}
              </span>
              <span className="text-gray-900 font-semibold">
                {formatValue(sickRequest?.requestId || 0, language)}
              </span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("showPopup.fields.startDate")}
              </span>
              <span className="text-gray-900 font-semibold">
                {new Date(sickRequest?.requestedAt || "").toLocaleString(
                  language === "ar" ? "ar-EG" : "en-CA",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("showPopup.fields.endDate")}
              </span>
              <span className="text-gray-900 font-semibold">
                {new Date(sickRequest?.endDate || "").toLocaleDateString(
                  language === "ar" ? "ar-EG" : "en-CA"
                )}
              </span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("showPopup.fields.requestedAt")}
              </span>
              <span className="text-gray-900 font-semibold">
                {new Date(sickRequest?.requestedAt || "").toLocaleDateString(
                  language === "ar" ? "ar-EG" : "en-CA"
                )}
              </span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("showPopup.fields.status")}
              </span>
              <span className="text-gray-900 font-semibold">
                {t(`status.${sickRequest?.status as number}`)}
              </span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("showPopup.fields.permitApproval")}
              </span>
              <span className="text-gray-900 font-semibold">
                {sickRequest?.permitApproval}
              </span>
            </div>
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("showPopup.fields.description")}
              </span>
              <span className="text-gray-900 font-semibold">
                {sickRequest?.description}
              </span>
            </div>
            {sickRequest?.comment && (
              <div className="grid grid-cols-2 py-2">
                <span className="font-medium text-gray-600">
                  {t("showPopup.fields.comment")}
                </span>
                <span className="text-gray-900 font-semibold">
                  {sickRequest?.comment}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 mt-4">
        <Button variant="cancel" type="button" fullWidth onClick={handleClose}>
          {t("showPopup.buttons.close")}
        </Button>
        <Button
          variant="info"
          fullWidth
          onClick={() => handleOpenFile(sickRequest?.file || "")}
        >
          {t("showPopup.buttons.openReport")}
        </Button>
        {sickRequest?.status == RequestStatusType.Pending && (
          <>
            <Button
              variant="success"
              fullWidth
              onClick={() => handleAcceptPopupOpen(sickRequest?.requestId)}
            >
              {t("showPopup.buttons.accept")}
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => handleRejectPopupOpen(sickRequest?.requestId)}
            >
              {t("showPopup.buttons.reject")}
            </Button>
          </>
        )}
      </div>
    </Popup>
  );
};

export default ShowPopup;
