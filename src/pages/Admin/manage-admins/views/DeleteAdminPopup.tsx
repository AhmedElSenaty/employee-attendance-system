import { Popup } from "../../../../components/ui/Popup"; // Importing the Popup component for modal display
import { Button } from "../../../../components/ui/Button"; // Importing the Button component
import { TFunction } from "i18next"; // Importing TFunction for i18n translations
import { ADMIN_TRANSLATION_NAMESPACE } from "..";

// Define types for the props the component will receive
interface IDeleteAdminPopupProps {
  isOpen: boolean; // Controls whether the popup/modal is open or not
  handleClose: () => void; // Function to handle closing the popup
  handleConfirmDelete: () => void; // Function to handle confirming the delete action
  isLoading: boolean; // Loading state to show a spinner when the delete action is processing
  t: TFunction; // Translation function for i18n to handle dynamic text
}

const DeleteAdminPopup = ({ isOpen, handleClose, handleConfirmDelete, isLoading, t }: IDeleteAdminPopupProps) => {

  return (
    <Popup
      isOpen={isOpen} // Condition to open/close the popup
      closeModal={handleClose} // Function to handle the popup close action
      title={t("popup.delete.title", { ns: ADMIN_TRANSLATION_NAMESPACE })} // Dynamic title from translation keys
      description={t("popup.delete.description", { ns: ADMIN_TRANSLATION_NAMESPACE })} // Dynamic description from translation keys
    >
      {/* Button container for actions */}
      <div className="flex items-center space-x-3 mt-4">
        {/* Close button */}
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("buttons.close")} {/* Close button text */}
        </Button>
        {/* Delete button */}
        <Button variant="danger" type="button" fullWidth={true} onClick={handleConfirmDelete} isLoading={isLoading}>
          {t("buttons.delete")} {/* Delete button text */}
        </Button>
      </div>
    </Popup>
  );
};

export default DeleteAdminPopup;
