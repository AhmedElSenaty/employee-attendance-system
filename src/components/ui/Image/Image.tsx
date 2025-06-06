import { ImgHTMLAttributes } from "react";

interface IProps extends ImgHTMLAttributes<HTMLImageElement> {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}

const Image = ({ width = "w-auto", height = "h-auto", rounded = "rounded-none", className = "", ...rest }: IProps) => {
  return (
    <img
      className={`${width} ${height} ${rounded} object-cover ${className}`}
      {...rest}
    />
  );
};

export default Image;
