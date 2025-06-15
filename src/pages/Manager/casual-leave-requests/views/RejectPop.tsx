import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "..";
import { Button, Field, Label, Popup, Textarea } from "../../../../components/ui";
import { UseFormRegister } from "react-hook-form";
import { IRejectCasualLeaveRequestCredentials } from "../../../../interfaces";

interface IRejectPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmReject: () => void;
  register: UseFormRegister<IRejectCasualLeaveRequestCredentials>;
  isLoading: boolean;
}

const RejectPopup = ({
  isOpen,
  handleClose,
  handleConfirmReject,
  register,
  isLoading,
}: IRejectPopupProps) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("rejectPopup.title")}
      description={t("rejectPopup.description")}
    >
      <Field className="space-y-2">
        <Label size="lg">{t("inputs.comment.label")}</Label>
        <Textarea
          placeholder={t("inputs.comment.placeholder")}
          {...register("comment")}
        />
      </Field>

      <div className="flex items-center space-x-3 mt-4">
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("rejectPopup.buttons.close")}
        </Button>
        <Button type="button" fullWidth={true} onClick={handleConfirmReject} isLoading={isLoading}>
          {t("rejectPopup.buttons.reject")}
        </Button>
      </div>
    </Popup>
  );
};

export default RejectPopup;
