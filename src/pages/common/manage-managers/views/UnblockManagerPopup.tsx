import { Button, Popup } from "../../../../components/ui";
import { TFunction } from "i18next";
import { MANAGER_TRANSLATION_NAMESPACE } from "..";

interface IUnblockManagerPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmUnblock: () => void;
  isLoading: boolean;
  t: TFunction;
}

const UnblockManagerPopup = ({ isOpen, handleClose, handleConfirmUnblock, isLoading, t }: IUnblockManagerPopupProps) => {

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.unblock.title", { ns: MANAGER_TRANSLATION_NAMESPACE })}
      description={t("popup.unblock.description", { ns: MANAGER_TRANSLATION_NAMESPACE })}
    >
      <div className="flex items-center space-x-3 mt-4">
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("buttons.close")}
        </Button>
        <Button variant="black" type="button" fullWidth={true} onClick={handleConfirmUnblock} isLoading={isLoading}>
          {t("buttons.unblock")}
        </Button>
      </div>
    </Popup>
  );
};

export default UnblockManagerPopup;
