// DayCardSkeleton.tsx

const DayCardSkeleton = () => {
  return (
    <div className="p-3 min-h-40 flex flex-col gap-1 shadow-md rounded-2xl border transition-all border-gray-200 duration-300 ease-in-out bg-gray-100 animate-pulse">
      <div className="animate-pulse space-y-4">
        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
        <div className="h-10 bg-gray-300 rounded w-1/4"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
    </div>
  );
};

export default DayCardSkeleton;
