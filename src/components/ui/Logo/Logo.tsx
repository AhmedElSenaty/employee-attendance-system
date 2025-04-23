import logo from "../../../assets/logos/helwan-logo.png";

interface IProps {
  src?: string;
  width?: string;
  height?: string;
  bgColor?: string;
}

const Logo = ({
  src = logo,
  width = "w-32",
  height = "h-auto",
  bgColor = "",
}: IProps) => {
  return (
    <div className={`flex justify-center items-center ${bgColor}`}>
      <img
        src={src} // Use dynamic source
        alt="Helwan University Logo"
        className={`${width} ${height} object-contain rounded-lg shadow-md`}
      />
    </div>
  );
};

export default Logo;
