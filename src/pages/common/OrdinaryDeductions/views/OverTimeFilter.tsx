import { formatValue } from "../../../../utils";
import { Calendar, RefreshCcw, Search } from "lucide-react";
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
import { DepartmentSummary, EmployeeSummary } from "../../../../interfaces";
import { useGetDepartmentsList, useGetEmployeesList } from "../../../../hooks";
import { useSearchParams } from "react-router";
import { useEffect, useMemo, useState } from "react";

interface Props {
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  clearParams: () => void;
  searchBy: string[];
}

const OverTimeFilter = ({
  getParam,
  setParam,
  clearParams,
  searchBy,
}: Props) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation("workOvertime");
  const [searchParams, setSearchParams] = useSearchParams();

  const setParams = (params: Record<string, string>) => {
    for (const key in params) {
      searchParams.set(key, params[key]);
    }
    setSearchParams(searchParams);
  };

  const searchByOptions = searchBy.map((search) => ({
    value: search || "",
    label: t(`filters.searchBy.${String(search)}`) ?? "",
  }));

  const selectedSearchByValue = searchByOptions.find(
    (opt) => opt.value === String(getParam("searchKey") ?? "")
  );

  const { employeesList, isLoading: isEmployeesListLoading } =
    useGetEmployeesList();

  const employeeOptions =
    employeesList?.map((employee: EmployeeSummary) => ({
      value: employee.name,
      label: employee.name,
    })) || [];

  const pageSizeOptions = [10, 20, 30, 40, 50].map((size) => ({
    value: size,
    label: formatValue(size, language),
  }));

  const selectedPageSizeValue = pageSizeOptions.find(
    (opt) =>
      opt.value === (getParam("pageSize") ? Number(getParam("pageSize")) : 10)
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
    <div className="flex flex-wrap items-end gap-4">
      {/* page count */}
      <Field className="w-[90px] flex flex-col space-y-2">
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

      {/* start date */}
      <Field className="w-[180px] flex flex-col space-y-2">
        <Label>{t("filters.startDate")}</Label>
        <Input
          type="date"
          icon={<Calendar />}
          value={getParam("startDate") ?? ""}
          onChange={(e) => setParam("startDate", e.target.value)}
        />
      </Field>

      {/* end date */}
      <Field className="w-[180px] flex flex-col space-y-2">
        <Label>{t("filters.endDate")}</Label>
        <Input
          type="date"
          icon={<Calendar />}
          value={getParam("endDate") ?? ""}
          onChange={(e) => setParam("endDate", e.target.value)}
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
        <Label size="lg">{t("filters.searchBy.SearchByEmployeeName")}</Label>
        {isEmployeesListLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <CustomSelect
            placeholder={t("filters.select.placeholder")}
            className="w-full"
            options={employeeOptions}
            value={
              getParam("searchKey") === "SearchByEmployeeName"
                ? employeeOptions.find(
                    (opt) => opt.value === getParam("searchQuery")
                  ) || null
                : null
            }
            onChange={(option) => {
              const name = String(option?.value ?? "");
              setParams({
                searchKey: "SearchByEmployeeName",
                searchQuery: name,
              });
            }}
            isSearchable
            isClearable
          />
        )}
      </Field>

      {/* Department Select */}
      {/* <Field className="space-y-3 w-full sm:w-auto flex flex-col">
        <Label size="lg">{t("inputs.departmentId.label")}</Label>
        {isDepartmentsLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <CustomSelect
            placeholder={t("filters.select.label")}
            options={departmentOptions}
            value={
              getParam("searchKey") === "SearchByDeptartmentID"
                ? departmentOptions.find(
                    (opt) => opt.value.toString() === getParam("searchQuery")
                  ) || null
                : null
            }
            onChange={(option) => {
              const id = option?.value?.toString() ?? "";
              setSearchParams({
                ...Object.fromEntries(searchParams),
                searchKey: "SearchByDeptartmentID",
                searchQuery: id,
              });
              setSelectDepartmentID(Number(id));
            }}
            className="w-70"
            isSearchable
            isClearable
          />
        )}
      </Field> */}

      <Tooltip content={t("filters.toolTipResetFilters")}>
        <Button onClick={clearParams} icon={<RefreshCcw />} />
      </Tooltip>
    </div>
  );
};

export default OverTimeFilter;
