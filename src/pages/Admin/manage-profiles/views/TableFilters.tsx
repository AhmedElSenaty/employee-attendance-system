import { Button, CustomSelect, Field, Input, Label, Tooltip } from "../../../../components/ui"
import { formatValue } from "../../../../utils";
import { RefreshCcw, Search } from "lucide-react";
import { useLanguageStore } from "../../../../store";
import { PROFILE_NS } from "../../../../constants";
import { useTranslation } from "react-i18next";

interface Props {
  searchBy: string[]
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  clearParams: () => void;
}

const TableFilters = ({
  searchBy,
  getParam,
  setParam,
  clearParams,
}: Props) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation([PROFILE_NS]);

  const pageSizeOptions = [10, 20, 30, 40, 50].map((size) => ({
    value: size,
    label: formatValue(size, language),
  }));
  
  const selectedPageSizeValue = pageSizeOptions.find(opt => opt.value === (getParam("pageSize") ? Number(getParam("pageSize")) : 10));
  
  const searchByOptions = searchBy.map((search) => ({
    value: search || "",
    label: t(`filters.searchBy.${String(search)}`) ?? "",
  }));
  
  const selectedSearchByValue = searchByOptions.find(opt => opt.value === (getParam("searchKey") ? getParam("searchKey") : ""));
  

  return (
    <>
      <div className="w-full flex flex-wrap items-end gap-4">
        {/* Page Size */}
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
    </>
  )
}

export default TableFilters