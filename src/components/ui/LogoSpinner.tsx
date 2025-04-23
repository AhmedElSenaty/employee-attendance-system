import { Logo } from "./Logo";
import { NormalSpinner } from "./Spinner";

interface IProps {
  text?: string;
  bgColor?: string;
  textColor?: string;
}

export const LogoSpinner = ({ text = "Loading...", bgColor = "bg-white", textColor = 'text-white' }: IProps) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor}`}>
      {/* Spinner Wrapper */}
      <div className="relative flex items-center justify-center">
        {/* Spinning Effect */}

        <NormalSpinner 
          width="w-56" 
          height="h-56" 
        />


        {/* Logo in Center */}
        <Logo width="w-36" height="h-36" />
      </div>

      {/* Loading Text */}
      <p className={`mt-14 ${textColor} text-lg font-semibold`}>{text}</p>
    </div>
  );
};
