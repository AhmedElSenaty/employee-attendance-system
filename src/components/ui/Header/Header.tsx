


import { memo, ReactNode } from "react";

interface IProp {
  heading: ReactNode;
  subtitle?: ReactNode;
  headingColor?: string;
  subtitleColor?: string;
}

const Header = ({
  heading,
  subtitle,
  headingColor = "text-gray-800",
  subtitleColor = "text-gray-600"
}: IProp) => {
  return (
    <div className="text-center px-4 sm:px-8 md:px-16 drop-shadow-lg">
      {/* Heading */}
      <h1
        className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold capitalize ${headingColor} leading-tight tracking-wide transition-all duration-300 ease-in-out transform`}
      >
        {heading}
      </h1>
      
      {/* Subtitle */}
      {subtitle && (
        <p
          className={`text-lg sm:text-xl md:text-2xl font-medium mt-2 ${subtitleColor} sm:mt-2 md:mt-4 tracking-wide opacity-75 transition-opacity duration-300 ease-in-out`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default memo(Header);
