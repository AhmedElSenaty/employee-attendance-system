const FileUploadSkeleton = () => {
  return (
    <div className="flex justify-center rounded-lg border border-dashed border-[#19355a]/25 px-6 py-10 cursor-pointer animate-pulse">
      <div className="text-center">
        <div className="mx-auto mb-4 h-24 w-24 bg-gray-200 rounded-lg"></div>
        <div className="mx-auto size-12 bg-gray-300 text-gray-200 rounded-md mb-4"></div>
        <div className="mt-4 flex text-lg text-gray-600">
          <div className="relative cursor-pointer rounded-lg bg-white font-semibold text-[#b38e19] focus-within:ring-2 focus-within:ring-[#b38e19] focus-within:ring-offset-2">
            <span className="bg-gray-300 w-20 h-6 rounded-sm"></span>
            <input type="file" className="sr-only" />
          </div>
          <p className="pl-2 bg-gray-300 w-24 h-6 rounded-sm"></p>
        </div>
        <p className="text-xs text-gray-600 mt-2 bg-gray-300 w-32 h-4 rounded-sm"></p>
        <p className="text-sm text-gray-600 mt-2 bg-gray-300 w-32 h-4 rounded-sm"></p>
        <p className="text-sm text-red-500 mt-2 bg-gray-300 w-32 h-4 rounded-sm"></p>
      </div>
    </div>
  );
};

export default FileUploadSkeleton;
