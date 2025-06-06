import { FormEvent, ReactNode } from "react";
import { TFunction } from "i18next";
import { SUB_DEPARTMENT_TRANSLATION_NAMESPACE } from "..";
import { Button, Popup } from "../../../../components/ui";

interface EditSubDepartmentPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode;
  isLoading: boolean;
  t: TFunction
}

const EditSubDepartmentPopup = ({
  isOpen,
  isLoading,
  handleClose,
  handleSubmit,
  formInputs,
  t,
}: EditSubDepartmentPopupProps) => {
  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.editSubDepartment.title", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
      description={t("popup.editSubDepartment.description", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
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

export default EditSubDepartmentPopup;
