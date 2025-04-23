import { ReactNode, memo } from "react";

interface IGraphProps {
  title: string;
  description?: string;
  children?: ReactNode;
  width: string;
  height: string;
}

const Graph = ({
  title,
  description,
  children,
  width = "w-full",
  height = "h-fit",
}: IGraphProps) => {
  return (
    <div
      className={`bg-white border border-gray-100 shadow-md rounded-2xl p-6 hover:shadow-xl transition-all duration-300 ease-in-out focus-within:ring-2 focus-within:ring-blue-500 ${width} ${height}`}
      role="region"
      aria-labelledby={`graph-${title.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <div className="h-full flex flex-col items-center justify-between">
        {/* Title and Description */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <h2
            id={`graph-${title.replace(/\s+/g, "-").toLowerCase()}`}
            className="text-xl font-semibold text-gray-900"
          >
            {title}
          </h2>
          {description && (
            <p className="text-gray-600 text-base max-w-md">{description}</p>
          )}
        </div>

        {/* Chart Area */}
        <div className="w-full flex flex-col justify-center items-center bg-gray-50 border rounded-xl shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default memo(Graph);
