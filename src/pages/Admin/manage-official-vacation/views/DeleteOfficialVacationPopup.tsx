import { Popup } from "../../../../components/ui/Popup";
import { Button } from "../../../../components/ui/Button";
import { TFunction } from "i18next";
import { OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE } from "..";

interface IDeleteOfficialVacationPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmDelete: () => void;
  isLoading: boolean;
  t: TFunction;
}

const DeleteOfficialVacationPopup = ({ isOpen, handleClose, handleConfirmDelete, isLoading, t }: IDeleteOfficialVacationPopupProps) => {

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.delete.title", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
      description={t("popup.delete.description", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
    >
      <div className="flex items-center space-x-3 mt-4">
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("popup.delete.closeButton", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
        </Button>
        <Button variant="danger" type="button" fullWidth={true} onClick={handleConfirmDelete} isLoading={isLoading}>
          {t("popup.delete.deleteButton", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
        </Button>
      </div>
    </Popup>
  );
};

export default DeleteOfficialVacationPopup;
