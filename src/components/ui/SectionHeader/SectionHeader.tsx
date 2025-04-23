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
      <h2 className="text-2xl sm:text-3xl font-bold text-[#19355a] leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-base sm:text-lg text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
};

export default memo(SectionHeader);
