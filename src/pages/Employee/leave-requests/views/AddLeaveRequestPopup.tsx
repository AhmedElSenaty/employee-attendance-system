import { FormEvent, ReactNode } from "react";
import { Button, Popup } from "../../../../components/ui";

interface AddLeaveRequestPopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode;
  isLoading: boolean;
}

const AddLeaveRequestPopup = ({
  isOpen,
  handleClose,
  handleSubmit,
  formInputs,
  isLoading,
}: AddLeaveRequestPopupProps) => {
  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title="Add Leave Request"
      description="Fill in the details to submit a new leave request."
    >
      {formInputs}
      <form className="flex items-center space-x-3 mt-4" onSubmit={handleSubmit}>
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          Close
        </Button>
        <Button variant="secondary" type="submit" fullWidth={true} isLoading={isLoading}>
          Add
        </Button>
      </form>
    </Popup>
  );
};

export default AddLeaveRequestPopup;
