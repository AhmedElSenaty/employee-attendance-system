import { Calendar, RefreshCcw, Search } from "lucide-react";
import {
  Button,
  CustomSelect,
  Field,
  Input,
  Label,
  SelectBoxSkeleton,
  Tooltip,
} from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { formatValue } from "../../../../utils";
import { useLanguageStore } from "../../../../store/language.store";
import { useSearchParams } from "react-router";
import { EmployeeSummary } from "../../../../interfaces";
import { useGetEmployeesList } from "../../../../hooks";

interface FiltersProps {
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  clearParams: () => void;
  searchBy: string[];
}

const Filters = ({
  getParam,
  setParam,
  clearParams,
  searchBy,
}: FiltersProps) => {
  const { t } = useTranslation("requestsSummary");
  const { language } = useLanguageStore(); // Accessing the current language from the Redux state

  const [searchParams, setSearchParams] = useSearchParams();

  const setParams = (params: Record<string, string>) => {
    for (const key in params) {
      searchParams.set(key, params[key]);
    }
    setSearchParams(searchParams);
  };
  const { employeesList, isLoading: isEmployeesListLoading } =
    useGetEmployeesList();

  const employeeOptions =
    employeesList?.map((employee: EmployeeSummary) => ({
      value: employee.name,
      label: employee.name,
    })) || [];

  const searchByOptions = searchBy.map((search) => ({
    value: search || "",
    label: t(`filters.searchBy.${String(search)}`) ?? "",
  }));

  const selectedSearchByValue = searchByOptions.find(
    (opt) => opt.value === (getParam("searchKey") ? getParam("searchKey") : "")
  );

  const pageSizeOptions = [10, 20, 30, 40, 50].map((size) => ({
    value: size,
    label: formatValue(size, language),
  }));

  const selectedPageSizeValue = pageSizeOptions.find(
    (opt) =>
      opt.value === (getParam("pageSize") ? Number(getParam("pageSize")) : 10)
  );

  return (
    <div className="flex flex-wrap items-end gap-4">
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
        <Label size="md">{t("filters.searchBy.label")}</Label>
        <CustomSelect
          options={searchByOptions}
          value={selectedSearchByValue}
          onChange={(option) => setParam("searchKey", String(option?.value))}
          isSearchable
        />
      </Field>

      <Field className="flex-grow min-w-[200px] flex flex-col space-y-2">
        <Label size="md">{t("filters.search.label")}</Label>
        <Input
          placeholder={t("filters.search.placeholder")}
          icon={<Search size={18} className="text-gray-500" />}
          value={getParam("searchQuery") ?? ""}
          onChange={(e) => setParam("searchQuery", e.target.value)}
        />
      </Field>

      {/* Employee name */}
      <Field className="space-y-2 w-[300px]">
        <Label size="lg">{t("filters.searchBy.SearchByFullName")}</Label>
        {isEmployeesListLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <CustomSelect
            className="w-full"
            options={employeeOptions}
            value={
              getParam("searchKey") === "SearchByFullName"
                ? employeeOptions.find(
                    (opt) => opt.value === getParam("searchQuery")
                  ) || null
                : null
            }
            onChange={(option) => {
              const name = String(option?.value ?? "");
              setParams({
                searchKey: "SearchByFullName",
                searchQuery: name,
              });
            }}
            isSearchable
          />
        )}
      </Field>
      <Tooltip content={t("filters.toolTipResetFilters")}>
        <Button onClick={clearParams} icon={<RefreshCcw />} />
      </Tooltip>
    </div>
  );
};

export default Filters;
