import { useTranslation } from "react-i18next";
import {
  Button,
  Field,
  Input,
  Label,
  SelectBox,
  Tooltip,
} from "../../../../components/ui";
import { formatValue } from "../../../../utils";
import { Calendar, RefreshCcw, Search } from "lucide-react";
import { RequestStatusType } from "../../../../enums";
import { useLanguageStore } from "../../../../store";
import { SICK_REQUESTS_NS } from "../../../../constants";

interface FiltersProps {
  searchBy: string[];
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  clearParams: () => void;
}

const TableFilters = ({
  searchBy,
  getParam,
  setParam,
  clearParams,
}: FiltersProps) => {
  const { t } = useTranslation(SICK_REQUESTS_NS);
  const { language } = useLanguageStore(); // Accessing the current language from the Redux state

  return (
    <div className="w-full flex flex-wrap items-end gap-4">
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
        <Label>{t("filters.sickStatus")}</Label>
        <SelectBox onChange={(e) => setParam("status", e.target.value)}>
          <option value="" selected={getParam("status") == null} disabled>
            {t("filters.defaultSickStatusOption")}
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

      {/* Search Type */}
      <Field className="flex flex-col space-y-2 w-fit">
        <Label size="md">{t("filters.searchBy.label")} </Label>
        <SelectBox onChange={(e) => setParam("serachKey", e.target.value)}>
          <option value="" selected={getParam("serachKey") == null} disabled>
            {t(`filters.searchBy.default`)}
          </option>
          {searchBy.map((search, idx) => (
            <option key={idx} value={String(search)}>
              {t(`filters.searchBy.${String(search)}`) ?? ""}
            </option>
          ))}
        </SelectBox>
      </Field>

      {/* Search Input */}
      <Field className="flex-grow min-w-[200px] flex flex-col space-y-2">
        <Label size="md">{t("filters.search.label")}</Label>
        <Input
          placeholder={t("filters.search.placeholder")}
          icon={<Search size={18} className="text-gray-500" />}
          value={getParam("serachQuery") ?? ""}
          onChange={(e) => setParam("serachQuery", e.target.value)}
        />
      </Field>

      <Tooltip content={t("filters.toolTipResetFilters")}>
        <Button onClick={clearParams} icon={<RefreshCcw />} />
      </Tooltip>
    </div>
  );
};

export default TableFilters;
