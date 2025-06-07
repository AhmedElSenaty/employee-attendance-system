import {
  useState,
  forwardRef,
  InputHTMLAttributes,
  Ref,
  ReactNode,
  MouseEvent,
} from "react";
import { Eye, EyeOff } from "lucide-react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
}

const Input = forwardRef(
  (
    {
      isError = false,
      icon,
      type,
      disabled = false,
      ...rest
    }: IProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    // Determine input type (toggle between "password" and "text")
    const inputType = type === "password" && showPassword ? "text" : type;

    // Handle date input click to trigger date and time picker
    const handleDateClick = (event: MouseEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (type === "date" || type === "time") {
        (event.target as HTMLInputElement).showPicker?.();
      }
    };

    return (
      <div className="relative w-full">
        {/* Left Icon (if provided) */}
        {icon && (
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            {icon}
          </span>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          onClick={handleDateClick}
          disabled={disabled}
          className={`
            block w-full rounded-lg px-3 py-2.5 text-base sm:text-lg text-[#19355a]
            placeholder:text-gray-400 outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 
            duration-75 ease-in-out
            ${icon ? "pl-16" : ""}
            ${isError ? "outline-red-300 focus:outline-red-600" : "outline-gray-300 focus:outline-[#b38e19]"}
            ${disabled ? "bg-gray-200 cursor-not-allowed opacity-70" : "bg-white"}
          `}
          {...rest}
        />

        {/* Password Toggle Icon */}
        {type === "password" && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 ltr:right-3 rtl:left-3 flex items-center text-gray-500 cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
