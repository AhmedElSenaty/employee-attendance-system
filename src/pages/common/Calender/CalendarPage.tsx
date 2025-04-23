import { useEffect, useMemo, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import { arEG, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../context/store";
import { useFiltersHook } from "../../../hooks/useFiltersHook";
import { useParams } from "react-router";
import { useGetAttendanceCalenderByEmployeeID } from "../../../hooks/useAttendanceHook";
import { IAttendanceEntry } from "../../../interfaces";
import { Button } from "../../../components/ui/Button";
import { Header } from "../../../components/ui/Header";
import { DayCard, DayCardSkeleton } from "../../../components/ui/Calendar";
import { useTranslation } from "react-i18next";
import { CALENDER_TRANSLATION_NAMESPACE, DAYS_LABELS } from ".";
import { useGetEmployeeByID } from "../../../hooks/useEmployeesHook";
import { UserProfileCard, UserProfileCardSkeleton } from "../../../components/ui/UserProfileCard";

const CalendarPage = () => {
  const { id } = useParams();

  const { t } = useTranslation(["common", CALENDER_TRANSLATION_NAMESPACE]);
  const { language } = useSelector((state: RootState) => state.language);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const { startDate, endDate, setFilters } = useFiltersHook()
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });
  
  useEffect(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    setFilters({ startDate: format(start, 'yyyy-MM-dd'), endDate: format(end, 'yyyy-MM-dd') })
  }, [currentDate, setFilters])
  
  const { calenderDays, isAttendanceCalenderLoading } = useGetAttendanceCalenderByEmployeeID(id || "", startDate || format(startOfMonth(currentDate), 'yyyy-MM-dd'), endDate || format(endOfMonth(currentDate), 'yyyy-MM-dd'))

  const { employee , isEmployeeDataLoading} = useGetEmployeeByID(id || "")

  const daysLabels = useMemo(
    () => DAYS_LABELS.map(key => t(key, { ns: CALENDER_TRANSLATION_NAMESPACE })),
    [t]
  );
  
  const locale = language === "ar" ? arEG : enUS;
  
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <>
      {!employee || isEmployeeDataLoading ? (
        <UserProfileCardSkeleton />
      ) : (
        <UserProfileCard user={employee} />
      )
      }
      <div className="w-full px-2 py-10 md:py-20 max-w-7xl mx-auto">
        <div className="flex ltr:flex-row rtl:flex-row-reverse justify-evenly items-center gap-4 mb-6 ">
          <Button
            fullWidth={false}
            size={"md"}
            shape="rounded"
            icon={<ChevronLeft className="w-full h-full" />}
            onClick={handlePrevMonth}
          />
          <Header heading={format(currentDate, "MMMM yyyy", { locale })} />
          <Button
            fullWidth={false}
            size={"md"}
            shape="rounded"
            icon={<ChevronRight className="w-full h-full" />}
            onClick={handleNextMonth}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 mt-3">
          {isAttendanceCalenderLoading ? (
              days.map((_, index) => (
                <DayCardSkeleton key={index} />
              ))
            ) : (
              days.map((day, i) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const info: IAttendanceEntry = calenderDays?.[dateKey] || {
                  checkIn: "N/A",
                  checkOut: "N/A",
                  dayType: "absent",
                };

                // 👇 Get weekday name
                const weekdayLabel = daysLabels[day.getDay()];

                return (
                  <DayCard
                    key={i}
                    day={day}
                    weekdayLabel={weekdayLabel}
                    dayType={info.dayType}
                    checkIn={info.checkIn}
                    checkOut={info.checkOut}
                  />
                );
              })
            )
          }
        </div>
      </div>
    </>
  );
};

export default CalendarPage