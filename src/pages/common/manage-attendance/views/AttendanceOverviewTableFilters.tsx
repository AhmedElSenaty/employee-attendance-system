import { TFunction } from "i18next"
import { Field, Input, Label, SelectBox } from "../../../../components/ui/Forms"
import { formatValue } from "../../../../utils";
import { Calendar, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../context/store";
import { useFiltersHook } from "../../../../hooks/useFiltersHook";
import { ATTENDANCE_TRANSLATION_NAMESPACE } from "..";

interface ISubDepartmentTableFiltersProps {
  searchBy: string[]
  t: TFunction
}

const AttendanceOverviewTableFilters = ({ searchBy, t }: ISubDepartmentTableFiltersProps) => {
  const { language } = useSelector((state: RootState) => state.language);
  const { pageSize, searchKey, search, startDate, endDate, setFilters } = useFiltersHook()

  return (
    <>
      {/* Page Size */}
      <div className="flex flex-wrap gap-4">
        <Field className="space-y-3 w-full sm:w-auto flex flex-col">
          <Label>{t("pagination.pageSize")}</Label>
          <SelectBox value={pageSize ?? 5} onChange={(e) => setFilters({ pageSize: e.target.value ? parseInt(e.target.value) : 5 })}>
            {[5, 10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>{formatValue(size, language)}</option>
            ))}
          </SelectBox>
        </Field>

        {/* Search Type */}
        <Field className="space-y-3 w-full sm:w-auto flex flex-col">
          <Label size="md">{t("searchBySummary.label", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</Label>
          <SelectBox value={searchKey ?? ""} onChange={(e) => setFilters({ searchKey: e.target.value })} >
            <option value="">
              {t(`searchBySummary.default`, { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
            </option>
            {searchBy.map((search, idx) => (
              <option key={idx} value={String(search)}>
                {t(`searchBySummary.${String(search)}`, { ns: ATTENDANCE_TRANSLATION_NAMESPACE }) ?? ""}
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
      </div>
      <div className="flex flex-wrap gap-10">
        <div className="flex flex-row flex-wrap gap-1 md:gap-2 items-end justify-center">
          <Field className="space-y-3 w-full sm:w-auto flex flex-col items-center">
            <Label>{t("dateAndTime.startDate")}</Label>
            <Input
              type="date"
              icon={<Calendar />}
              value={startDate ?? ""}
              onChange={(e) => setFilters({ startDate: e.target.value })}
            />
          </Field>
          <span className="text-lg font-bold text-gray-800 capitalize">{t("dateAndTime.to")}</span>
          <Field className="space-y-3 w-full sm:w-auto flex flex-col items-center">
            <Label>{t("dateAndTime.endDate")}</Label>
            <Input
              type="date"
              icon={<Calendar />}
              value={endDate ?? ""}
              onChange={(e) => setFilters({ endDate: e.target.value })}
            />
          </Field>
        </div>
      </div>
    </>
  )
}

export default AttendanceOverviewTableFilters