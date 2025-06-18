import { useTranslation } from "react-i18next";
import { Button, Popup } from "../../../../components/ui";
import { SICK_REQUESTS_NS } from "../../../../constants";
import { FormEvent, ReactNode } from "react";

interface IEditPopupProps {
  isOpen: boolean
  handleClose: () => void;
  handleSubmitUpdateText: (event: FormEvent<HTMLFormElement>) => void;
  handleSubmitUpdateReport: (event: FormEvent<HTMLFormElement>) => void;
  formReportInput: ReactNode
  formTextInputs: ReactNode
  isLoading: boolean
}

const EditPopup = ({
  isOpen,
  handleClose,
  handleSubmitUpdateText,
  handleSubmitUpdateReport,
  formReportInput,
  formTextInputs,
  isLoading,
}: IEditPopupProps) => {
  const { t } = useTranslation(SICK_REQUESTS_NS);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("editPopup.title")}
      description={t("editPopup.description")}
    >
      <div className="space-y-3">
        {formReportInput}
        <form className="flex items-center space-x-3 mt-4" onSubmit={handleSubmitUpdateReport}>
          <Button variant="secondary" type="submit" fullWidth={true}  isLoading={isLoading}>
            {(isLoading)
              ? t("editPopup.buttons.loading")
              : t("editPopup.buttons.upload")
            }
          </Button>
        </form>
        {formTextInputs}
        <form className="flex items-center space-x-3 mt-4" onSubmit={handleSubmitUpdateText}>
          <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
            {t("editPopup.buttons.close")}
          </Button>
          <Button variant="secondary" type="submit" fullWidth={true}  isLoading={isLoading}>
            {(isLoading)
              ? t("editPopup.buttons.loading")
              : t("editPopup.buttons.edit")
            }
          </Button>
        </form>
      </div>
    </Popup>
  );
};

export default EditPopup;
