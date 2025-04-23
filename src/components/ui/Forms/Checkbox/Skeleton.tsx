const CheckboxSkeleton = () => {
  return (
    <div className="flex h-6 shrink-0 items-center">
      <div className="grid size-4 grid-cols-1">
        <div className="col-start-1 row-start-1 h-full w-full bg-gray-200 rounded-sm animate-pulse"></div>
        <div className="col-start-1 row-start-1 size-3.5 self-center justify-self-center bg-gray-300 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
};

export default CheckboxSkeleton;
