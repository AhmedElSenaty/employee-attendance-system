interface BadgeSkeletonProps {
  size?: number; // in pixels
  bgColor?: string;
}

const BadgeSkeleton = ({
  size = 24,
  bgColor = "bg-gray-300",
}: BadgeSkeletonProps) => {
  return (
    <div
      role="status"
      aria-label="Loading badge"
      className={`inline-flex items-center justify-center rounded-full ${bgColor} animate-pulse`}
      style={{
        width: size,
        height: size,
      }}
    />
  );
};

export default BadgeSkeleton;
