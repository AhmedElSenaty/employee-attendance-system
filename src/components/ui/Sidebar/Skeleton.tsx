const SidebarSkeleton = () => {
  return (
    <>
      {/* Sidebar Skeleton Toggle Button */}
      <aside className="flex flex-col items-center gap-7 pt-5 w-20 h-screen shadow-xl sticky left-0 top-0 animate-pulse">
        <div className="w-10 h-10 bg-gray-300 rounded-md"></div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
          <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
          <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
        </div>
      </aside>

      {/* Sidebar Skeleton Container */}
      <div className="z-50 fixed top-0 ltr:left-0 rtl:right-0 h-full w-80 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out animate-pulse">
        {/* Sidebar Skeleton Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="w-40 h-6 bg-gray-300 rounded-md"></div>
          <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
        </div>

        {/* Sidebar Skeleton Navigation */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          <ul className="space-y-3">
            <li className="w-full h-10 bg-gray-300 rounded-md"></li>
            <li className="w-full h-10 bg-gray-300 rounded-md"></li>
            <li className="w-full h-10 bg-gray-300 rounded-md"></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SidebarSkeleton;
