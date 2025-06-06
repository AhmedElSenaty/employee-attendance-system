import { useState, useRef, useEffect } from "react";

const GraphSkeleton = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="bg-white p-6 shadow-md rounded-2xl w-full h-full">
      {/* Title Skeleton */}
      <div className="text-center mb-4">
        <div className="w-32 h-6 bg-gray-200 animate-pulse mx-auto rounded"></div>
        <div className="w-64 h-4 bg-gray-200 animate-pulse mx-auto rounded mt-2"></div>
      </div>

      {/* Chart Skeleton */}
      <div className="flex justify-center items-center">
        <div
          className="bg-gray-200 animate-pulse rounded"
          style={{ width: dimensions.width * 0.8, height: dimensions.height * 0.6 }}
        ></div>
      </div>
    </div>
  );
};

export default GraphSkeleton;
