import { TFunction } from "i18next"
import { Field, Input, Label, SelectBox } from "../../../../components/ui/Forms"
import { formatValue } from "../../../../utils";
import { Search } from "lucide-react";
import { useFiltersHook } from "../../../../hooks/useFiltersHook";
import { DEVICE_TRANSLATION_NAMESPACE } from "..";
import { useLanguageStore } from "../../../../store/language.store";

interface IDeviceTableFiltersProps {
  searchBy: string[]
  t: TFunction
}

const DeviceTableFilters = ({ searchBy, t }: IDeviceTableFiltersProps) => {
    const { language } = useLanguageStore();
  const { pageSize, searchKey, search, setFilters } = useFiltersHook()
  
  return (
    <>
      {/* Page Size */}
      <Field className="space-y-3 w-full sm:w-auto flex flex-col">
        <Label>{t("pagination.pageSize")}</Label>
        <SelectBox value={pageSize ?? 5} onChange={(e) => setFilters({ pageSize: e.target.value ? parseInt(e.target.value) : 10 })}>
          {[5, 10, 20, 30, 40, 50].map(size => (
            <option key={size} value={size}>{formatValue(size, language)}</option>
          ))}
        </SelectBox>
      </Field>
    
      {/* Search Type */}
      <Field className="space-y-3 w-full sm:w-auto flex flex-col">
        <Label size="md">{t("searchBy.label", { ns: DEVICE_TRANSLATION_NAMESPACE})} </Label>
        <SelectBox value={searchKey ?? ""} onChange={(e) => setFilters({ searchKey: e.target.value })} >
          <option value="">
            {t(`searchBy.default`, { ns: DEVICE_TRANSLATION_NAMESPACE})}
          </option>
          {searchBy.map((search, idx) => (
            <option key={idx} value={String(search)}>
              {t(`searchBy.${String(search)}`, { ns: DEVICE_TRANSLATION_NAMESPACE}) ?? ""}
            </option>
          ))}
        </SelectBox>
      </Field>

      {/* Search Input */}
      <Field className="flex-1 w-full sm:w-auto flex flex-col space-y-3">
        <Label size="md">{t("search.label")}</Label>
        <Input
          placeholder={t("search.placeholder")}
          icon={<Search size={18} className="text-gray-500" />}
          value={search ?? ""}
          onChange={(e) => setFilters({ search: e.target.value })}
        />
      </Field>
    </>
  )
}

export default DeviceTableFilters