import { FormEvent, ReactNode } from "react";
import { Button, Popup } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { OFFICIAL_VACATION_NS } from "../../../../constants";

interface Props {
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
}: Props) => {
  const { t } = useTranslation([OFFICIAL_VACATION_NS]);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("editPopup.title")}
      description={t("editPopup.description")}
    >
      <div className="space-y-4">
        {formInputs}
        <form className="flex items-center space-x-3 mt-4" onSubmit={handleSubmit}>
          <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
            {t("buttons.close")}
          </Button>
          <Button variant="secondary" type="submit" fullWidth={true} isLoading={isLoading}>
            {(isLoading)
              ? t("buttons.loading")
              : t("buttons.update")}
          </Button>
        </form>
      </div>
    </Popup>
  );
};

export default EditPopup;
