import { useTranslation } from "react-i18next";
import { Button, Popup } from "../../../../components/ui";
import { EMPLOYEE_NS } from "../../../../constants";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmUnblock: () => void;
  isLoading: boolean;
}

const UnblockPopup = ({ isOpen, handleClose, handleConfirmUnblock, isLoading }: Props) => {
  const { t } = useTranslation([EMPLOYEE_NS]);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("unblockPopup.title")}
      description={t("unblockPopup.description")}
    >
      <div className="flex items-center space-x-3 mt-4">
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("buttons.close")}
        </Button>
        <Button variant={"secondary"} type="button" fullWidth={true} onClick={handleConfirmUnblock} isLoading={isLoading}>
          {(isLoading)
            ? t("buttons.loading")
            : t("buttons.unlock")}
        </Button>
      </div>
    </Popup>
  );
};

export default UnblockPopup;
