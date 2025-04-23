import { InputHTMLAttributes } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
}

const Radio = ({ isError = false, ...rest }: IProps) => {
  return (
        <input
          type="radio"
          className={`size-4 appearance-none rounded-full border border-gray-300 bg-white before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-[#b38e19] checked:bg-[#b38e19] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b38e19] disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden duration-75 ease-in-out
            ${isError ? "border-red-500 focus-visible:outline-red-500" : "border-gray-300"}`}
          {...rest}
        />
  );
};

Radio.displayName = "radio";


export default Radio