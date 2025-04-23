const PaginatorSkeleton = () => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 animate-pulse">
      <div className="h-6 w-48 bg-gray-300 rounded"></div>

      <div className="flex flex-wrap justify-center items-center gap-2">
        <div className="h-10 w-24 bg-gray-300 rounded"></div>
        <div className="flex justify-center items-center gap-1">
          <div className="h-10 w-24 bg-gray-300 rounded"></div>
          <div className="h-10 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default PaginatorSkeleton;
