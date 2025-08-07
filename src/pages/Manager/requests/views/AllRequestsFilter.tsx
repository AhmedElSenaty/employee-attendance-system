import { Calendar, RefreshCcw, Search } from "lucide-react";
import {
  Button,
  CustomSelect,
  Field,
  Input,
  Label,
  SelectBox,
  SelectBoxSkeleton,
  Tooltip,
} from "../../../../components/ui";
import { RequestStatusType } from "../../../../enums";
import { useTranslation } from "react-i18next";
import { formatValue } from "../../../../utils";
import { useLanguageStore } from "../../../../store/language.store";
import { LEAVE_REQUESTS_NS } from "../../../../constants";
import { LeaveType } from "../../../../enums/requestTypes.enum";
import { useGetEmployeesList } from "../../../../hooks";
import { EmployeeSummary } from "../../../../interfaces";
import { useSearchParams } from "react-router";

interface FiltersProps {
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  clearParams: () => void;
  searchBy: string[];
}

const AllRequestsFilters = ({
  searchBy,
  getParam,
  setParam,
  clearParams,
}: FiltersProps) => {
  const { t } = useTranslation(LEAVE_REQUESTS_NS);
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
      value: employee.name, // ✅ Use name, not ID
      label: employee.name,
    })) || [];

  const searchByOptions = searchBy.map((search) => ({
    value: search || "",
    label: t(`filters.searchBy.${String(search)}`) ?? "",
  }));

  const selectedSearchByValue = searchByOptions.find(
    (opt) => opt.value === (getParam("searchKey") ? getParam("searchKey") : "")
  );
  console.log(searchParams);
  console.log("LeaveType Param:", getParam("leaveType"));
  return (
    <div className="flex flex-wrap items-end gap-4">
      <Field className="flex flex-col space-y-2 w-fit">
        <Label>{t("filters.pageSize")}</Label>
        <SelectBox
          value={getParam("pageSize") ?? 5}
          onChange={(e) =>
            setParam(
              "pageSize",
              String(e.target.value ? parseInt(e.target.value) : 10)
            )
          }
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              {formatValue(size, language)}
            </option>
          ))}
        </SelectBox>
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

      {/* Employee name */}
      <Field className="space-y-2 w-[300px]">
        <Label size="lg">{t("table.columns.employeeName")}</Label>

        {isEmployeesListLoading ? (
          <SelectBoxSkeleton />
        ) : (
          <CustomSelect
            placeholder={t("filters.select.placeholder")}
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
            isClearable
          />
        )}
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

      <Field className=" flex flex-col space-y-2">
        <Label size="md">{t("filters.leaveStatus")}</Label>

        <CustomSelect
          placeholder={t("filters.select.placeholder")}
          options={Object.values(RequestStatusType)
            .filter((v) => typeof v === "number")
            .map((statusValue) => ({
              value: String(statusValue),
              label: t(`status.${statusValue}`),
            }))}
          value={
            getParam("status")
              ? {
                  value: getParam("status"),
                  label: t(`status.${getParam("status")}`),
                }
              : null
          }
          onChange={(option) => {
            const selectedValue = option?.value;

            const newParams = new URLSearchParams(searchParams);
            if (selectedValue) {
              newParams.set("status", selectedValue);
            } else {
              newParams.delete("status"); // ✅ Removes from URL
            }

            setSearchParams(newParams);
          }}
          isClearable
          isSearchable
          className="w-50"
        />
      </Field>

      <Field className="flex flex-col space-y-2">
        <Label>{t("filters.leaveType")}</Label>

        <CustomSelect
          placeholder={t("filters.select.placeholder")}
          options={Object.values(LeaveType)
            .filter((v) => typeof v === "number")
            .map((typeValue) => ({
              value: String(typeValue),
              label: t(`leaveType.${typeValue}`),
            }))}
          value={
            getParam("leaveType")
              ? {
                  value: getParam("leaveType"),
                  label: t(`leaveType.${getParam("leaveType")}`),
                }
              : null
          }
          onChange={(option) => {
            const selectedValue = option?.value;
            const newParams = new URLSearchParams(searchParams);
            if (selectedValue) {
              newParams.set("leaveType", selectedValue);
            } else {
              newParams.delete("leaveType");
            }
            setSearchParams(newParams);
          }}
          isClearable
          isSearchable
          className="w-50"
        />
      </Field>

      <Tooltip content={t("filters.toolTipResetFilters")}>
        <Button onClick={clearParams} icon={<RefreshCcw />} />
      </Tooltip>
    </div>
  );
};

export default AllRequestsFilters;
