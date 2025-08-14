// src/pages/Admin/manage-devices/views/RefetchAllAttendancePopup.tsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Field, Input, Label, Popup } from "../../../../components/ui";
import { DEVICES_NS } from "../../../../constants";
import { Calendar } from "lucide-react";

export type RefetchAllPayload = {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: RefetchAllPayload) => void | Promise<void>;
  isLoading: boolean;
}

const RefetchAllAttendancePopup = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: Props) => {
  const { t } = useTranslation([DEVICES_NS]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const invalid = useMemo(() => {
    if (!startDate || !endDate) return true;
    return new Date(startDate) > new Date(endDate);
  }, [startDate, endDate]);

  const handleConfirm = () => {
    if (invalid || isLoading) return;
    onConfirm({ startDate, endDate });
  };

  return (
    <Popup
      isOpen={isOpen}
      closeModal={onClose}
      title={t("refetchAllPopup.title")}
      description={t("refetchAllPopup.description")}
    >
      <div className="space-y-4 mt-4">
        {/* one row with two inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Field className="flex flex-col space-y-2 w-fit">
              <Label>{t("refetchPopup.fields.startDate")}</Label>
              <Input
                type="date"
                icon={<Calendar />}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Field>
          </div>

          <div className="space-y-1">
            {/* end date */}
            <Field className="flex flex-col space-y-2 w-fit">
              <Label>{t("refetchPopup.fields.endDate")}</Label>
              <Input
                type="date"
                icon={<Calendar />}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Field>
          </div>
        </div>

        {/* Actions row */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="cancel" type="button" fullWidth onClick={onClose}>
            {t("buttons.close")}
          </Button>
          <Button
            variant="primary"
            type="button"
            fullWidth
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={invalid || isLoading}
          >
            {isLoading
              ? t("buttons.loading")
              : t("refetchAllPopup.buttons.refetch")}
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default RefetchAllAttendancePopup;
