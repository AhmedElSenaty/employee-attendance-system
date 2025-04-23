import IProps from "./IProps";


const LogoSkeleton = ({ width = "w-32", height = "h-auto", bgColor }: IProps) => {
  return (
    <div className={`flex justify-center items-center p-4 ${bgColor || ""}`}>
      <div className={`${width} ${height} bg-gray-300 rounded-lg animate-pulse`}></div>
    </div>
  );
};

export default LogoSkeleton;
