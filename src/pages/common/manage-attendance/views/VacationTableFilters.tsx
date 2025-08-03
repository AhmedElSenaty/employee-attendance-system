import { formatValue } from "../../../../utils";
import { Calendar, RefreshCcw, Search } from "lucide-react";
import { useLanguageStore } from "../../../../store/language.store";
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
import { ATTENDANCE_NS } from "../../../../constants";
import {
  useGetDepartmentsList,
  useGetDepartmentSubDepartments,
  useGetEmployeesList,
} from "../../../../hooks";
import {
  Department,
  EmployeeSummary,
  SubDepartmentSummary,
} from "../../../../interfaces";
import { useSearchParams } from "react-router";

interface ITableFiltersProps {
  searchBy: string[];
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  setParams: (params: Record<string, string>) => void;
  clearParams: () => void;
}

const VacationTableFilters = ({
  searchBy,
  getParam,
  setParam,
  clearParams,
}: ITableFiltersProps) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation([ATTENDANCE_NS]);

  const [searchParams, setSearchParams] = useSearchParams();

  const setParams = (params: Record<string, string>) => {
    for (const key in params) {
      searchParams.set(key, params[key]);
    }
    setSearchParams(searchParams);
  };

  const departmentId = getParam("SearchByDeptartmentID");

  const { departmentsList, isLoading: isDepartmentsLoading } =
    useGetDepartmentsList();
  const { subDepartmentsList, isLoading: isSubDepartmentsLoading } =
    useGetDepartmentSubDepartments(Number(departmentId || ""));
  const { employeesList, isLoading: isEmployeesListLoading } =
    useGetEmployeesList();

  const pageSizeOptions = [10, 20, 30, 40, 50].map((size) => ({
    value: size,
    label: formatValue(size, language),
  }));

  const selectedPageSizeValue = pageSizeOptions.find(
    (opt) =>
      opt.value === (getParam("pageSize") ? Number(getParam("pageSize")) : 10)
  );

  const searchByOptions = searchBy.map((search) => ({
    value: search || "",
    label: t(`filters.searchBy.${String(search)}`) ?? "",
  }));

  const selectedSearchByValue = searchByOptions.find(
    (opt) => opt.value === String(getParam("searchKey") ?? "")
  );

  const departmentOptions =
    departmentsList?.map((department: Department) => ({
      value: department.id,
      label: department.name,
    })) ?? [];

  const selectedDepartmentValue = departmentOptions.find(
    (opt) => opt.value === Number(getParam("SearchByDeptartmentID"))
  );

  const subDepartmentOptions =
    subDepartmentsList?.map((subDepartment: SubDepartmentSummary) => ({
      value: subDepartment.id,
      label: subDepartment.name,
    })) ?? [];

  const selectedSubDepartmentValue = subDepartmentOptions.find(
    (opt) => opt.value === Number(getParam("searchBySubDeptartmentId"))
  );

  const employeeOptions =
    employeesList?.map((employee: EmployeeSummary) => ({
      value: employee.name,
      label: employee.name,
    })) || [];

  return (
    <>
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
          <Label size="lg">{t("inputs.employeeId.label")}</Label>
          {isEmployeesListLoading ? (
            <SelectBoxSkeleton />
          ) : (
            <CustomSelect
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
            />
          )}
        </Field>

        <Tooltip content={t("filters.toolTipResetFilters")}>
          <Button onClick={clearParams} icon={<RefreshCcw />} />
        </Tooltip>
      </div>

      <div className="full flex flex-wrap items-end gap-4">
        <Field className="flex flex-col space-y-2 w-fit">
          <Label>{t("filters.startDate")}</Label>
          <Input
            type="date"
            icon={<Calendar />}
            value={getParam("startDate") ?? ""}
            onChange={(e) => setParam("startDate", e.target.value)}
          />
        </Field>

        <Field className="flex flex-col space-y-2 w-fit">
          <Label>{t("filters.endDate")}</Label>
          <Input
            type="date"
            icon={<Calendar />}
            value={getParam("endDate") ?? ""}
            onChange={(e) => setParam("endDate", e.target.value)}
          />
        </Field>
        <Field className="flex flex-col space-y-2 w-fit">
          <Label size="md">{t("filters.searchBy.SearchByDeptartmentID")}</Label>
          {isDepartmentsLoading ? (
            <SelectBoxSkeleton />
          ) : (
            <CustomSelect
              options={departmentOptions}
              value={selectedDepartmentValue}
              onChange={(option) =>
                setParam("SearchByDeptartmentID", String(option?.value))
              }
              isSearchable
              className="w-60"
            />
          )}
        </Field>

        <Field className="flex flex-col space-y-2 w-fit">
          <Label size="md">
            {t("filters.searchBy.SearchBySubDeptartmentId")}
          </Label>
          {isSubDepartmentsLoading ? (
            <SelectBoxSkeleton />
          ) : (
            <CustomSelect
              options={subDepartmentOptions}
              value={selectedSubDepartmentValue}
              onChange={(option) =>
                setParam("searchBySubDeptartmentId", String(option?.value))
              }
              isSearchable
              className="w-60"
            />
          )}
        </Field>
      </div>
    </>
  );
};

export default VacationTableFilters;
