import { useTranslation } from "react-i18next";
import { Button, Popup } from "../../../../components/ui";
import { ORDINARY_REQUESTS_NS } from "../../../../constants";

interface IAcceptPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmAccept: () => void;
  isLoading: boolean;
}

const AcceptPopup = ({ isOpen, handleClose, handleConfirmAccept, isLoading }: IAcceptPopupProps) => {
  const { t } = useTranslation(ORDINARY_REQUESTS_NS);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("acceptPopup.title")}
      description={t("acceptPopup.description")}
    >
      <div className="flex items-center space-x-3 mt-4">
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("acceptPopup.buttons.close")}
        </Button>
        <Button type="button" fullWidth={true} onClick={handleConfirmAccept} isLoading={isLoading}>
          {t("acceptPopup.buttons.accept")}
        </Button>
      </div>
    </Popup>
  );
};

export default AcceptPopup;
