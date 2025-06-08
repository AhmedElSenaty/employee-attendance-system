import { useTranslation } from "react-i18next";
import { CalendarSearch } from "lucide-react";
import { formatValue } from "../../../utils";
import { useDebounce } from "../../../hooks/debounce.hook";
import { useFiltersHook } from "../../../hooks/filter.hook";
import { AttendanceOverviewTable } from "./views";
import AttendanceOverviewTableFilters from "./views/AttendanceOverviewTableFilters";
import { ATTENDANCE_TRANSLATION_NAMESPACE } from ".";
import { useLanguageStore } from "../../../store/language.store";
import { CountCard, Header, Paginator, SectionHeader } from "../../../components/ui";
import { useGetAttendanceSummary } from "../../../hooks/attendance.hooks";

const AttendanceOverviewPage = () => {
  const { t } = useTranslation(["common", ATTENDANCE_TRANSLATION_NAMESPACE]);
  const { language } = useLanguageStore();

  const {
    page, pageSize, searchKey, search, 
    startDate, endDate, setFilters
  } = useFiltersHook()

  const debouncedSearchQuery = useDebounce(search, 650);

  const { attendanceSummary, totalAttendanceSummary, metadata, isAttendanceSummaryLoading } = useGetAttendanceSummary(
    Number(page) || 1, Number(pageSize) || 5, searchKey || "", debouncedSearchQuery || "",
    startDate || "", endDate || ""
  );


  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header heading={t("headerSummary.heading", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })} subtitle={t("headerSummary.subtitle", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })} />
        <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <CountCard 
            title={t("CountCardSummary.title", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
            description={t("CountCardSummary.description", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })}
            count={formatValue(totalAttendanceSummary, language)}
            icon={<CalendarSearch size={28} />} 
            bgColor="bg-[#b38e19]" 
          />
          {/* ActionCard */}
        </div>

        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("sectionHeaderSummary.title", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })} 
            description={t("sectionHeaderSummary.description", { ns: ATTENDANCE_TRANSLATION_NAMESPACE })} 
          />

          <div className="flex flex-col gap-5">
            <AttendanceOverviewTableFilters searchBy={metadata.searchBy} t={t} />
          </div>
          <div className="w-full overflow-x-auto">
            <AttendanceOverviewTable 
              attendanceSummary={attendanceSummary}
              isLoading={isAttendanceSummaryLoading} 
              t={t}
            />
          </div>

          {/* Pagination Component */}
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isAttendanceSummaryLoading}
            onClickFirst={() => setFilters({ page: 1 })}
            onClickPrev={() => setFilters({ page: Math.max((page || 1) - 1, 1) })}
            onClickNext={() => setFilters({ page: Math.min((page || 1) + 1, metadata?.pagination?.totalPages || 1) })}
          />
        </div>
      </div>
    </>
  )
}

export default AttendanceOverviewPage