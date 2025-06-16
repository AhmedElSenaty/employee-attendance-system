import { CalendarMinus, CalendarCheck2 } from "lucide-react";
import { Popup, Button } from "../../../../components/ui";
import { useTranslation, Trans } from "react-i18next";
import { MISSION_REQUESTS_NS } from "../../../../constants";

interface ConditionsPopupProps {
  isOpen: boolean;
  handleClose: () => void;
}

const ConditionsPopup = ({ isOpen, handleClose }: ConditionsPopupProps) => {
  const { t } = useTranslation(MISSION_REQUESTS_NS);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("conditionsPopup.title")}
      description={t("conditionsPopup.description")}
    >
      <section className="text-gray-900 max-h-[60vh] overflow-y-auto space-y-6 px-2">
        {/* halfDay Permission */}
        <article>
          <h3 className="flex items-center gap-3 text-lg font-semibold text-cyan-700 mb-3">
            <CalendarMinus className="w-6 h-6" />
            {t("conditionsPopup.halfDay.title")}
          </h3>
          <ul className="space-y-3 text-gray-800">
            <li className="relative rtl:pr-6 ltr:pl-6 before:absolute rtl:before:right-0 ltr:before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-cyan-500">
              <Trans i18nKey="conditionsPopup.halfDay.rules.0" t={t} components={{ 1: <strong /> }} />
            </li>
            <li className="relative rtl:pr-6 ltr:pl-6 before:absolute rtl:before:right-0 ltr:before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-cyan-500">
              <Trans i18nKey="conditionsPopup.halfDay.rules.1" t={t} components={{ 1: <strong /> }} />
            </li>
          </ul>
        </article>

        {/* fullDay Permission */}
        <article>
          <h3 className="flex items-center gap-3 text-lg font-semibold text-indigo-700 mb-3">
            <CalendarCheck2 className="w-6 h-6" />
            {t("conditionsPopup.fullDay.title")}
          </h3>
          <ul className="space-y-3 text-gray-800">
            <li className="relative rtl:pr-6 ltr:pl-6 before:absolute rtl:before:right-0 ltr:before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-indigo-500">
              <Trans i18nKey="conditionsPopup.fullDay.rules.0" t={t} components={{ 1: <strong /> }} />
            </li>
            <li className="relative rtl:pr-6 ltr:pl-6 before:absolute rtl:before:right-0 ltr:before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-indigo-500">
              <Trans i18nKey="conditionsPopup.fullDay.rules.1" t={t} components={{ 1: <strong /> }} />
            </li>
          </ul>
        </article>
      </section>

      <div className="flex justify-end mt-6">
        <Button variant="cancel" onClick={handleClose} fullWidth>
          {t("conditionsPopup.close")}
        </Button>
      </div>
    </Popup>
  );
};

export default ConditionsPopup;
