import { Popup } from "../../../../components/ui/Popup";
import { Button } from "../../../../components/ui/Button";
import { TFunction } from "i18next";
import { EMPLOYEE_TRANSLATION_NAMESPACE } from "..";

interface IUnblockEmployeePopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmUnblock: () => void;
  isLoading: boolean;
  t: TFunction;
}

const UnblockEmployeePopup = ({ isOpen, handleClose, handleConfirmUnblock, isLoading, t }: IUnblockEmployeePopupProps) => {
  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.unblock.title", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
      description={t("popup.unblock.description", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
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

export default UnblockEmployeePopup;
