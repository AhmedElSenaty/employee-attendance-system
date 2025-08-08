import { FormEvent, ReactNode } from "react";
import { Popup, Button } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { ENTITY_NS } from "../../../../constants";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode;
  isLoading: boolean;
  mode: "add" | "edit"; // ✅ Add mode prop
  selectedEmployeeId: number | null;
}

const EditPopup = ({
  isOpen,
  isLoading,
  handleClose,
  handleSubmit,
  formInputs,
  mode,
}: Props) => {
  const { t } = useTranslation("changeVacationsRequests");

  const isEdit = mode === "edit";

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t(`${mode}Popup.title`)} // ✅ dynamic title
      description={t(`${mode}Popup.description`)} // ✅ dynamic description
    >
      <div className="space-y-4">
        {formInputs}
        <form
          className="flex items-center space-x-3 mt-4"
          onSubmit={handleSubmit}
        >
          <Button
            variant="cancel"
            type="button"
            fullWidth={true}
            onClick={handleClose}
          >
            {t("buttons.close")}
          </Button>
          <Button
            variant="secondary"
            type="submit"
            fullWidth={true}
            isLoading={isLoading}
          >
            {isLoading
              ? t("buttons.loading")
              : t(`buttons.${isEdit ? "update" : "add"}`)}{" "}
            {/* ✅ dynamic button text */}
          </Button>
        </form>
      </div>
    </Popup>
  );
};

export default EditPopup;
