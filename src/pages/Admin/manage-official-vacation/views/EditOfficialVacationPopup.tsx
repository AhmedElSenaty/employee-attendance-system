import { FormEvent, ReactNode } from "react";
import { Button, Popup } from "../../../../components/ui";
import { TFunction } from "i18next";
import { OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE } from "..";

interface EditOfficialVacationPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode;
  isLoading: boolean;
  t: TFunction
}

const EditOfficialVacationPopup = ({
  isOpen,
  isLoading,
  handleClose,
  handleSubmit,
  formInputs,
  t,
}: EditOfficialVacationPopupProps) => {

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.edit.title", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
      description={t("popup.edit.description", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
    >
      <div className="space-y-4">
        {formInputs}
        <form className="flex items-center space-x-3 mt-4" onSubmit={handleSubmit}>
          <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
            {t("popup.edit.closeButton", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
          </Button>
          <Button variant="secondary" type="submit" fullWidth={true} isLoading={isLoading}>
            {t("popup.edit.updateButton", { ns: OFFICIAL_VACATIONS_TRANSLATION_NAMESPACE })}
          </Button>
        </form>
      </div>
    </Popup>
  );
};

export default EditOfficialVacationPopup;
