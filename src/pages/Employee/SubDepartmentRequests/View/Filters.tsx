import { Calendar, RefreshCcw, Search } from "lucide-react";
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
import { AllLeaveType } from "../../../../enums/requestTypes.enum";

interface FiltersProps {
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  clearParams: () => void;
  searchBy: string[];
}

const Filters = ({
  searchBy,
  getParam,
  setParam,
  clearParams,
}: FiltersProps) => {
  const { t } = useTranslation(LEAVE_REQUESTS_NS);
  const { language } = useLanguageStore(); // Accessing the current language from the Redux state

  const searchByOptions = searchBy.map((search) => ({
    value: search || "",
    label: t(`filters.searchBy.${String(search)}`) ?? "",
  }));

  const selectedSearchByValue = searchByOptions.find(
    (opt) => opt.value === (getParam("searchKey") ? getParam("searchKey") : "")
  );

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

      {/* Search Type */}
      <Field className="flex flex-col space-y-2">
        <Label size="md">{t("filters.searchBy.label")} </Label>
        <CustomSelect
          options={searchByOptions}
          value={selectedSearchByValue}
          onChange={(option) => setParam("searchKey", String(option?.value))}
          isSearchable
        />
      </Field>

      {/* Search Input */}
      <Field className="flex-grow min-w-[200px] flex flex-col space-y-2">
        <Label size="md">{t("filters.search.label")}</Label>
        <Input
          placeholder={t("filters.search.placeholder")}
          icon={<Search size={18} className="text-gray-500" />}
          value={getParam("searchQuery") ?? ""}
          onChange={(e) => setParam("searchQuery", e.target.value)}
        />
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
        <Label>{t("filters.leaveStatus")}</Label>
        <SelectBox
          onChange={(e) => setParam("status", e.target.value)}
          defaultValue=""
        >
          <option value="" selected={getParam("status") == null} disabled>
            {t("filters.defaultLeaveStatusOption")}
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

      <Field className="flex flex-col space-y-2">
        <Label>{t("filters.leaveType")}</Label>
        <SelectBox
          onChange={(e) => setParam("leaveType", e.target.value)}
          defaultValue=""
        >
          <option value="" selected={getParam("leaveType") == null} disabled>
            {t("filters.defaultLeaveTypeOption")}
          </option>
          {Object.values(AllLeaveType)
            .filter((v) => typeof v === "number")
            .map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {t(`leaveType.${statusValue as number}`)}
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
