import { ReactNode } from "react";
import clsx from "clsx";

interface IProps {
  icon: ReactNode;
  amount?: string | number;
  description?: string;
  note?: string;
  iconColor?: string; // Tailwind text color class
  iconBg?: string; // Tailwind bg color class
  cardBg?: string; // Tailwind bg color class for card
}

const StatCard = ({
  icon,
  amount = "N/A",
  description = "No Description",
  note,
  iconColor = "text-gray-700",
  iconBg = "bg-gray-100",
  cardBg = "bg-gray-50",
}: IProps) => {
  return (
    <div
      className={clsx(
        "p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 w-full min-h-[15rem]",
        cardBg
      )}
    >
      {/* Icon with background and color */}
      <div
        className={clsx(
          "w-10 h-10 flex items-center justify-center rounded-xl mb-4 text-3xl",
          iconColor,
          iconBg
        )}
      >
        {icon}
      </div>

      {/* Amount */}
      <p className="text-2xl font-bold text-gray-900 mb-1">{amount}</p>

      {/* Description */}
      <p className="text-gray-600 text-xl">{description}</p>

      {/* Note (optional) */}
      {note && <p className="mt-2 text-md text-blue-600 font-medium">{note}</p>}
    </div>
  );
};

export default StatCard;
