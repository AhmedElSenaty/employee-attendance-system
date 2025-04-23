// WeekdaysHeader.tsx
const WeekdaysHeader = ({ daysLabels }: { daysLabels: string[] }) => {
  return (
    <div className="grid grid-cols-7 gap-2 text-center text-gray-600 font-semibold text-xl max-xl:hidden">
      {daysLabels.map((day, i) => (
        <div key={i} className="text-gray-700">
          {day}
        </div>
      ))}
    </div>
  );
};

export default WeekdaysHeader;
