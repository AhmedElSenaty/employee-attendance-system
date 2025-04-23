const FutureCardSkeleton = () => {
  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-md border border-gray-200 animate-pulse">
      {/* Icon Skeleton */}
      <div className="h-10 w-10 bg-gray-300 rounded-full mb-4"></div>

      {/* Title Skeleton */}
      <div className="h-6 w-3/4 bg-gray-300 rounded-md mb-2"></div>

      {/* Description Skeleton */}
      <div className="h-4 w-full bg-gray-300 rounded-md mb-1"></div>
      <div className="h-4 w-5/6 bg-gray-300 rounded-md"></div>
    </div>
  );
};

export default FutureCardSkeleton;
