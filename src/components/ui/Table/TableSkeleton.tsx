interface IProps {
  numberOfColumns: number;
  defaultNumberOfRows: number
}

const TableSkeleton = ({ numberOfColumns, defaultNumberOfRows }: IProps) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg shadow-lg animate-pulse">
      <table className="min-w-full bg-gray-100 border border-gray-200 rounded-lg">
        {/* Table Header Skeleton */}
        <thead className="bg-gray-200 text-gray-500 uppercase text-sm font-semibold sticky top-0 z-10">
          <tr>
            {Array(numberOfColumns) // Adjust the number of columns if needed
              .fill("")
              .map((_, idx) => (
                <th key={idx} className="py-4 px-5 border-b border-gray-300">
                  <div className="h-4 w-24 bg-gray-300 rounded-md"></div>
                </th>
              ))}
          </tr>
        </thead>

        {/* Table Body Skeleton */}
        <tbody className="divide-y divide-gray-200">
          {Array(defaultNumberOfRows) // Adjust the number of rows if needed
            .fill("")
            .map((_, rowIdx) => (
              <tr key={rowIdx} className="border-b border-gray-300">
                {Array(numberOfColumns)
                  .fill("")
                  .map((_, colIdx) => (
                    <td key={colIdx} className="py-4 px-5">
                      <div className="h-4 w-full bg-gray-300 rounded-md"></div>
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
