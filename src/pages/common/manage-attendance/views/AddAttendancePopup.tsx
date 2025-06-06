import { TFunction } from "i18next"
import { FormEvent, ReactNode } from "react"
import { ATTENDANCE_TRANSLATION_NAMESPACE } from ".."
import { Button, Popup } from "../../../../components/ui";

interface IAddAttendancePopupProps {
  isOpen: boolean
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode
  isLoading: boolean
  t: TFunction
}

const AddAttendancePopup = ({ isOpen, handleClose, handleSubmit, formInputs, isLoading, t }: IAddAttendancePopupProps) => {

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.addAttendance.title", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
      description={t("popup.addAttendance.description", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
    >
      <div className="space-y-3">
        {formInputs}
      </div>
      <form className="flex items-center space-x-3 mt-4" onSubmit={handleSubmit}>
        <Button variant="cancel" type="button" fullWidth={true} onClick={handleClose}>
          {t("buttons.close")}
        </Button>
        <Button variant="secondary" type="submit" fullWidth={true}  isLoading={isLoading}>
          {t("buttons.add")}
        </Button>
      </form>
    </Popup>
  )
}

export default AddAttendancePopup