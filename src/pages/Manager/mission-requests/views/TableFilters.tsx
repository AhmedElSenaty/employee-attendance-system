import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../../store/language.store";
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
import { formatValue } from "../../../../utils";
import { Calendar, RefreshCcw, Search } from "lucide-react";
import { RequestStatusType } from "../../../../enums";
import { MISSION_REQUESTS_NS } from "../../../../constants";
import { EmployeeSummary } from "../../../../interfaces";
import { useSearchParams } from "react-router";
import { useGetEmployeesList } from "../../../../hooks";

interface FiltersProps {
  searchBy: string[];
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  clearParams: () => void;
}

const TableFilters = ({
  searchBy,
  getParam,
  setParam,
  clearParams,
}: FiltersProps) => {
  const { t } = useTranslation(MISSION_REQUESTS_NS);
  const { language } = useLanguageStore(); // Accessing the current language from the Redux state

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

  return (
    <div className="w-full flex flex-wrap items-end gap-4">
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
        <Label size="md">{t("form.status.label")}</Label>

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
        <Label size="lg">{t("inputs.employeeId.label")}</Label>
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
            isClearable
          />
        )}
      </Field>

      <Tooltip content={t("filters.toolTipResetFilters")}>
        <Button onClick={clearParams} icon={<RefreshCcw />} />
      </Tooltip>
    </div>
  );
};

export default TableFilters;
