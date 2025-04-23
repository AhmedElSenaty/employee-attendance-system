import { memo, ReactNode } from "react";

interface IProps {
  textSize?: "sm" | "md" | "lg";
  textColor?: string;
  children: ReactNode;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export const Description = ({ textSize = "md", textColor = "text-gray-600", children }: IProps) => {
  return (
    <p className={`${sizeClasses[textSize]} ${textColor}`}>
      {children}
    </p>
  );
};

export default memo(Description);
