import { FormEvent, ReactNode } from "react";
import { Button, Popup } from "../../../../components/ui";
import { TFunction } from "i18next";
import { DEPARTMENT_TRANSLATION_NAMESPACE } from "..";

interface EditDepartmentPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode;
  isLoading: boolean;
  t: TFunction
}

const EditDepartmentPopup = ({
  isOpen,
  isLoading,
  handleClose,
  handleSubmit,
  formInputs,
  t,
}: EditDepartmentPopupProps) => {
  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.editDepartment.title", { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}
      description={t("popup.editDepartment.description", { ns: DEPARTMENT_TRANSLATION_NAMESPACE })}
    >
      {formInputs}
      <form className="flex items-center space-x-3 mt-4" onSubmit={handleSubmit}>
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("buttons.close")}
        </Button>
        <Button variant="secondary" type="submit" fullWidth={true} isLoading={isLoading}>
          {t("buttons.update")}
        </Button>
      </form>
    </Popup>
  );
};

export default EditDepartmentPopup;
