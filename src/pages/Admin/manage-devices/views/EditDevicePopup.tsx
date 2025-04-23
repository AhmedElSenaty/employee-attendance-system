import { FormEvent, ReactNode } from "react";
import { Button } from "../../../../components/ui/Button";
import { Popup } from "../../../../components/ui/Popup";
import { TFunction } from "i18next";
import { DEVICE_TRANSLATION_NAMESPACE } from "..";

interface EditDevicePopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode;
  isLoading: boolean;
  t: TFunction
}

const EditDevicePopup = ({
  isOpen,
  isLoading,
  handleClose,
  handleSubmit,
  formInputs,
  t,
}: EditDevicePopupProps) => {
  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.edit.title", { ns: DEVICE_TRANSLATION_NAMESPACE })}
      description={t("popup.edit.description", { ns: DEVICE_TRANSLATION_NAMESPACE })}
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
