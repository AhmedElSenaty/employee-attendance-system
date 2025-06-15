const LogItemSkeleton = () => {
  return (
    <div className="border p-4 shadow-md rounded-md bg-gray-50 animate-pulse">
      <div className="flex items-start gap-4">
        {/* Icon Placeholder */}
        <div className="pt-1">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
        </div>

        {/* Content Placeholder */}
        <div className="flex-1 space-y-2">
          <div className="h-6 w-3/4 bg-gray-200 rounded-md" />

          <div className="space-y-1">
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
            <div className="h-4 w-2/5 bg-gray-200 rounded" />

            {/* Message Preview */}
            <div className="mt-2">
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-20 w-full bg-gray-100 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogItemSkeleton