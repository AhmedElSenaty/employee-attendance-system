import { Button, Popup } from "../../../../components/ui";
import { TFunction } from "i18next";
import { DEPARTMENT_TRANSLATION_NAMESPACE } from "..";

interface IDeleteDepartmentPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmDelete: () => void;
  isLoading: boolean;
  t: TFunction;
}

const DeleteDepartmentPopup = ({ isOpen, handleClose, handleConfirmDelete, isLoading, t }: IDeleteDepartmentPopupProps) => {
  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.deleteDepartment.title", { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}
      description={t("popup.deleteDepartment.description", { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}
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

export default DeleteDepartmentPopup;
