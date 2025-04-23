import { format } from "date-fns";
import { cva } from "class-variance-authority";
import { useTranslation } from "react-i18next";

type DayType = "workday" | "holiday" | "weekend" | "absent" | "other";

interface DayCardProps {
  day: Date;
  weekdayLabel: string;
  dayType: DayType;
  checkIn: string;
  checkOut: string;
}

const dayCardVariants = cva("p-3 min-h-40 flex flex-col gap-1 shadow-md rounded-2xl border transition-all duration-300 ease-in-out", {
  variants: {
    dayType: {
      workday: "bg-green-100 border-green-500 text-green-700 hover:shadow-xl",
      holiday: "bg-yellow-100 border-yellow-500 text-yellow-700 hover:shadow-xl",
      absent: "bg-red-100 border-red-500 text-red-700 hover:shadow-xl",
      weekend: "bg-blue-100 border-blue-500 text-blue-700 hover:shadow-xl",
      other: "bg-gray-100 border-gray-300 text-gray-800 hover:shadow-xl",
    },
  },
  defaultVariants: {
    dayType: "other", // Default to "other" if no `dayType` is provided
  },
});

const DayCard = ({ day, weekdayLabel, dayType, checkIn, checkOut }: DayCardProps) => {
  const { t } = useTranslation(["calenderPage"]);
  return (
    <div className={dayCardVariants({ dayType })}>
      <div className="text-lg text-gray-500 font-semibold">{weekdayLabel}</div>
      <div className="text-lg font-bold">{format(day, "d")}</div>
      <div>
        {t("checkIn")}: <span className="font-medium">{checkIn}</span>
      </div>
      <div>
        {t("checkOut")}: <span className="font-medium">{checkOut}</span>
      </div>
    </div>
  );
};

export default DayCard;
