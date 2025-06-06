import { Popup, Button } from "../../../../components/ui"; // Importing the Button component
import { TFunction } from "i18next"; // Importing TFunction for i18n translations
import { ADMIN_TRANSLATION_NAMESPACE } from "..";

// Define types for the props the component will receive
interface IUnblockAdminPopupProps {
  isOpen: boolean; // Controls whether the popup/modal is open or not
  handleClose: () => void; // Function to handle closing the popup
  handleConfirmUnblock: () => void; // Function to handle confirming the unblock action
  isLoading: boolean; // Loading state to show a spinner when the unblock action is processing
  t: TFunction; // Translation function for i18n to handle dynamic text
}

const UnblockAdminPopup = ({ isOpen, handleClose, handleConfirmUnblock, isLoading, t }: IUnblockAdminPopupProps) => {
  
  return (
    <Popup
      isOpen={isOpen} // Condition to open/close the popup
      closeModal={handleClose} // Function to handle the popup close action
      title={t("popup.unblock.title", { ns: ADMIN_TRANSLATION_NAMESPACE })} // Dynamic title from translation keys
      description={t("popup.unblock.description", { ns: ADMIN_TRANSLATION_NAMESPACE })} // Dynamic description from translation keys
    >
      {/* Button container for actions */}
      <div className="flex items-center space-x-3 mt-4">
        {/* Close button */}
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("buttons.close")} {/* Close button text */}
        </Button>
        {/* Unblock button */}
        <Button variant="black" type="button" fullWidth={true} onClick={handleConfirmUnblock} isLoading={isLoading}>
          {t("buttons.unblock")} {/* Unblock button text */}
        </Button>
      </div>
    </Popup>
  );
};

export default UnblockAdminPopup;
