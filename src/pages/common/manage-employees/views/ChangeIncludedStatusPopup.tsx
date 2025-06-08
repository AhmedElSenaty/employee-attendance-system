import { Button, Popup } from "../../../../components/ui";
import { TFunction } from "i18next";
import { EMPLOYEE_TRANSLATION_NAMESPACE } from "..";

interface IChangeIncludedStatusPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmChange: () => void;
  isLoading: boolean;
  t: TFunction;
}

const ChangeIncludedStatusPopup = ({
  isOpen,
  handleClose,
  handleConfirmChange,
  isLoading,
  t,
}: IChangeIncludedStatusPopupProps) => {

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.toggleIncludedStatus.title", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
      description={t("popup.toggleIncludedStatus.description", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
    >
      <div className="flex items-center space-x-3 mt-4">
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("buttons.close")}
        </Button>
        <Button variant="warning" type="button" fullWidth={true} onClick={handleConfirmChange} isLoading={isLoading}>
          {t("buttons.toggle")}
        </Button>
      </div>
    </Popup>
  );
};

export default ChangeIncludedStatusPopup;
