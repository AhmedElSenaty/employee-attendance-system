// WeekdaysHeaderSkeleton.tsx
const WeekdaysHeaderSkeleton = () => {
  return (
    <div className="grid grid-cols-7 gap-2 text-center text-gray-500 font-semibold text-xl max-xl:hidden">
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="h-6 bg-gray-300 rounded w-full animate-pulse"></div>
      ))}
    </div>
  );
};

export default WeekdaysHeaderSkeleton;
