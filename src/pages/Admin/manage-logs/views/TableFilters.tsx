import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../../store/";
import {
  Button,
  CustomSelect,
  Field,
  Input,
  Label,
  Tooltip,
} from "../../../../components/ui";
import { formatValue } from "../../../../utils";
import { Calendar, RefreshCcw, Search } from "lucide-react";
import { LogType } from "../../../../enums";
import { LOGS_NS } from "../../../../constants";

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
  const { t } = useTranslation(LOGS_NS);
  const { language } = useLanguageStore(); // Accessing the current language from the Redux state

  const pageSizeOptions = [10, 20, 30, 40, 50].map((size) => ({
    value: size,
    label: formatValue(size, language),
  }));
  
  const selectedPageSizeValue = pageSizeOptions.find(opt => opt.value === (getParam("pageSize") ? Number(getParam("pageSize")) : 10));
  
  const logTypeOptions = Object.values(LogType).filter((v) => typeof v === "number").map((statusValue) => ({
    value: statusValue,
    label: t(`types.${statusValue as number}`),
  }));
  
  const selectedLogTypeValue = logTypeOptions.find(opt => opt.value === (getParam("type") ? Number(getParam("type")) : ""));
  
  
  const searchByOptions = searchBy.map((search) => ({
    value: search || "",
    label: t(`filters.searchBy.${String(search)}`) ?? "",
  }));
  
  const selectedSearchByValue = searchByOptions.find(opt => opt.value === (getParam("searchKey") ? getParam("searchKey") : ""));
  

  return (
    <div className="w-full flex flex-wrap items-end gap-4">
      <Field className="flex flex-col space-y-2 w-fit">
        <Label>{t("filters.pageSize")}</Label>
        <CustomSelect
          options={pageSizeOptions}
          value={selectedPageSizeValue}
          onChange={(option) => 
            setParam("pageSize", String(option?.value ?? 10))
          }
          className="w-25"
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
        <Label>{t("filters.logType")}</Label>
        <CustomSelect
          options={logTypeOptions}
          value={selectedLogTypeValue}
          onChange={(option) => 
            setParam("type", String(option?.value))
          }
        />
      </Field>

      {/* Search Type */}
      <Field className="flex flex-col space-y-2">
        <Label size="md">{t("filters.searchBy.label")} </Label>
        <CustomSelect
          options={searchByOptions}
          value={selectedSearchByValue}
          onChange={(option) => 
            setParam("searchKey", String(option?.value))
          }
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

      <Tooltip content={t("filters.toolTipResetFilters")}>
        <Button onClick={clearParams} icon={<RefreshCcw />} />
      </Tooltip>
    </div>
  );
};

export default TableFilters;
