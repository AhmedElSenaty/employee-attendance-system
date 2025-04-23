interface IProps {
  borderSize?: string;
  width?: string;
  height?: string;
  borderColor?: string;
  borderTopColor?: string;
}

const NormalSpinner = ({
  borderSize = "border-4",
  width = "w-14",
  height = "h-14",
  borderColor = "border-gray-300",
  borderTopColor = "border-t-[#b38e19]",
}: IProps) => {
  return (
    <div
      className={`absolute ${width} ${height} ${borderSize} ${borderColor} rounded-full animate-spin ${borderTopColor}`}
    ></div>
  );
};

export default NormalSpinner;