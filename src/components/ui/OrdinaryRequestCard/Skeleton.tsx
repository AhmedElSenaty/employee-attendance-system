const OrdinaryRequestCardSkeleton = () => {
  return (
    <div className="w-full sm:w-[450px] min-h-[220px] rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4 bg-gray-50 animate-pulse">
      {/* Header: Date & Status */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="w-40 h-5 bg-gray-300 rounded-md"></div>
          <div className="w-28 h-4 bg-gray-300 rounded-md"></div>
        </div>
        <div className="w-20 h-8 bg-gray-300 rounded-full"></div>
      </div>

      {/* Info Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <div className="w-32 h-4 bg-gray-300 rounded-md"></div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <div className="w-48 h-4 bg-gray-300 rounded-md"></div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <div className="w-40 h-4 bg-gray-300 rounded-md"></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <div className="w-9 h-9 bg-gray-300 rounded-full"></div>
        <div className="w-9 h-9 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default OrdinaryRequestCardSkeleton;
