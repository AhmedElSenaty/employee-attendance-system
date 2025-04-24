import { ReactNode } from "react";
import { Copy } from "lucide-react";
import clsx from "clsx";
import { showToast } from "../../../utils";
import { useTranslation } from "react-i18next";
import { Tooltip } from "../Tooltip";

interface IProps {
  label?: string;
  children?: ReactNode;
  className?: string;
}

const TableCell = ({ label, children, className = "", ...rest }: IProps) => {
  const { t } = useTranslation();
  
  // Function to handle copy to clipboard
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Ensure the children is either a non-empty string or number
    const content = children?.toString().trim(); // Convert to string if it's a number

    if (!content) return; // Don't copy if it's empty or invalid

    navigator.clipboard.writeText(content)
      .then(() => {
        showToast("success", t("clipboard.copySuccess"));
      })
      .catch(() => {
        showToast("error", t("clipboard.copyError"));
      });
  };

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
        {(typeof children === "string" || typeof children === "number") && children !== "" && (
          <Tooltip content="Copy">
            <button
              onClick={handleCopy}
              className="w-5 h-5 hidden group-hover:flex items-center justify-center focus:outline-none active:scale-90 cursor-pointer transition-all"
              aria-label="Copy to clipboard"
              aria-describedby="copy-info"
            >
              <Copy className="w-5 h-5 text-gray-500 hover:text-gray-700 focus:text-gray-900 transition-colors" />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default TableCell;
