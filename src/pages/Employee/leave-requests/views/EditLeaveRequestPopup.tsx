import { FormEvent, ReactNode } from "react";
import { Button, Popup } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "..";

interface EditLeaveRequestPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode;
  isLoading: boolean;
}

const EditLeaveRequestPopup = ({
  isOpen,
  handleClose,
  handleSubmit,
  formInputs,
  isLoading,
}: EditLeaveRequestPopupProps) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("editPopup.title")}
      description={t("editPopup.description")}
    >
      <div className="space-y-3">
        {formInputs}
      </div>
      <form className="flex items-center space-x-3 mt-4" onSubmit={handleSubmit}>
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("editPopup.buttons.close")}
        </Button>
        <Button variant="secondary" type="submit" fullWidth={true} isLoading={isLoading}>
          {t("editPopup.buttons.edit")}
        </Button>
      </form>
    </Popup>
  );
};

export default EditLeaveRequestPopup;
