import { FormEvent, ReactNode } from "react";
import { Button, Popup } from "../../../../components/ui";
import { ATTENDANCE_NS } from "../../../../constants";
import { useTranslation } from "react-i18next";

interface EditPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode;
  isLoading: boolean;
}

const EditPopup = ({
  isOpen,
  isLoading,
  handleClose,
  handleSubmit,
  formInputs,
}: EditPopupProps) => {
  const { t } = useTranslation([ATTENDANCE_NS]);

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
          {t("buttons.close")}
        </Button>
        <Button variant="secondary" type="submit" fullWidth={true} isLoading={isLoading}>
          {t("buttons.edit")}
        </Button>
      </form>
    </Popup>
  );
};

export default EditPopup;
