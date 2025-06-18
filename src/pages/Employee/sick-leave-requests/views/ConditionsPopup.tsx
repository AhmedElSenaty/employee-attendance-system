import { Popup, Button } from "../../../../components/ui";
import { useTranslation, Trans } from "react-i18next";
import { SICK_REQUESTS_NS } from "../../../../constants";

interface ConditionsPopupProps {
  isOpen: boolean;
  handleClose: () => void;
}

const ConditionsPopup = ({ isOpen, handleClose }: ConditionsPopupProps) => {
  const { t } = useTranslation(SICK_REQUESTS_NS);

  return (
    <Popup
      isOpen={isOpen}
      closeModal={handleClose}
      title={t("conditionsPopup.title")}
      description={t("conditionsPopup.description")}
    >
      <section className="text-gray-900 max-h-[60vh] overflow-y-auto space-y-6 px-2">
        <article>
          <ul className="space-y-3 text-gray-800">
            <li className="relative rtl:pr-6 ltr:pl-6 before:absolute rtl:before:right-0 ltr:before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-indigo-500">
              <Trans i18nKey="conditionsPopup.rules.0" t={t} />
            </li>
            <li className="relative rtl:pr-6 ltr:pl-6 before:absolute rtl:before:right-0 ltr:before:left-0 before:top-1.5 before:w-2 before:h-2 before:rounded-full before:bg-indigo-500">
              <Trans i18nKey="conditionsPopup.rules.1" t={t} />
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
