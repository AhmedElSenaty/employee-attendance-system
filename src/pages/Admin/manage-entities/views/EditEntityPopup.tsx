import { FormEvent, ReactNode } from "react";
import { Popup, Button } from "../../../../components/ui";
import { TFunction } from "i18next";
import { ENTITY_TRANSLATION_NAMESPACE } from "..";

interface EditEntityPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode;
  isLoading: boolean;
  t: TFunction
}

const EditEntityPopup = ({
  isOpen,
  isLoading,
  handleClose,
  handleSubmit,
  formInputs,
  t,
}: EditEntityPopupProps) => {
  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.edit.title", { ns: ENTITY_TRANSLATION_NAMESPACE })}
      description={t("popup.edit.description", { ns: ENTITY_TRANSLATION_NAMESPACE })}
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

export default EditEntityPopup;
