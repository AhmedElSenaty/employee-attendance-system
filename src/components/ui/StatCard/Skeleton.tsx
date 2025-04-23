const StatCardSkeleton = () => {
  return (
    <div className="w-[240px] h-[240px] flex flex-col justify-between p-6 rounded-lg shadow-lg bg-gray-200 animate-pulse">
      {/* Icon Skeleton */}
      <div className="w-14 h-14 rounded-full bg-gray-300"></div>

      {/* Amount Skeleton */}
      <div className="h-8 w-3/4 bg-gray-300 rounded-md"></div>

      {/* Description Skeleton */}
      <div className="h-5 w-1/2 bg-gray-300 rounded-md"></div>

      {/* Note Skeleton */}
      <div className="h-4 w-1/3 bg-gray-300 rounded-md"></div>
    </div>
  );
};

export default StatCardSkeleton;
