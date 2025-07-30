import { formatValue } from "../../../../utils";
import { RefreshCcw, Search } from "lucide-react";
import { useLanguageStore } from "../../../../store/";
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
import { EMPLOYEE_NS } from "../../../../constants";
import { Control } from "react-hook-form";
import { EmployeeSummary } from "../../../../interfaces";
import { useGetEmployeesList } from "../../../../hooks";
import { useSearchParams } from "react-router";

interface Props {
  searchBy: string[];
  clearParams: () => void;
  control: Control<any>;
}

const TableFilters = ({ searchBy, clearParams }: Props) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation([EMPLOYEE_NS]);
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key: string) => searchParams.get(key);

  const setParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(key, value);
    setSearchParams(newParams);
  };

  const pageSizeOptions = [10, 20, 30, 40, 50].map((size) => ({
    value: size,
    label: formatValue(size, language),
  }));

  const { employeesList, isLoading: isEmployeesListLoading } =
    useGetEmployeesList();

  const employeeOptions =
    employeesList?.map((employee: EmployeeSummary) => ({
      value: employee.name,
      label: employee.name,
    })) || [];

  const selectedPageSizeValue = pageSizeOptions.find(
    (opt) =>
      opt.value === (getParam("pageSize") ? Number(getParam("pageSize")) : 10)
  );

  const searchByOptions = searchBy.map((search) => ({
    value: search || "",
    label: t(`filters.searchBy.${String(search)}`) ?? "",
  }));

  const selectedSearchByValue = searchByOptions.find(
    (opt) => opt.value === (getParam("searchKey") ? getParam("searchKey") : "")
  );

  return (
    <>
      <div className="w-full flex flex-wrap items-end gap-4">
        {/* Page size */}
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
          <Label size="md">{t("filters.searchBy.label")}</Label>
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

        {/* Employee Name Select */}
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
                setSearchParams({
                  searchKey: "SearchByFullName",
                  searchQuery: name,
                });
              }}
              isSearchable
            />
          )}
        </Field>

        {/* Clear Filters */}
        <Tooltip content={t("filters.toolTipResetFilters")}>
          <Button onClick={clearParams} icon={<RefreshCcw />} />
        </Tooltip>
      </div>
    </>
  );
};

export default TableFilters;
