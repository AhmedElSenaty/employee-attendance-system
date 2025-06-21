import { ButtonHTMLAttributes, memo, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const ButtonVariants = cva(
  "inline-flex items-center justify-center relative font-semibold border-0 transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-[#19355a] text-white hover:bg-[#27285d]",
        secondary: "bg-[#b38e19] text-white hover:bg-[#ad8700]",
        info: "bg-blue-500 text-white hover:bg-blue-600",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600",
        error: "bg-red-500 text-white hover:bg-red-600",
        success: "bg-green-500 text-white hover:bg-green-600",
        danger: "bg-[#c2344d] text-white hover:bg-red-700",
        cancel: "bg-gray-300 text-black hover:bg-gray-400",
        black: "bg-black text-white hover:bg-gray-800",
        outline: "bg-transparent border-2 border-[#19355a] text-[#19355a] hover:bg-[#27285d] hover:text-white",
      },
      size: {
        xs: "text-xs px-2 py-1 h-fit",
        sm: "text-sm px-3 py-1.5 h-fit",
        md: "text-base px-4 py-2 h-fit",
        lg: "text-lg px-6 py-3 h-fit",
        xl: "text-xl px-8 py-4 h-fit",
      },
      shape: {
        square: "rounded-none",
        rounded: "rounded-lg",
        pill: "rounded-full",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
      shape: "rounded",
    },
  }
);

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof ButtonVariants> {
  isLoading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

const Button = ({
  size = "lg",
  variant = "primary",
  shape = "rounded",
  fullWidth = false,
  isLoading = false,
  icon,
  children,
  ...rest
}: IButtonProps) => {
  const iconSizeMap = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-7 h-7",
  };

  const iconSize = iconSizeMap[size ?? "lg"];

  return (
    <button
      className={clsx(ButtonVariants({ variant, size, shape, fullWidth }))}
      disabled={isLoading || rest.disabled}
      aria-busy={isLoading}
      aria-disabled={isLoading}
      {...rest}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading && (
          <svg
            className={clsx("animate-spin", iconSize)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.372 0 0 5.372 0 12h4z"
            />
          </svg>
        )}

        {children && <span>{children}</span>}

        {!isLoading && icon && <span className={clsx(iconSize)}>{icon}</span>}
      </div>
    </button>
  );
};

export default memo(Button);
