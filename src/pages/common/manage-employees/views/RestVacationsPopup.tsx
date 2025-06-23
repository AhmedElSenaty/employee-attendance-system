import { useState } from "react";
import { Popup, Button, Field, Label, CustomSelect } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { TimeToRest } from "../../../../enums";
import { EMPLOYEE_NS } from "../../../../constants";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  handleConfirmRest: (time: TimeToRest) => void;
  isLoading: boolean;
}

const RestVacationsPopup = ({ isOpen, handleClose, handleConfirmRest, isLoading }: Props) => {
  const { t } = useTranslation([EMPLOYEE_NS]);
  const [selectedTime, setSelectedTime] = useState<number>();

  const statusOptions = Object.values(TimeToRest)
    .filter((v) => typeof v === "number")
    .map((value) => ({
      value: value as number,
      label: t(`status.${value}`),
    }));


  const onConfirm = () => {
    if (selectedTime) {
      handleConfirmRest(selectedTime);
    }
  };

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("restPopup.title")}
      description={t("restPopup.description")}
    >
      <Field className="flex flex-col space-y-2">
        <Label>{t("filters.leaveStatus")}</Label>
        <CustomSelect
          options={statusOptions}
          onChange={(option) => setSelectedTime(Number(option?.value))}
          className="w-full"
        />
      </Field>
      <div className="flex items-center space-x-3 mt-4">
        <Button variant="cancel" type="button" fullWidth onClick={handleClose}>
          {t("buttons.close")}
        </Button>
        <Button
          type="button"
          fullWidth
          onClick={onConfirm}
          isLoading={isLoading}
          disabled={!selectedTime}
        >
          {isLoading 
            ? t("buttons.loading")
            : t("buttons.reset")}
        </Button>
      </div>
    </Popup>
  );
};

export default RestVacationsPopup;
