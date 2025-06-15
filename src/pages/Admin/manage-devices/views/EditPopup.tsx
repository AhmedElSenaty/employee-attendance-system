import { FormEvent, ReactNode } from "react";
import { Button, Popup } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { DEVICES_NS } from "../../../../constants";

interface EditDevicePopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode;
  isLoading: boolean;
}

const EditDevicePopup = ({
  isOpen,
  isLoading,
  handleClose,
  handleSubmit,
  formInputs,
}: EditDevicePopupProps) => {
  const { t } = useTranslation([DEVICES_NS]);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("editPopup.title")}
      description={t("editPopup.description")}
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

export default EditDevicePopup;
