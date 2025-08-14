// src/pages/Admin/manage-devices/views/RefetchDevicesPopup.tsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Field, Input, Label, Popup } from "../../../../components/ui";
import { DEVICES_NS } from "../../../../constants";
import { Calendar } from "lucide-react";
import { RefetchPayload } from "../../../../interfaces";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: RefetchPayload) => void | Promise<void>;
  isLoading: boolean;

  // If you already know the device row data, pass them to avoid detection work:
  presetDeviceId?: number | string;
  presetDeviceIp?: string;
}

/* ---------- helpers ---------- */

const RefetchDevicesPopup = ({
  isOpen,
  onClose,
  isLoading,
  onConfirm,
  presetDeviceId,
  presetDeviceIp,
}: Props) => {
  const { t } = useTranslation([DEVICES_NS]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // const [deviceIp, setDeviceIp] = useState("…");

  const invalid = useMemo(() => {
    if (!startDate || !endDate) return true;
    return new Date(startDate) > new Date(endDate);
  }, [startDate, endDate]);

  const handleConfirm = () => {
    if (invalid || isLoading) return;
    onConfirm({
      startDate,
      endDate,
      deviceId: presetDeviceId,
      deviceIp: presetDeviceIp,
    });
  };

  return (
    <Popup
      isOpen={isOpen}
      closeModal={onClose}
      title={t("refetchPopup.title")}
      description={t("refetchPopup.description")}
    >
      <div className="space-y-4 mt-4">
        {/* Dates row */}
        <div className="grid grid-cols-2 gap-3">
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

        {/* Read-only info */}
        <div className="rounded-lg bg-neutral-50 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="opacity-70">
              {t("refetchPopup.fields.deviceId")}
            </span>
            <code className="rounded bg-neutral-200 px-2 py-0.5 text-xs">
              {presetDeviceId || "…"}
            </code>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="opacity-70">
              {t("refetchPopup.fields.deviceIp")}
            </span>
            <code className="rounded bg-neutral-200 px-2 py-0.5 text-xs">
              {presetDeviceIp || "…"}
            </code>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between space-x-3">
          <Button variant="cancel" type="button" onClick={onClose}>
            {t("buttons.close")}
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={invalid || isLoading}
          >
            {isLoading
              ? t("buttons.loading")
              : t("refetchPopup.buttons.refetch")}
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default RefetchDevicesPopup;
