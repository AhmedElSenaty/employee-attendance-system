import { TFunction } from "i18next"
import { Popup, Button } from "../../../../components/ui"
import { FormEvent, ReactNode } from "react"
import { SUB_DEPARTMENT_TRANSLATION_NAMESPACE } from ".."

interface IAddSubDepartmentPopupProps {
  isOpen: boolean
  handleClose: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formInputs: ReactNode
  isLoading: boolean
  t: TFunction
}

const AddSubDepartmentPopup = ({ isOpen, handleClose, handleSubmit, formInputs, isLoading, t }: IAddSubDepartmentPopupProps) => {

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.addSubDepartment.title", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
      description={t("popup.addSubDepartment.description", { ns: SUB_DEPARTMENT_TRANSLATION_NAMESPACE })}
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

export default AddSubDepartmentPopup