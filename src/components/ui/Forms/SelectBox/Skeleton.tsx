const SelectBoxSkeleton = () => {
  return (
    <div className="relative w-full animate-pulse">
      <div className="w-full h-10 rounded-md bg-gray-200"></div>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 bg-gray-200 rounded-full"></div>
    </div>
  );
};

export default SelectBoxSkeleton;
