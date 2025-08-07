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
import { DepartmentSummary, EmployeeSummary } from "../../../../interfaces";
import { useGetDepartmentsList, useGetEmployeesList } from "../../../../hooks";
import { useSearchParams } from "react-router";
import { useEffect, useMemo, useState } from "react";

interface Props {
  searchBy: string[];
  clearParams: () => void;
  control: Control<any>;
}

const TableFilters = ({ searchBy, clearParams }: Props) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation("changeVacationsRequests");
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

  const [selectDepartmentID, setSelectDepartmentID] = useState<number | null>(
    null
  );

  const { departmentsList, isLoading: isDepartmentsLoading } =
    useGetDepartmentsList();

  useEffect(() => {
    setSelectDepartmentID(selectDepartmentID || null);
  }, [selectDepartmentID]);

  const departmentOptions = useMemo(
    () =>
      departmentsList?.map((department: DepartmentSummary) => ({
        value: department.id,
        label: department.name,
      })) || [],
    [departmentsList]
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
            placeholder={t("filters.select.placeholder")}
            options={searchByOptions}
            value={selectedSearchByValue}
            onChange={(option) => setParam("searchKey", String(option?.value))}
            isSearchable
          />
        </Field>

        {/* Search Input */}
        <Field className="w-[200px] sm:w-[250px] md:w-[300px] flex flex-col space-y-2">
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
          <Label size="lg">
            {t("filters.searchBy.SearchByEmployeeFullName")}
          </Label>
          {isEmployeesListLoading ? (
            <SelectBoxSkeleton />
          ) : (
            <CustomSelect
              className="w-full"
              placeholder={t("filters.select.placeholder")}
              options={employeeOptions}
              value={
                getParam("searchKey") === "SearchByEmployeeFullName"
                  ? employeeOptions.find(
                      (opt) => opt.value === getParam("searchQuery")
                    ) || null
                  : null
              }
              onChange={(option) => {
                const name = String(option?.value ?? "");
                setSearchParams({
                  searchKey: "SearchByEmployeeFullName",
                  searchQuery: name,
                });
              }}
              isSearchable
              isClearable
            />
          )}
        </Field>

        {/* Department Select */}
        <Field className="space-y-3 w-full sm:w-auto flex flex-col">
          <Label size="lg">{t("filters.searchBy.SearchByDepartmentId")}</Label>
          {isDepartmentsLoading ? (
            <SelectBoxSkeleton />
          ) : (
            <CustomSelect
              placeholder={t("filters.select.placeholder")}
              options={departmentOptions}
              value={
                getParam("searchKey") === "SearchByDepartmentId"
                  ? departmentOptions.find(
                      (opt) => opt.value.toString() === getParam("searchQuery")
                    ) || null
                  : null
              }
              onChange={(option) => {
                const id = option?.value?.toString() ?? "";
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  searchKey: "SearchByDepartmentId",
                  searchQuery: id,
                });
                setSelectDepartmentID(Number(id));
              }}
              className="w-70"
              isSearchable
              isClearable
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
