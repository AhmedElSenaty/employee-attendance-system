import { FormEvent, ReactNode } from "react";
import { Button, Popup } from "../../../../components/ui";

interface EditLeaveRequestPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode;
  isLoading: boolean;
}

const EditLeaveRequestPopup = ({
  isOpen,
  handleClose,
  handleSubmit,
  formInputs,
  isLoading,
}: EditLeaveRequestPopupProps) => {
  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title="Edit Leave Request"
      description="Update the details of your leave request below."
    >
      {formInputs}
      <form className="flex items-center space-x-3 mt-4" onSubmit={handleSubmit}>
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          Close
        </Button>
        <Button variant="secondary" type="submit" fullWidth={true} isLoading={isLoading}>
          Edit
        </Button>
      </form>
    </Popup>
  );
};

export default EditLeaveRequestPopup;
