import { Calendar, RefreshCcw } from "lucide-react";
import {
  Button,
  CustomSelect,
  Field,
  Input,
  Label,
  SelectBox,
  Tooltip,
} from "../../../../components/ui";
import { RequestStatusType } from "../../../../enums";
import { useTranslation } from "react-i18next";
import { formatValue } from "../../../../utils";
import { useLanguageStore } from "../../../../store/language.store";
import { LEAVE_REQUESTS_NS } from "../../../../constants";
import { useSearchParams } from "react-router";

interface FiltersProps {
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  clearParams: () => void;
}

const Filters = ({ getParam, setParam, clearParams }: FiltersProps) => {
  const { t } = useTranslation(LEAVE_REQUESTS_NS);
  const { language } = useLanguageStore(); // Accessing the current language from the Redux state
  const [searchParams, setSearchParams] = useSearchParams();

  const setParams = (params: Record<string, string>) => {
    for (const key in params) {
      searchParams.set(key, params[key]);
    }
    setSearchParams(searchParams);
  };
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
      <Field className=" flex flex-col space-y-2">
        <Label size="md">{t("filters.leaveStatus")}</Label>

        <CustomSelect
          placeholder={t("filters.select.placeholder")}
          options={Object.values(RequestStatusType)
            .filter((v) => typeof v === "number")
            .map((statusValue) => ({
              value: String(statusValue),
              label: t(`status.${statusValue}`),
            }))}
          value={
            getParam("status")
              ? {
                  value: getParam("status"),
                  label: t(`status.${getParam("status")}`),
                }
              : null
          }
          onChange={(option) => {
            const selectedValue = option?.value;

            const newParams = new URLSearchParams(searchParams);
            if (selectedValue) {
              newParams.set("status", selectedValue);
            } else {
              newParams.delete("status"); // ✅ Removes from URL
            }

            setSearchParams(newParams);
          }}
          isClearable
          isSearchable
          className="w-50"
        />
      </Field>

      <Tooltip content={t("filters.toolTipResetFilters")}>
        <Button onClick={clearParams} icon={<RefreshCcw />} />
      </Tooltip>
    </div>
  );
};

export default Filters;
