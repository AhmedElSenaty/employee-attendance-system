import { TFunction } from "i18next"
import { Button, Field, Input, Label, SelectBox, SelectBoxSkeleton } from "../../../../components/ui"
import { formatValue } from "../../../../utils";
import { Calendar, Search, Timer } from "lucide-react";
import { useFiltersHook } from "../../../../hooks/useFiltersHook";
import { useGetDepartmentsList } from "../../../../hooks/useDepartmentHook";
import { useDepartmentSubDepartmentsList } from "../../../../hooks/useSubDepartmentHook";
import { ATTENDANCE_TRANSLATION_NAMESPACE } from "..";
import { useLanguageStore } from "../../../../store/language.store";

interface ISubDepartmentTableFiltersProps {
  searchBy: string[]
  t: TFunction
}

const AttendanceTableFilters = ({ searchBy, t }: ISubDepartmentTableFiltersProps) => {
  const { language } = useLanguageStore();
  const { pageSize, searchKey, search, startDate, endDate, startTime, endTime, status, searchByDepartmentId, searchBySubDeptartmentId, setFilters } = useFiltersHook()
  const { departmentsList, isDepartmentsLoading } = useGetDepartmentsList();
  const { subDepartmentsList, isSubDepartmentsLoading } = useDepartmentSubDepartmentsList(Number(searchByDepartmentId || ''));

  return (
    <>
      {/* Page Size */}
      <div className="flex flex-wrap gap-4">
        <Field className="space-y-3 w-full sm:w-auto flex flex-col">
          <Label>{t("pagination.pageSize")}</Label>
          <SelectBox value={pageSize ?? 5} onChange={(e) => setFilters({ pageSize: e.target.value ? parseInt(e.target.value) : 5 })}>
            {[5, 10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>{formatValue(size, language)}</option>
            ))}
          </SelectBox>
        </Field>

        {/* Search Type */}
        <Field className="space-y-3 w-full sm:w-auto flex flex-col">
          <Label size="md">{t("searchBy.label", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</Label>
          <SelectBox value={searchKey ?? ""} onChange={(e) => setFilters({ searchKey: e.target.value })} >
            <option value="">
              {t(`searchBy.default`, { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
            </option>
            {searchBy.map((search, idx) => (
              <option key={idx} value={String(search)}>
                {t(`searchBy.${String(search)}`, { ns: ATTENDANCE_TRANSLATION_NAMESPACE }) ?? ""}
              </option>
            ))}
          </SelectBox>
        </Field>

        {/* Search Input */}
        <Field className="flex-1 w-full sm:w-auto flex flex-col space-y-3">
          <Label size="md">{t("search.label")}</Label>
          <Input
            placeholder={t("search.placeholder")}
            icon={<Search size={18} className="text-gray-500" />}
            value={search ?? ""}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </Field>
      </div>
      <div className="flex flex-wrap gap-10">
        <div className="flex flex-row flex-wrap gap-1 md:gap-2 items-end justify-center">
          <Field className="space-y-3 w-full sm:w-auto flex flex-col items-center">
            <Label>{t("dateAndTime.startDate")}</Label>
            <Input
              type="date"
              icon={<Calendar />}
              value={startDate ?? ""}
              onChange={(e) => setFilters({ startDate: e.target.value })}
            />
          </Field>
          <span className="text-lg font-bold text-gray-800 capitalize">{t("dateAndTime.to")}</span>
          <Field className="space-y-3 w-full sm:w-auto flex flex-col items-center">
            <Label>{t("dateAndTime.endDate")}</Label>
            <Input
              type="date"
              icon={<Calendar />}
              value={endDate ?? ""}
              onChange={(e) => setFilters({ endDate: e.target.value })}
            />
          </Field>
        </div>

        <div className="flex flex-row flex-wrap gap-1 md:gap-2 items-end justify-center">
          <Field className="space-y-3 w-full sm:w-auto flex flex-col items-center">
            <Label>{t("dateAndTime.startTime")}</Label>
            <Input
              type="time"
              icon={<Timer />}
              value={startTime ?? ""}
              onChange={(e) => setFilters({ startTime: e.target.value })}
            />
          </Field>
          <span className="text-lg font-bold text-gray-800 capitalize">{t("dateAndTime.to")}</span>
          <Field className="space-y-3 w-full sm:w-auto flex flex-col items-center">
            <Label>{t("dateAndTime.endTime")}</Label>
            <Input
              type="time"
              icon={<Timer />}
              value={endTime ?? ""}
              onChange={(e) => setFilters({ endTime: e.target.value })}
            />
          </Field>
          <Field className="space-y-3 w-full sm:w-auto flex flex-col">
            <Label size="md">{t("status")}</Label>
            <SelectBox value={status ?? ""} onChange={(e) => setFilters({ status: e.target.value })} >
              <option value="">
                {t(`searchBy.default`, { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
              </option>
              {["حضور", "انصراف"].map((state, idx) => (
                <option key={idx} value={state}>
                  {state}
                </option>
              ))}
            </SelectBox>
          </Field>
        </div>
        <div className="flex flex-row flex-wrap gap-1 md:gap-2 items-end justify-center">

          <Field className="space-y-3 w-full sm:w-auto flex flex-col">
            <Label size="md">{t("searchBy.SearchByDeptartmentId", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</Label>
            {
              isDepartmentsLoading ? (
                <SelectBoxSkeleton />
              ) : (
                <SelectBox
                  onChange={(e) => setFilters({ searchBySubDeptartmentId: undefined, searchByDepartmentId: Number(e.target.value) || undefined })}
                  value={searchByDepartmentId || ''}
                >
                  <option value="">{t(`searchBy.default`, { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</option>
                  {departmentsList?.map((department, idx) => (
                    <option key={idx} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </SelectBox>
              )
            }
          </Field>
          <Field className="space-y-3 w-full sm:w-auto flex flex-col">
            <Label size="md">{t("searchBy.SearchBySubDeptartmentId", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</Label>
            {
              isSubDepartmentsLoading ? (
                <SelectBoxSkeleton />
              ) : (
                <SelectBox
                  onChange={(e) => setFilters({ searchBySubDeptartmentId: parseInt(e.target.value) })}
                  value={searchBySubDeptartmentId || ""}
                >
                  <option value="">{t(`searchBy.default`, { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}</option>
                  {subDepartmentsList?.map((subDepartment, idx) => (
                    <option key={idx} value={subDepartment.id}>
                      {subDepartment.name}
                    </option>
                  ))}
                </SelectBox>
              )
            }
          </Field>
          <Button onClick={() => {
            setFilters({ sort: undefined, searchKey: undefined, search: undefined, startDate: undefined, endDate: undefined, startTime: undefined, endTime: undefined, status: undefined })
          }}>
            {t("resetFilter")}
          </Button>
        </div>
      </div>
    </>
  )
}

export default AttendanceTableFilters