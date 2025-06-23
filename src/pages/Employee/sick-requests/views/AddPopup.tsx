import { useTranslation } from "react-i18next";
import { Button, Popup } from "../../../../components/ui";
import { SICK_REQUESTS_NS } from "../../../../constants";
import { FormEvent, ReactNode } from "react";
import { ISickRequestCredentials } from "../../../../interfaces";

interface IAddPopupProps {
  isOpen: boolean
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => ISickRequestCredentials;
  formInputs: ReactNode
  isLoading: boolean
}

const AddPopup = ({
  isOpen,
  handleClose,
  handleSubmit,
  formInputs,
  isLoading,
}: IAddPopupProps) => {
  const { t } = useTranslation(SICK_REQUESTS_NS);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("addPopup.title")}
      description={t("addPopup.description")}
    >
      <div className="space-y-3">
        {formInputs}
      </div>
      <form className="flex items-center space-x-3 mt-4" onSubmit={handleSubmit}>
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("addPopup.buttons.close")}
        </Button>
        <Button variant="secondary" type="submit" fullWidth={true}  isLoading={isLoading}>
          {(isLoading)
            ? t("addPopup.buttons.loading")
            : t("addPopup.buttons.add")
          }
        </Button>
      </form>
    </Popup>
  );
};

export default AddPopup;
