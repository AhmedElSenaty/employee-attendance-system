import { useTranslation } from "react-i18next";
import { Button, Popup } from "../../../../components/ui";
import { EMPLOYEE_NS } from "../../../../constants";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmRestore: () => void;
  isLoading: boolean;
}

const GoToPreviousSchedulePopup = ({
  isOpen,
  handleClose,
  handleConfirmRestore,
  isLoading,
}: Props) => {
  const { t } = useTranslation([EMPLOYEE_NS]);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("restoreSchedulePopup.title", "استرجاع الجدول السابق")}
      description={t(
        "restoreSchedulePopup.description",
        "هل أنت متأكد أنك تريد استرجاع الجدول السابق؟ سيتم حذف التعديلات الحالية."
      )}
    >
      <div className="flex items-center space-x-3 mt-4">
        <Button variant="cancel" type="button" fullWidth onClick={handleClose}>
          {t("buttons.cancel", "إلغاء")}
        </Button>
        <Button
          variant="danger"
          type="button"
          fullWidth
          onClick={handleConfirmRestore}
          isLoading={isLoading}
        >
          {isLoading
            ? t("buttons.loading", "جاري التحميل...")
            : t("buttons.restore", "استرجاع")}
        </Button>
      </div>
    </Popup>
  );
};

export default GoToPreviousSchedulePopup;
