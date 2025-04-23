const AttendanceCardSkeleton = () => {
  return (
    <div className="flex items-start justify-between bg-gray-100 p-4 rounded-xl shadow w-full animate-pulse">
      {/* Left side: avatar + info */}
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-gray-300" />

        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-300 rounded" />
          <div className="h-3 w-48 bg-gray-300 rounded" />
          <div className="h-3 w-40 bg-gray-300 rounded" />
          <div className="h-3 w-36 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
};

export default AttendanceCardSkeleton;
