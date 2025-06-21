import { useTranslation } from "react-i18next";
import { Popup, Button } from "../../../../components/ui";
import { OFFICIAL_VACATION_NS } from "../../../../constants";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmDelete: () => void;
  isLoading: boolean;
}

const DeletePopup = ({ isOpen, handleClose, handleConfirmDelete, isLoading }: Props) => {
  const { t } = useTranslation([OFFICIAL_VACATION_NS]);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("deletePopup.title")}
      description={t("deletePopup.description")}
    >
      <div className="flex items-center space-x-3 mt-4">
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("buttons.close")}
        </Button>
        <Button variant="danger" type="button" fullWidth={true} onClick={handleConfirmDelete} isLoading={isLoading}>
          {(isLoading)
            ? t("buttons.loading")
            : t("buttons.delete")}
        </Button>
      </div>
    </Popup>
  );
};

export default DeletePopup;
