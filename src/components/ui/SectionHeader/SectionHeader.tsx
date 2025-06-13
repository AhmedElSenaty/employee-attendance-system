import { memo } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

const SectionHeader = ({
  title,
  description,
  className = "",
}: SectionHeaderProps) => {
  return (
    <div className={`${className}`}>
      <h2 className="text-lg sm:text-2xl font-bold text-[#19355a] leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm sm:text-base text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
};

export default memo(SectionHeader);
