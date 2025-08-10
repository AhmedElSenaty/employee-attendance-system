import { Button, NormalSpinner, Popup } from "../../../../components/ui";
import { formatValue } from "../../../../utils";
import { useLanguageStore } from "../../../../store/";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  request: any; // { employeeName, subDeptName, depart, date, day, in, out, totalHours }
  isLoading: boolean;
}

const ShowPopup = ({ isOpen, handleClose, request, isLoading }: Props) => {
  // Load both namespaces: popup text + table column labels
  const { t } = useTranslation("workOvertime");
  const { language } = useLanguageStore();

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
            {/* Employee Name */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.employeeName")}
              </span>
              <span className="text-gray-900 font-semibold">
                {request?.employeeName ?? t("NA")}
              </span>
            </div>

            {/* Sub Department */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.subDeptName")}
              </span>
              <span className="text-gray-900 font-semibold">
                {request?.subDeptName ?? t("NA")}
              </span>
            </div>

            {/* Department */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.depart")}
              </span>
              <span className="text-gray-900 font-semibold">
                {request?.depart ?? t("NA")}
              </span>
            </div>

            {/* Date */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.date")}
              </span>
              <span className="text-gray-900 font-semibold">
                {formatValue(request?.date ?? t("NA"), language)}
              </span>
            </div>

            {/* Day */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.day")}
              </span>
              <span className="text-gray-900 font-semibold">
                {request?.day ?? t("NA")}
              </span>
            </div>

            {/* In */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.in")}
              </span>
              <span className="text-gray-900 font-semibold">
                {formatValue(request?.in ?? t("NA"), language)}
              </span>
            </div>

            {/* Out */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.out")}
              </span>
              <span className="text-gray-900 font-semibold">
                {formatValue(request?.out ?? t("NA"), language)}
              </span>
            </div>

            {/* Total Hours */}
            <div className="grid grid-cols-2 py-2">
              <span className="font-medium text-gray-600">
                {t("table.columns.totalHours")}
              </span>
              <span className="text-gray-900 font-semibold">
                {formatValue(request?.totalHours ?? t("NA"), language)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 mt-4">
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
