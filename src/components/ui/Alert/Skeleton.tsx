const AlertSkeleton = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative w-full p-5 border border-gray-200 shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 ease-in-out animate-pulse bg-gray-50"
    >
      <div className="flex items-start gap-4">
        {/* Icon Placeholder */}
        <div className="pt-1">
          <div className="w-5 h-5 bg-gray-200 rounded-full" />
        </div>

        {/* Title & Content Placeholder */}
        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="w-1/2 h-4 bg-gray-200 rounded" />
          {/* Description / Children */}
          <div className="w-full h-3 bg-gray-200 rounded" />
          <div className="w-5/6 h-3 bg-gray-200 rounded" />
        </div>

        {/* Close Button Placeholder */}
        <div className="mt-1">
          <div className="w-5 h-5 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default AlertSkeleton;
