import { Popup } from "../../../../components/ui/Popup";
import { Button } from "../../../../components/ui/Button";
import { TFunction } from "i18next";
import { EMPLOYEE_TRANSLATION_NAMESPACE } from "..";

interface IDeleteEmployeePopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmDelete: () => void;
  isLoading: boolean;
  t: TFunction;
}

const DeleteEmployeePopup = ({ isOpen, handleClose, handleConfirmDelete, isLoading, t }: IDeleteEmployeePopupProps) => {
  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.delete.title", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
      description={t("popup.delete.description", { ns: EMPLOYEE_TRANSLATION_NAMESPACE })}
    >
      <div className="flex items-center space-x-3 mt-4">
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("buttons.close")}
        </Button>
        <Button variant="danger" type="button" fullWidth={true} onClick={handleConfirmDelete} isLoading={isLoading}>
          {t("buttons.delete")}
        </Button>
      </div>
    </Popup>
  );
};

export default DeleteEmployeePopup;
