interface IProps {
  count?: number;
  textColor?: string;
  bgColor?: string;
  pulse?: boolean; // Optional: toggle pulse animation
  showZero?: boolean; // Optional: show "0" if true
}

const Badge= ({
  count,
  textColor = "text-white",
  bgColor = "bg-blue-500",
  pulse = false,
}: IProps) => {

  const sizeClass =
    count && count.toString().length > 2
      ? "px-2 h-6 min-w-[1.5rem]"
      : "w-4 h-4";

  return (
    <span
      aria-label={`Count: ${count}`}
      className={`inline-flex items-center justify-center text-xs font-semibold rounded-full transition-transform duration-300 hover:scale-110 ${sizeClass} ${textColor} ${bgColor} ${
        pulse ? "animate-pulse" : ""
      }`}
    >
      {count}
    </span>
  );
};

export default Badge;
