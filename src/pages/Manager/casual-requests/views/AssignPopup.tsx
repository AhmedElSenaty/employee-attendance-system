import { FormEvent, ReactNode } from "react";
import { Button, Popup } from "../../../../components/ui";
import { CASUAL_REQUESTS_NS } from "../../../../constants";
import { useTranslation } from "react-i18next";

interface IAssignPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode;
  isLoading: boolean;
}

const AssignPopup = ({ isOpen, handleClose, handleSubmit, formInputs, isLoading }: IAssignPopupProps) => {
  const { t } = useTranslation(CASUAL_REQUESTS_NS);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("assignPopup.title")}
      description={t("assignPopup.description")}
    >
      {/* Wrap the content and buttons inside the form for proper submit */}
      <form className="space-y-3 mt-4" onSubmit={handleSubmit}>
        {formInputs}

        <div className="flex items-center space-x-3 mt-4">
          <Button variant="cancel" type="button" fullWidth onClick={handleClose}>
            {t("assignPopup.buttons.close")}
          </Button>
          <Button variant="secondary" type="submit" fullWidth isLoading={isLoading}>
            {isLoading ? t("assignPopup.buttons.loading") : t("assignPopup.buttons.assign")}
          </Button>
        </div>
      </form>
    </Popup>
  );
};

export default AssignPopup;
