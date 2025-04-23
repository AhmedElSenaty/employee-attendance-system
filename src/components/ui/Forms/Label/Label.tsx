import { ReactNode } from "react";

interface IProps {
  textColor?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const Label = ({ textColor = "text-[#19355a]", className = "", size = "md", children, ...rest }: IProps) => {

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    children && (
      <label
        className={`block font-medium ${textColor} ${sizeClasses[size]} ${className}`}
        { ...rest }
      >
        {children}
      </label>
    )
  );
};

Label.displayName = "label";

export default Label;
