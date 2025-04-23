const UserProfileCardSkeleton = () => {
  return (
    <div className="max-w-[1000px] mx-auto bg-gray-200 rounded-lg shadow animate-pulse p-6 flex flex-wrap items-center gap-4">
      {/* Profile Image Skeleton */}
      <div className="w-40 h-40 bg-gray-300 rounded-xl"></div>

      {/* Right Content Skeleton */}
      <div className="flex-1 space-y-4">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="w-48 h-6 bg-gray-300 rounded"></div>
            <div className="w-64 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="w-24 h-9 bg-gray-300 rounded-md"></div>
        </div>

        {/* Info Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-4 w-full bg-gray-300 rounded"></div>
          ))}
        </div>

        {/* Status Badges Skeleton */}
        <div className="flex space-x-8 pt-4">
          <div className="space-y-2">
            <div className="w-28 h-4 bg-gray-300 rounded"></div>
            <div className="w-24 h-8 bg-gray-300 rounded-md"></div>
          </div>
          <div className="space-y-2">
            <div className="w-28 h-4 bg-gray-300 rounded"></div>
            <div className="w-24 h-8 bg-gray-300 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCardSkeleton;
