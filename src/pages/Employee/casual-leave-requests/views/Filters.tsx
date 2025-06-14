import { Calendar, RefreshCcw } from "lucide-react";
import {
  Button,
  Field,
  Input,
  Label,
  SelectBox,
  Tooltip,
} from "../../../../components/ui";
import { RequestStatusType } from "../../../../enums";
import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "..";
import { formatValue } from "../../../../utils";
import { useLanguageStore } from "../../../../store/language.store";

interface FiltersProps {
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  clearParams: () => void;
}

const Filters = ({ getParam, setParam, clearParams }: FiltersProps) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);
  const { language } = useLanguageStore(); // Accessing the current language from the Redux state

  return (
    <div className="flex flex-wrap items-end gap-4">
      <Field className="flex flex-col space-y-2 w-fit">
        <Label>{t("filters.pageSize")}</Label>
        <SelectBox
          value={getParam("pageSize") ?? 5}
          onChange={(e) =>
            setParam(
              "pageSize",
              String(e.target.value ? parseInt(e.target.value) : 10)
            )
          }
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              {formatValue(size, language)}
            </option>
          ))}
        </SelectBox>
      </Field>

      <Field className="flex flex-col space-y-2">
        <Label>{t("filters.startDate")}</Label>
        <Input
          type="date"
          icon={<Calendar />}
          value={getParam("startDate") ?? ""}
          onChange={(e) => setParam("startDate", e.target.value)}
        />
      </Field>

      <Field className="flex flex-col space-y-2">
        <Label>{t("filters.endDate")}</Label>
        <Input
          type="date"
          icon={<Calendar />}
          value={getParam("endDate") ?? ""}
          onChange={(e) => setParam("endDate", e.target.value)}
        />
      </Field>

      <Field className="flex flex-col space-y-2">
        <Label>{t("filters.casualStatus")}</Label>
        <SelectBox
          onChange={(e) => setParam("status", e.target.value)}
          defaultValue=""
        >
          <option value="" selected={getParam("status") == null} disabled>
            {t("filters.defaultCasualStatusOption")}
          </option>
          {Object.values(RequestStatusType)
            .filter((v) => typeof v === "number")
            .map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {t(`status.${statusValue as number}`)}
              </option>
            ))}
        </SelectBox>
      </Field>

      <Tooltip content={t("filters.toolTipResetFilters")}>
        <Button onClick={clearParams} icon={<RefreshCcw />} />
      </Tooltip>
    </div>
  );
};

export default Filters;
