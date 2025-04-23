import { useTranslation } from "react-i18next";
import { CalendarSearch } from "lucide-react";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { Header } from "../../../components/ui/Header";
import { Paginator } from "../../../components/ui/Paginator";
import { formatValue } from "../../../utils";
import { useSelector } from "react-redux";
import { RootState } from "../../../context/store";
import { useDebounce } from "../../../hooks/useDebounceHook";
import { CountCard } from "../../../components/ui/CountCard";
import { useFiltersHook } from "../../../hooks/useFiltersHook";
import { AttendanceOverviewTable } from "./views";
import { useGetAllAttendancSummary } from "../../../hooks/useAttendanceHook";
import AttendanceOverviewTableFilters from "./views/AttendanceOverviewTableFilters";
import { ATTENDANCE_TRANSLATION_NAMESPACE } from ".";

const AttendanceOverviewPage = () => {
  const { t } = useTranslation(["common", ATTENDANCE_TRANSLATION_NAMESPACE]);
  const { language } = useSelector((state: RootState) => state.language);

  const {
    page, pageSize, searchKey, search, 
    startDate, endDate, setFilters
  } = useFiltersHook()

  const debouncedSearchQuery = useDebounce(search, 650);

  const { attendanceSummary, totalAttendanceSummary, metadata, isAttendanceSummaryLoading } = useGetAllAttendancSummary(
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