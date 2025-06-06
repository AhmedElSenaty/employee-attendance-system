import { TFunction } from "i18next"
import { FormEvent, ReactNode } from "react"
import { DEVICE_TRANSLATION_NAMESPACE } from ".."
import { Button, Popup } from "../../../../components/ui";

interface IAddDevicePopupProps {
  isOpen: boolean
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode
  isLoading: boolean
  t: TFunction
}

const AddDevicePopup = ({ isOpen, handleClose, handleSubmit, formInputs, isLoading, t }: IAddDevicePopupProps) => {

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.add.title", { ns: DEVICE_TRANSLATION_NAMESPACE })}
      description={t("popup.add.description", { ns: DEVICE_TRANSLATION_NAMESPACE })}
    >
      {formInputs}
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

export default AddDevicePopup