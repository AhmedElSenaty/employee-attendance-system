import { FormEvent, ReactNode } from "react";
import { Button, Popup } from "../../../../components/ui";
import { TFunction } from "i18next";
import { ATTENDANCE_TRANSLATION_NAMESPACE } from "..";

interface EditAttendancePopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode;
  isLoading: boolean;
  t: TFunction
}

const EditAttendancePopup = ({
  isOpen,
  isLoading,
  handleClose,
  handleSubmit,
  formInputs,
  t,
}: EditAttendancePopupProps) => {
  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.editAttendance.title", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
      description={t("popup.editAttendance.description", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
    >
      <div className="space-y-3">
        {formInputs}
      </div>
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

export default EditAttendancePopup;
