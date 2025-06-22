import { useEffect, useState } from "react";
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
import { AttendanceEntry } from "../../../interfaces";
import { DayCard, DayCardSkeleton, Button, Header, Tooltip, InfoPopup } from "../../../components/ui";
import { useTranslation } from "react-i18next";
import { useUserStore, useLanguageStore } from "../../../store";
import { CALENDER_EMPLOYEE_VIDEO, CALENDER_MANAGER_VIDEO, CALENDER_NS } from "../../../constants";
import { useGetAttendanceCalendar } from "../../../hooks";
import { EmplyeeCard } from "./views";
import { useParams } from "react-router";

const CalendarPage = () => {
  const { id } = useParams();
  const role = useUserStore((state) => state.role);
  const { t } = useTranslation(CALENDER_NS);
  const { language } = useLanguageStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });
  
  useEffect(() => {
    setStartDate(startOfMonth(currentDate));
    setEndDate(endOfMonth(currentDate));
  }, [currentDate]);
  
  const { calenderDays, isLoading: isAttendanceCalenderLoading } = useGetAttendanceCalendar(
    id || "",
    format(startDate, 'yyyy-MM-dd'),
    format(endDate, 'yyyy-MM-dd')
  );

  const DAYS_LABELS = [
    "days.sunday",
    "days.monday",
    "days.tuesday",
    "days.wednesday",
    "days.thursday",
    "days.friday",
    "days.saturday",
  ]

  const daysLabels = DAYS_LABELS.map(key => t(key))
  
  const locale = language === "ar" ? arEG : enUS;
  
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const isInCurrentMonth = new Date().getFullYear() === currentDate.getFullYear()
  && new Date().getMonth() === currentDate.getMonth();

  return (
    <>
      {role !== "employee" && (
        <EmplyeeCard employeeId={id || ""} />
      )}
      <div className="w-full px-2 py-10 md:py-20 max-w-7xl mx-auto">
        <div className="flex ltr:flex-row rtl:flex-row-reverse justify-evenly items-center gap-4 mb-6 ">
          <Tooltip content={t("toolTipPrev")}>
            <Button
              fullWidth={false}
              size={"md"}
              shape="rounded"
              icon={<ChevronLeft className="w-full h-full" />}
              onClick={handlePrevMonth}
            />
          </Tooltip>
          <Header heading={format(currentDate, "MMMM yyyy", { locale })} />
          <Tooltip content={t("toolTipNext")}>
            <Button
              fullWidth={false}
              size={"md"}
              shape="rounded"
              icon={<ChevronRight className="w-full h-full" />}
              onClick={handleNextMonth}
              disabled={isInCurrentMonth}
            />
          </Tooltip>
        </div>

        <div className="w-full flex items-center justify-center">
          <InfoPopup
            title={t("infoPopup.title")}
            description={t("infoPopup.description")}
            videoUrl={role == "employee" ? CALENDER_EMPLOYEE_VIDEO : CALENDER_MANAGER_VIDEO}
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
                const info: AttendanceEntry = calenderDays?.[dateKey] || {
                  checkIn: "N/A",
                  checkOut: "N/A",
                  dayType: "absent",
                };

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