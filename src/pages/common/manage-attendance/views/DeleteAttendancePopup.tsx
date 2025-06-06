import { Button, Popup } from "../../../../components/ui";
import { TFunction } from "i18next";
import { ATTENDANCE_TRANSLATION_NAMESPACE } from "..";

interface IDeleteAttendancePopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmDelete: () => void;
  isLoading: boolean;
  t: TFunction;
}

const DeleteAttendancePopup = ({ isOpen, handleClose, handleConfirmDelete, isLoading, t }: IDeleteAttendancePopupProps) => {
  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.deleteAttendance.title", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
      description={t("popup.deleteAttendance.description", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
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

export default DeleteAttendancePopup;
