import {
  Button,
  CustomSelect,
  Field,
  Input,
  Label,
  SelectBoxSkeleton,
  Tooltip,
} from "../../../../components/ui";
import { formatValue } from "../../../../utils";
import { Calendar, RefreshCcw, Search, Timer } from "lucide-react";
import {
  useGetDepartmentsList,
  useGetDepartmentSubDepartments,
  useGetEmployeesList,
} from "../../../../hooks/";
import { useLanguageStore } from "../../../../store/";
import { ATTENDANCE_NS } from "../../../../constants";
import { useTranslation } from "react-i18next";
import {
  Department,
  EmployeeSummary,
  SubDepartmentSummary,
} from "../../../../interfaces";

interface Props {
  searchBy: string[];
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  setParams: (params: Record<string, string>) => void; // ✅ fixed signature
  clearParams: () => void;
}

const AttendanceTableFilters = ({
  searchBy,
  getParam,
  setParam,
  setParams,
  clearParams,
}: Props) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation([ATTENDANCE_NS]);

  const { employeesList, isLoading: isEmployeesListLoading } =
    useGetEmployeesList();

  const departmentId = getParam("searchByDepartmentId");

  const { departmentsList, isLoading: isDepartmentsLoading } =
    useGetDepartmentsList();
  const { subDepartmentsList, isLoading: isSubDepartmentsLoading } =
    useGetDepartmentSubDepartments(Number(departmentId || ""));

  const pageSizeOptions = [10, 20, 30, 40, 50].map((size) => ({
    value: size,
    label: formatValue(size, language),
  }));

  const employeeOptions =
    employeesList?.map((employee: EmployeeSummary) => ({
      value: employee.name, // ✅ Use name, not ID
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

  const statusOptions = ["حضور", "انصراف"].map((state) => ({
    value: state,
    label: state,
  }));

  const selectedStatusValue = statusOptions.find(
    (opt) => opt.value === getParam("status")
  );

  const departmentOptions =
    departmentsList?.map((department: Department) => ({
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

  const dateRangeOptions = [
    { value: "today", label: t("filters.quickDate.today") },
    { value: "weekly", label: t("filters.quickDate.weekly") },
    { value: "monthly", label: t("filters.quickDate.monthly") },
  ];

  const handleQuickDateSelect = (value: string) => {
    const today = new Date();
    let start: Date;

    if (value === "today") {
      start = new Date(today);
    } else if (value === "weekly") {
      const day = today.getDay(); // 0 = Sunday
      start = new Date(today);
      const sundayOffset = day === 0 ? 0 : -day;
      start.setDate(start.getDate() + sundayOffset);
    } else if (value === "monthly") {
      start = new Date(today.getFullYear(), today.getMonth(), 1); // first of month
    } else {
      return;
    }

    // ✅ Format using local time
    const format = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;

    setParams({
      startDate: format(start),
      endDate: format(today),
    });
  };

  return (
    <>
      <div className="w-full flex flex-wrap items-end gap-4">
        {/* page size */}
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

        {/* status */}
        <Field className="flex flex-col space-y-2 w-fit">
          <Label size="md">{t("filters.status")}</Label>
          <CustomSelect
            placeholder={t("filters.select.placeholder")}
            options={statusOptions}
            value={selectedStatusValue}
            onChange={(option) => {
              if (option) {
                setParam("status", option.value);
              } else {
                setParam("status", ""); // ✅ or remove param entirely if needed
              }
            }}
            isClearable
            isSearchable
          />
        </Field>

        {/* search by */}
        <Field className="flex flex-col space-y-2">
          <Label size="md">{t("filters.searchBy.label")}</Label>
          <CustomSelect
            options={searchByOptions}
            value={selectedSearchByValue}
            onChange={(option) => setParam("searchKey", String(option?.value))}
            isSearchable
          />
        </Field>

        {/* search input */}
        <Field className="w-[200px] sm:w-[250px] md:w-[300px] flex flex-col space-y-2">
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
              isClearable
            />
          )}
        </Field>

        {/* quick Date */}
        <Field className="w-[140px] flex flex-col space-y-2 mx-5">
          <Label>{t("filters.quickDate.label")}</Label>
          <CustomSelect
            options={dateRangeOptions}
            onChange={(option) => handleQuickDateSelect(String(option?.value))}
            placeholder={t("filters.select.placeholder")}
            // placeholder={t("filters.quickDate.placeholder")}
            isClearable
          />
        </Field>

        <Tooltip content={t("filters.toolTipResetFilters")}>
          <Button onClick={clearParams} icon={<RefreshCcw />} />
        </Tooltip>
      </div>

      <div className="w-full flex flex-wrap items-end gap-4">
        {/* start date */}
        <Field className="flex flex-col space-y-2 w-fit">
          <Label>{t("filters.startDate")}</Label>
          <Input
            type="date"
            icon={<Calendar />}
            value={getParam("startDate") ?? ""}
            onChange={(e) => setParam("startDate", e.target.value)}
          />
        </Field>

        {/* end date */}
        <Field className="flex flex-col space-y-2 w-fit">
          <Label>{t("filters.endDate")}</Label>
          <Input
            type="date"
            icon={<Calendar />}
            value={getParam("endDate") ?? ""}
            onChange={(e) => setParam("endDate", e.target.value)}
          />
        </Field>

        {/* start time */}
        <Field className="flex flex-col space-y-2 w-fit">
          <Label>{t("filters.startTime")}</Label>
          <Input
            type="time"
            icon={<Timer />}
            value={getParam("startTime") ?? ""}
            onChange={(e) => setParam("startTime", e.target.value)}
          />
        </Field>

        {/* start time */}
        <Field className="flex flex-col space-y-2 w-fit">
          <Label>{t("filters.endTime")}</Label>
          <Input
            type="time"
            icon={<Timer />}
            value={getParam("endTime") ?? ""}
            onChange={(e) => setParam("endTime", e.target.value)}
          />
        </Field>

        {/* department */}
        <Field className="flex flex-col space-y-2 w-fit">
          <Label size="md">{t("filters.searchBy.SearchByDeptartmentID")}</Label>
          {isDepartmentsLoading ? (
            <SelectBoxSkeleton />
          ) : (
            <CustomSelect
              options={departmentOptions}
              value={selectedDepartmentValue}
              onChange={(option) =>
                setParam("searchByDepartmentId", String(option?.value))
              }
              isSearchable
              isClearable
              className="w-65"
            />
          )}
        </Field>

        {/* sub department */}
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
              isClearable
              className="w-65"
            />
          )}
        </Field>
      </div>
    </>
  );
};

export default AttendanceTableFilters;
