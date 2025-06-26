import { ReactNode } from "react";
import clsx from "clsx";

interface IProps {
  label?: string;
  children?: ReactNode;
  className?: string;
}

const TableCell = ({ label, children, className = "", ...rest }: IProps) => {


  return (
    <div
      role="cell"
      className={clsx(
        "flex-1 relative py-4 px-5 border-b border-gray-200 text-gray-700 block lg:table-cell",
        "lg:border-0 select-none max-lg:hover:bg-gray-200 group transition-all",
        className
      )}
      {...rest}
    >
      {/* Show label only in mobile view */}
      {label && <span className="lg:hidden font-semibold block text-gray-900">{label}:</span>}
      
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
};

export default TableCell;
