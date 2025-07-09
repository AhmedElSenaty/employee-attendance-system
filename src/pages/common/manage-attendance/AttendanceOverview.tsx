import { useTranslation } from "react-i18next";
import { CalendarSearch } from "lucide-react";
import { formatValue } from "../../../utils";
import { useDebounce } from "../../../hooks/debounce.hook";
import { useLanguageStore } from "../../../store/";
import { CountCard, Header, InfoPopup, Paginator, SectionHeader } from "../../../components/ui";
import { useGetAttendanceSummary } from "../../../hooks/";
import { ATTENDANCE_NS, ATTENDANCE_OVERVIEW_VIDEO } from "../../../constants";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { OverviewTable, VacationTableFilters } from "./views";

const AttendanceOverviewPage = () => {
  const { t } = useTranslation([ATTENDANCE_NS]);
  const { language } = useLanguageStore();
  const {getParam, setParam, clearParams} = useURLSearchParams();
  
    // Using the enhanced getParam with parser support from the improved hook
    const rawPage = getParam('page', Number);
    const rawPageSize = getParam('pageSize', Number);
    const rawStartDate = getParam('startDate');
    const rawEndDate = getParam('endDate');
    const rawSearchKey = getParam('searchKey');
    const rawSearchQuery = useDebounce(getParam('searchQuery'), 650);
  
    // Use nullish coalescing to default numeric values, undefined for dates if empty
    const page = rawPage ?? 1;
    const pageSize = rawPageSize ?? 10;
    const startDate = rawStartDate || undefined;
    const endDate = rawEndDate || undefined;
    const searchKey = rawSearchKey || undefined;
    const searchQuery = useDebounce(rawSearchQuery, 650) || undefined;

  const { attendanceSummary, count: totalAttendanceSummary, metadata, isLoading: isAttendanceSummaryLoading } = useGetAttendanceSummary(
    page, pageSize, searchKey, searchQuery, startDate, endDate);


  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header heading={t("headerSummary.heading")} subtitle={t("headerSummary.subtitle")} />
        <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="w-full flex items-center justify-center">
            <InfoPopup
              title={t("infoPopupSummary.title")}
              description={t("infoPopupSummary.description")}
              videoUrl={ATTENDANCE_OVERVIEW_VIDEO}
            />
          </div>
          <CountCard 
            title={t("CountCardSummary.title")}
            description={t("CountCardSummary.description")}
            count={formatValue(totalAttendanceSummary, language)}
            icon={<CalendarSearch size={28} />} 
            bgColor="bg-[#b38e19]" 
          />
          {/* ActionCard */}
        </div>

        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("sectionHeaderSummary.title")} 
            description={t("sectionHeaderSummary.description")} 
          />

          <div className="flex flex-col gap-5">
            <VacationTableFilters searchBy={metadata.searchBy} getParam={getParam} setParam={setParam} clearParams={clearParams} />
          </div>
          <div className="w-full overflow-x-auto">
            <OverviewTable 
              attendance={attendanceSummary}
              isLoading={isAttendanceSummaryLoading} 
            />
          </div>

          {/* Pagination Component */}
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isAttendanceSummaryLoading}
            onClickFirst={() => setParam("page", String(1))}
            onClickPrev={() => setParam("page", String(Math.max((Number(getParam('page')) || 1) - 1, 1)))}
            onClickNext={() => setParam("page", String(Math.min((Number(getParam('page')) || 1) + 1, metadata?.pagination?.totalPages || 1)))}
          />
        </div>
      </div>
    </>
  )
}

export default AttendanceOverviewPage