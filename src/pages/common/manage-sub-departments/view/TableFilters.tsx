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
import { SUB_DEPARTMENT_NS } from "../../../../constants";
import {
  DepartmentSummary,
  SubDepartmentSummary,
} from "../../../../interfaces";
import {
  useGetDepartmentsList,
  useGetDepartmentSubDepartments,
} from "../../../../hooks";
import { useSearchParams } from "react-router";

interface Props {
  searchBy: string[];
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  clearParams: () => void;
}

const TableFilters = ({ searchBy, getParam, setParam, clearParams }: Props) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation([SUB_DEPARTMENT_NS]);

  const [searchParams, setSearchParams] = useSearchParams();

  const setParams = (params: Record<string, string>) => {
    for (const key in params) {
      searchParams.set(key, params[key]);
    }
    setSearchParams(searchParams);
  };
  const departmentId =
    getParam("searchKey") === "SearchByDepartmentId"
      ? getParam("searchQuery")
      : null;

  const { departmentsList, isLoading: isDepartmentsLoading } =
    useGetDepartmentsList();
  const { subDepartmentsList, isLoading: isSubDepartmentsLoading } =
    useGetDepartmentSubDepartments(Number(departmentId || ""));

  const departmentOptions =
    departmentsList?.map((department: DepartmentSummary) => ({
      value: department.id,
      label: department.name,
    })) ?? [];

  const selectedDepartmentValue = departmentOptions.find(
    (opt: { value: number; label: string }) =>
      opt.value === getParam("searchByDepartmentId")
  );

  const subDepartmentOptions =
    subDepartmentsList?.map((subDepartment: SubDepartmentSummary) => ({
      value: subDepartment.id,
      label: subDepartment.name,
    })) ?? [];

  const selectedSubDepartmentValue = subDepartmentOptions.find(
    (opt: { value: number; label: string }) =>
      opt.value === getParam("searchBySubDeptartmentId")
  );

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
    (opt) => opt.value === (getParam("searchKey") ? getParam("searchKey") : "")
  );
  console.log("depart id", departmentId);
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

        {/* Search Type */}
        <Field className="flex flex-col space-y-2">
          <Label size="md">{t("filters.searchBy.label")} </Label>
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

        {/* department */}
        <Field className="flex flex-col space-y-2 w-fit">
          <Label size="md">
            {t("filters.searchBy.SearchByDepartmentName")}
          </Label>
          {isDepartmentsLoading ? (
            <SelectBoxSkeleton />
          ) : (
            <CustomSelect
              options={departmentOptions}
              value={selectedDepartmentValue}
              onChange={(option) => {
                const name = String(option?.value ?? "");
                setSearchParams({
                  searchKey: "SearchByDepartmentId",
                  searchQuery: name,
                });
              }}
              isSearchable
              isClearable
              className="w-65"
            />
          )}
        </Field>

        {/* sub department */}
        <Field className="flex flex-col space-y-2 w-fit">
          <Label size="md">{t("filters.searchBy.SearchBySubDeptName")}</Label>
          {isSubDepartmentsLoading ? (
            <SelectBoxSkeleton />
          ) : (
            <CustomSelect
              options={subDepartmentOptions}
              value={selectedSubDepartmentValue}
              onChange={(option) => {
                const name = String(option?.value ?? "");
                setSearchParams({
                  searchKey: "SearchBySubDepartmentId",
                  searchQuery: name,
                });
              }}
              isSearchable
              isClearable
              className="w-65"
            />
          )}
        </Field>

        <Tooltip content={t("filters.toolTipResetFilters")}>
          <Button onClick={clearParams} icon={<RefreshCcw />} />
        </Tooltip>
      </div>
    </>
  );
};

export default TableFilters;
