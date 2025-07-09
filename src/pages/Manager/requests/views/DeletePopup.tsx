import { useTranslation } from "react-i18next";
import { Button, Field, Label, Popup, Textarea } from "../../../../components/ui";
import { UseFormRegister } from "react-hook-form";
import { ISoftDeleteRequestCredentials } from "../../../../interfaces/request.interfaces";

interface IDeletePopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmDelete: () => void;
  register: UseFormRegister<ISoftDeleteRequestCredentials>;
  isLoading: boolean;
}

const DeletePopup = ({
  isOpen,
  handleClose,
  handleConfirmDelete,
  register,
  isLoading,
}: IDeletePopupProps) => {
  const { t } = useTranslation("requests");

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("deletePopup.title")}
      description={t("deletePopup.description")}
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
          {t("deletePopup.buttons.close")}
        </Button>
        <Button type="button" variant={"danger"} fullWidth={true} onClick={handleConfirmDelete} isLoading={isLoading}>
          {t("deletePopup.buttons.delete")}
        </Button>
      </div>
    </Popup>
  );
};

export default DeletePopup;
