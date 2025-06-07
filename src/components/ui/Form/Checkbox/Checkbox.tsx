import { forwardRef, InputHTMLAttributes, Ref } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
}

const Checkbox = forwardRef(({ isError = false, ...rest }: IProps, ref: Ref<HTMLInputElement>) => {
  return (
    <div className="flex h-6 shrink-0 items-center">
      <div className="group grid size-4 grid-cols-1">
        <input
          ref={ref}
          type="checkbox"
          className={`col-start-1 row-start-1 appearance-none rounded-sm border 
            bg-white checked:border-[#b38e19] checked:bg-[#b38e19] 
            indeterminate:border-[#b38e19] indeterminate:bg-[#b38e19] 
            focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-[#b38e19] disabled:border-gray-300 
            disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto duration-75 ease-in-out
            ${isError ? "border-red-500 focus-visible:outline-red-500" : "border-gray-300"}`}
          {...rest}
        />
        <svg
          fill="none"
          viewBox="0 0 14 14"
          className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
        >
          <path
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 group-has-checked:opacity-100"
          />
          <path
            d="M3 7H11"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 group-has-indeterminate:opacity-100"
          />
        </svg>
      </div>
    </div>
  );
});

Checkbox.displayName = "checkbox";

export default Checkbox