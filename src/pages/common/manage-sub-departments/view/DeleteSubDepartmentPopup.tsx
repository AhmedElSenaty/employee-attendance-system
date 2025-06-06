import { Popup, Button } from "../../../../components/ui";
import { TFunction } from "i18next";
import { SUB_DEPARTMENT_TRANSLATION_NAMESPACE } from "..";

interface IDeleteSubDepartmentPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmDelete: () => void;
  isLoading: boolean;
  t: TFunction;
}

const DeleteSubDepartmentPopup = ({ isOpen, handleClose, handleConfirmDelete, isLoading, t }: IDeleteSubDepartmentPopupProps) => {
  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.deleteSubDepartment.title", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
      description={t("popup.deleteSubDepartment.description", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
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

export default DeleteSubDepartmentPopup;
