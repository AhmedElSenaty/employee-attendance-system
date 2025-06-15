import { formatValue } from "../../../../utils";
import { RefreshCcw, Search } from "lucide-react";
import { useLanguageStore } from "../../../../store/language.store";
import { Button, Field, Input, Label, SelectBox, SelectBoxSkeleton, Tooltip } from "../../../../components/ui";
import { useTranslation } from "react-i18next";
import { ATTENDANCE_NS } from "../../../../constants";
import { useGetDepartmentsList, useGetDepartmentSubDepartments } from "../../../../hooks";

interface ITableFiltersProps {
  searchBy: string[]
  getParam: (key: string) => string | number | null;
  setParam: (key: string, value: string) => void;
  clearParams: () => void;
}

const VacationTableFilters = ({ searchBy, getParam, setParam, clearParams }: ITableFiltersProps) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation([ATTENDANCE_NS]);

  const departmentId = getParam("searchByDepartmentId")

  const { departmentsList, isDepartmentsLoading } = useGetDepartmentsList();
  const { subDepartmentsList, isSubDepartmentsLoading } = useGetDepartmentSubDepartments(Number(departmentId || ''));

  return (
    <>
      <div className="w-full flex flex-wrap items-end gap-4">
        <Field className="flex flex-col space-y-2 w-fit">
          <Label>{t("filters.pageSize")}</Label>
          <SelectBox
            value={getParam("pageSize") ?? 10}
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
        <Field className="flex flex-col space-y-2 w-fit">
          <Label size="md">{t("filters.searchBy.label")} </Label>
          <SelectBox onChange={(e) => setParam("searchKey", e.target.value)}>
            <option value="" selected={getParam("searchKey") == null} disabled>
              {t(`filters.searchBy.default`)}
            </option>
            {searchBy.map((search, idx) => (
              <option key={idx} value={String(search)}>
                {t(`filters.searchBy.${String(search)}`) ?? ""}
              </option>
            ))}
          </SelectBox>
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

        <Tooltip content={t("filters.toolTipResetFilters")}>
          <Button onClick={clearParams} icon={<RefreshCcw />} />
        </Tooltip>
      </div>
      <div className="full flex flex-wrap items-end gap-4">

        <Field className="flex flex-col space-y-2 w-fit">
          <Label size="md">{t("filters.searchBy.SearchByDeptartmentID")}</Label>
          {
            isDepartmentsLoading ? (
              <SelectBoxSkeleton />
            ) : (
              <SelectBox
                onChange={(e) => setParam("searchByDepartmentId", e.target.value)}
              >
                <option value="">{t(`filters.defaultDepartmentpOption`)}</option>
                {departmentsList?.map((department, idx) => (
                  <option key={idx} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </SelectBox>
            )
          }
        </Field>
        <Field className="flex flex-col space-y-2 w-fit">
          <Label size="md">{t("filters.searchBy.SearchBySubDeptartmentId")}</Label>
          {
            isSubDepartmentsLoading ? (
              <SelectBoxSkeleton />
            ) : (
              <SelectBox
                onChange={(e) => setParam("searchBySubDeptartmentId", e.target.value)}
              >
                <option value="">{t(`filters.defaultSubDepartmentpOption`)}</option>
                {subDepartmentsList?.map((subDepartment, idx) => (
                  <option key={idx} value={subDepartment.id}>
                    {subDepartment.name}
                  </option>
                ))}
              </SelectBox>
            )
          }
        </Field>
      </div>
    </>
  )
}

export default VacationTableFilters