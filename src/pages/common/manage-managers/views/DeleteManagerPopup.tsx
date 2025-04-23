import { Popup } from "../../../../components/ui/Popup";
import { Button } from "../../../../components/ui/Button";
import { TFunction } from "i18next";
import { MANAGER_TRANSLATION_NAMESPACE } from "..";

interface IDeleteManagerPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmDelete: () => void;
  isLoading: boolean;
  t: TFunction;
}

const DeleteManagerPopup = ({ isOpen, handleClose, handleConfirmDelete, isLoading, t }: IDeleteManagerPopupProps) => {
  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.delete.title", { ns: MANAGER_TRANSLATION_NAMESPACE })}
      description={t("popup.delete.description", { ns: MANAGER_TRANSLATION_NAMESPACE })}
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

export default DeleteManagerPopup;
