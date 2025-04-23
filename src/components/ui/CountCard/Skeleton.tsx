const CountCardSkeleton = () => {
  return (
    <div className="w-full max-w-sm h-fit bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex flex-col space-y-2">
          <div className="h-6 w-32 bg-gray-300 rounded-md"></div>
          <div className="h-4 w-48 bg-gray-300 rounded-md"></div>
        </div>
        <div className="flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default CountCardSkeleton;
