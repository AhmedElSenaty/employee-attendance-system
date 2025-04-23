const ActionCardSkeleton = () => {
  return (
    <div className="w-full h-full bg-white border border-gray-100 shadow-md rounded-2xl p-6 transition-all hover:shadow-xl animate-pulse">
      <div className="flex flex-col items-center text-center space-y-5">
        {/* Icon Placeholder */}
        <div className="w-16 h-16 rounded-full bg-gray-200" />

        {/* Title Placeholder */}
        <div className="h-5 w-3/4 max-w-[200px] bg-gray-200 rounded-md" />

        {/* Description Placeholder */}
        <div className="h-4 w-5/6 max-w-[250px] bg-gray-200 rounded-md" />
        <div className="h-4 w-4/6 max-w-[200px] bg-gray-200 rounded-md" />

        {/* Children Placeholder */}
        <div className="w-full h-10 bg-gray-200 rounded-lg mt-6" />
      </div>
    </div>
  );
};

export default ActionCardSkeleton;
