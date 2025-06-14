import { Sun, Moon } from "lucide-react";
import { Popup, Button } from "../../../../components/ui";
import { useTranslation, Trans } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "..";

interface ConditionsPopupProps {
  isOpen: boolean;
  handleClose: () => void;
}

const ConditionsPopup = ({ isOpen, handleClose }: ConditionsPopupProps) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("conditionsPopup.title")}
      description={t("conditionsPopup.description")}
    >
      <section className="text-gray-900 max-h-[60vh] overflow-y-auto space-y-6 px-2">
        {/* Morning Permission */}
        <article>
          <h3 className="flex items-center gap-3 text-lg font-semibold text-cyan-700 mb-3">
            <Sun className="w-6 h-6" />
            {t("conditionsPopup.morning.title")}
          </h3>
          <ul className="space-y-3 text-gray-800">
            <li className="relative rtl:pr-6 ltr:pl-6 before:absolute rtl:before:right-0 ltr:before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-cyan-500">
              <Trans i18nKey="conditionsPopup.morning.rules.0" t={t} components={{ 1: <strong /> }} />
            </li>
            <li className="relative rtl:pr-6 ltr:pl-6 before:absolute rtl:before:right-0 ltr:before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-cyan-500">
              <Trans i18nKey="conditionsPopup.morning.rules.1" t={t} components={{ 1: <strong /> }} />
            </li>
            <li className="relative rtl:pr-6 ltr:pl-6 before:absolute rtl:before:right-0 ltr:before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-cyan-500">
              {t("conditionsPopup.morning.rules.2")}
              <ul className="mt-3 space-y-2 text-gray-600 text-sm ml-4">
                <li className="relative pl-5 before:absolute rtl:before:right-0 ltr:before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-cyan-300">
                  <Trans i18nKey="conditionsPopup.morning.rules.3" t={t} components={{ 1: <strong /> }} />
                </li>
                <li className="relative pl-5 before:absolute rtl:before:right-0 ltr:before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-cyan-300">
                  <Trans i18nKey="conditionsPopup.morning.rules.4" t={t} components={{ 1: <strong /> }} />
                </li>
              </ul>
            </li>
          </ul>
        </article>

        {/* Evening Permission */}
        <article>
          <h3 className="flex items-center gap-3 text-lg font-semibold text-indigo-700 mb-3">
            <Moon className="w-6 h-6" />
            {t("conditionsPopup.evening.title")}
          </h3>
          <ul className="space-y-3 text-gray-800">
            <li className="relative rtl:pr-6 ltr:pl-6 before:absolute rtl:before:right-0 ltr:before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-indigo-500">
              <Trans i18nKey="conditionsPopup.evening.rules.0" t={t} components={{ 1: <strong /> }} />
            </li>
            <li className="relative rtl:pr-6 ltr:pl-6 before:absolute rtl:before:right-0 ltr:before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-indigo-500">
              <Trans i18nKey="conditionsPopup.evening.rules.1" t={t} components={{ 1: <strong /> }} />
            </li>
            <li className="relative rtl:pr-6 ltr:pl-6 before:absolute rtl:before:right-0 ltr:before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-indigo-500">
              {t("conditionsPopup.evening.rules.2")}
              <ul className="mt-3 space-y-2 text-gray-600 text-sm ml-4">
                <li className="relative pl-5 before:absolute rtl:before:right-0 ltr:before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-indigo-300">
                  <Trans i18nKey="conditionsPopup.evening.rules.3" t={t} components={{ 1: <strong /> }} />
                </li>
                <li className="relative pl-5 before:absolute rtl:before:right-0 ltr:before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-indigo-300">
                  <Trans i18nKey="conditionsPopup.evening.rules.4" t={t} components={{ 1: <strong /> }} />
                </li>
              </ul>
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
