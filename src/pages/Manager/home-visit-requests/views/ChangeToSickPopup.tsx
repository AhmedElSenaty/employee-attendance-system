import { FormEvent, ReactNode } from "react";
import { Button, Popup } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { HOME_VISIT_REQUESTS_NS } from "../../../../constants";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode;
  isLoading: boolean;
}

const ChangeToSickPopup = ({
  isOpen,
  handleClose,
  handleSubmit,
  formInputs,
  isLoading,
}: Props) => {
  const { t } = useTranslation(HOME_VISIT_REQUESTS_NS);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("changeToSickPopup.title")}
      description={t("changeToSickPopup.description")}
    >
      <div className="space-y-3">
        {formInputs}
      </div>
      <form className="flex items-center space-x-5 mt-4" onSubmit={handleSubmit}>
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("changeToSickPopup.buttons.close")}
        </Button>
        <Button variant="secondary" type="submit" fullWidth={true} isLoading={isLoading}>
          {(isLoading)
            ? t("changeToSickPopup.buttons.loading")
            : t("changeToSickPopup.buttons.change")
          }
        </Button>
      </form>
    </Popup>
  );
};

export default ChangeToSickPopup;
