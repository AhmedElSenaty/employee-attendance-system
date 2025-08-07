import { Button, NormalSpinner, Popup } from "../../../../components/ui";
import { formatValue } from "../../../../utils";
import { HasPermission } from "../../../../components/auth";
import { useLanguageStore } from "../../../../store/";
import { useTranslation } from "react-i18next";
import { ChangeVacationCountsRequestDto } from "../../../../interfaces/changeVacationCountRequests";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleDeletePopupOpen: () => void;
  handleEditPopupOpen: () => void;
  request: ChangeVacationCountsRequestDto | null;
  isLoading: boolean;
}

const ShowPopup = ({
  isOpen,
  handleClose,
  handleDeletePopupOpen,
  handleEditPopupOpen,
  request,
  isLoading,
}: Props) => {
  const { t } = useTranslation("changeVacationsRequests");
  const { language } = useLanguageStore();
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
          <div className="mt-6 space-y-4 divide-y divide-gray-300">
            {/* ID */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.id")}
              </span>
              <span className="text-gray-900 font-semibold">
                {formatValue(request?.id || "", language)}
              </span>
            </div>
            {/* Manager Name */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.managerName")}
              </span>
              <span className="text-gray-900 font-semibold">
                {request?.managerName || t("NA")}
              </span>
            </div>

            {/* Employee Name */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.emplyeeName")}
              </span>
              <span className="text-gray-900 font-semibold">
                {request?.emplyeeName || t("NA")}
              </span>
            </div>

            {/* Total Casual */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.totalCasual")}
              </span>
              <span className="text-gray-900 font-semibold">
                {formatValue(request?.totalCasual ?? t("NA"), language)}
              </span>
            </div>

            {/* Available Casual */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.availableCasual")}
              </span>
              <span className="text-gray-900 font-semibold">
                {formatValue(request?.availableCasual ?? t("NA"), language)}
              </span>
            </div>

            {/* Total Ordinary */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.totalOrdinary")}
              </span>
              <span className="text-gray-900 font-semibold">
                {formatValue(request?.totalOrdinary ?? t("NA"), language)}
              </span>
            </div>

            {/* Available Ordinary */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.availableOrdinary")}
              </span>
              <span className="text-gray-900 font-semibold">
                {formatValue(request?.availableOrdinary ?? t("NA"), language)}
              </span>
            </div>

            {/* Total Leave Request */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.totalLeaveRequest")}
              </span>
              <span className="text-gray-900 font-semibold">
                {formatValue(request?.totalLeaveRequest ?? t("NA"), language)}
              </span>
            </div>

            {/* Available Leave Request */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.availableLeaveRequest")}
              </span>
              <span className="text-gray-900 font-semibold">
                {formatValue(
                  request?.availableLeaveRequest ?? t("NA"),
                  language
                )}
              </span>
            </div>

            {/* Description */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.description")}
              </span>
              <span className="text-gray-900 font-semibold">
                {request?.description ?? t("NA")}
              </span>
            </div>

            {/* Comment */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.comment")}
              </span>
              <span className="text-gray-900 font-semibold">
                {request?.comment ?? t("NA")}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 mt-4">
        <HasPermission permission="Update Entity">
          <Button
            variant="info"
            type="button"
            fullWidth={true}
            onClick={handleEditPopupOpen}
          >
            {t("buttons.edit")}
          </Button>
        </HasPermission>
        <HasPermission permission="Delete Entity">
          <Button
            variant="secondary"
            type="button"
            fullWidth={true}
            onClick={() => handleOpenFile(request?.reportImageUrl || "")}
          >
            {t("buttons.openReport")}
          </Button>
        </HasPermission>
        <Button
          variant="cancel"
          type="button"
          fullWidth={true}
          onClick={handleClose}
        >
          {t("buttons.close")}
        </Button>
      </div>
    </Popup>
  );
};

export default ShowPopup;
