const CollapsibleSkeleton = () => {
  return (
    <div className="w-full bg-gray-200 rounded-2xl shadow-md border border-gray-300 animate-pulse">
      {/* Header Skeleton */}
      <div className="w-full flex items-center justify-between p-4 rounded-lg">
        <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
        <div className="h-6 w-6 bg-gray-300 rounded"></div>
      </div>

      {/* Collapsed Content Skeleton (Always visible with animation) */}
      <div className="overflow-hidden transition-all duration-500 ease-in-out">
        <div className="p-4 space-y-2">
          <div className="h-4 w-full bg-gray-300 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
          <div className="h-4 w-4/6 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSkeleton;
