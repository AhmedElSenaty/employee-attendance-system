import { useState } from "react";
import { Popup, Button, Field, Label, SelectBox } from "../../../../components/ui";
import { EMPLOYEE_TRANSLATION_NAMESPACE } from "..";
import { useTranslation } from "react-i18next";
import { TimeToRest } from "../../../../enums";

interface IRestEmployeePopupProps {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmRest: (time: TimeToRest) => void;
  isLoading: boolean;
}

const RestEmployeePopup = ({ isOpen, handleClose, handleConfirmRest, isLoading }: IRestEmployeePopupProps) => {
  const { t } = useTranslation([EMPLOYEE_TRANSLATION_NAMESPACE]);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const onConfirm = () => {
    if (selectedTime) {
      handleConfirmRest(Number(selectedTime));
    }
  };

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("popup.rest.title")}
      description={t("popup.rest.description")}
    >
      <Field className="flex flex-col space-y-2">
        <Label>{t("filters.leaveStatus")}</Label>
        <SelectBox
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="" disabled>
            {t("filters.defaultLeaveStatusOption")}
          </option>
          {Object.values(TimeToRest)
            .filter((v) => typeof v === "number")
            .map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {t(`status.${statusValue}`)}
              </option>
            ))}
        </SelectBox>
      </Field>
      <div className="flex items-center space-x-3 mt-4">
        <Button variant="cancel" type="button" fullWidth onClick={handleClose}>
          {t("buttons.close")}
        </Button>
        <Button
          variant="black"
          type="button"
          fullWidth
          onClick={onConfirm}
          isLoading={isLoading}
          disabled={!selectedTime}
        >
          {t("buttons.rest")}
        </Button>
      </div>
    </Popup>
  );
};

export default RestEmployeePopup;
