import { useTranslation } from "react-i18next";
import { CalendarSearch } from "lucide-react";
import { formatValue } from "../../../utils";
import { useDebounce } from "../../../hooks/debounce.hook";
import { useLanguageStore } from "../../../store/";
import { CountCard, Header, InfoPopup, Paginator, SectionHeader } from "../../../components/ui";
import { useGetAttendanceWithVacations } from "../../../hooks/";
import { ATTENDANCE_NS, ATTENDANCE_VACATION_VIDEO } from "../../../constants";
import useURLSearchParams from "../../../hooks/URLSearchParams.hook";
import { VacationTable, VacationTableFilters } from "./views";

const AttendanceVacationsPage = () => {
  const { t } = useTranslation([ATTENDANCE_NS]);
  const { language } = useLanguageStore();
  const {getParam, setParam, clearParams} = useURLSearchParams();

    // Using the enhanced getParam with parser support from the improved hook
    const rawPage = getParam('page', Number);
    const rawPageSize = getParam('pageSize', Number);
    const rawSearchKey = getParam('searchKey');
    const rawSearchQuery = useDebounce(getParam('searchQuery'), 650);
    const rawDepartmentId = getParam('searchByDepartmentId', Number);
    const rawSubDeptartmentId = getParam('searchBySubDeptartmentId', Number);
  
    // Use nullish coalescing to default numeric values, undefined for dates if empty
    const page = rawPage ?? 1;
    const pageSize = rawPageSize ?? 10;
    const searchKey = rawSearchKey || undefined;
    const searchQuery = useDebounce(rawSearchQuery, 650) || undefined;
    const departmentId = rawDepartmentId || "";
    const subDeptartmentId = rawSubDeptartmentId || "";

  const { attendanceWithVacations, totalAttendances, metadata, isAttendanceWithVacationsLoading } = useGetAttendanceWithVacations(
    page, pageSize, searchKey, searchQuery, departmentId || 0, subDeptartmentId || 0);


  return (
    <>
      <div className="sm:p-5 p-3 space-y-5">
        <Header heading={t("headerVacation.heading")} subtitle={t("headerVacation.subtitle")} />
        <div className="space-y-5 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="w-full flex items-center justify-center">
            <InfoPopup
              title={t("infoPopupVacation.title")}
              description={t("infoPopupVacation.description")}
              videoUrl={ATTENDANCE_VACATION_VIDEO}
            />
          </div>
          <CountCard 
            title={t("CountCardVacation.title")}
            description={t("CountCardVacation.description")}
            count={formatValue(totalAttendances, language)}
            icon={<CalendarSearch size={28} />} 
            bgColor="bg-[#b38e19]" 
          />
          {/* ActionCard */}
        </div>

        <div className="bg-white shadow-md space-y-5 p-5 rounded-lg">
          <SectionHeader 
            title={t("sectionHeaderVacation.title")} 
            description={t("sectionHeaderVacation.description")} 
          />

          <div className="flex flex-col gap-5">
            <VacationTableFilters searchBy={metadata.searchBy} getParam={getParam} setParam={setParam} clearParams={clearParams} />
          </div>
          <div className="w-full overflow-x-auto">
            <VacationTable 
              attendanceWithVacations={attendanceWithVacations}
              isLoading={isAttendanceWithVacationsLoading} 
            />
          </div>

          {/* Pagination Component */}
          <Paginator
            page={metadata?.pagination?.pageIndex || 0}
            totalPages={metadata?.pagination?.totalPages || 1}
            totalRecords={metadata?.pagination?.totalRecords || 0}
            isLoading={isAttendanceWithVacationsLoading}
            onClickFirst={() => setParam("page", String(1))}
            onClickPrev={() => setParam("page", String(Math.max((Number(getParam('page')) || 1) - 1, 1)))}
            onClickNext={() => setParam("page", String(Math.min((Number(getParam('page')) || 1) + 1, metadata?.pagination?.totalPages || 1)))}
          />
        </div>
      </div>
    </>
  )
}

export default AttendanceVacationsPage