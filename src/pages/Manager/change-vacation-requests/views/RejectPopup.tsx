import { useTranslation } from "react-i18next";
import { Button, Popup } from "../../../../components/ui";

interface IRejectPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmReject: () => void;
  isLoading: boolean;
}

const RejectPopup = ({
  isOpen,
  handleClose,
  handleConfirmReject,
  isLoading,
}: IRejectPopupProps) => {
  const { t } = useTranslation("changeVacationsRequests");

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("rejectPopup.title")}
      description={t("rejectPopup.description")}
    >
      <div className="flex items-center space-x-3 mt-4">
        <Button
          variant="cancel"
          type="button"
          fullWidth={true}
          onClick={handleClose}
        >
          {t("rejectPopup.buttons.close")}
        </Button>
        <Button
          type="button"
          fullWidth={true}
          onClick={handleConfirmReject}
          isLoading={isLoading}
          variant="danger"
        >
          {t("rejectPopup.buttons.reject")}
        </Button>
      </div>
    </Popup>
  );
};

export default RejectPopup;
