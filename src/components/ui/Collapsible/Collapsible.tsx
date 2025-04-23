import { memo, ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";

interface IProp {
  title: string;
  children?: ReactNode;
  open?: boolean
}

const Collapsible = ({ title, children, open }: IProp) => {
  const [isOpen, setIsOpen] = useState(open);

  const toggleContent = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md hover:shadow-xl">
      {/* Header */}
      <button
        type="button"
        onClick={toggleContent}
        className={`w-full flex items-center justify-between p-4 font-semibold text-gray-800 ${isOpen ? "bg-gray-100 rounded-t-2xl" : "bg-white rounded-2xl"} hover:bg-gray-100  transition-colors duration-300 cursor-pointer`}
        aria-expanded={isOpen}
        aria-controls={`collapsible-content-${title.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <span className="text-lg">{title}</span>
        <ChevronDown
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          size={24}
        />
      </button>

      {/* Content */}
      <div
        id={`collapsible-content-${title.replace(/\s+/g, "-").toLowerCase()}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 text-gray-700">{children}</div>
      </div>
    </div>
  );
};

export default memo(Collapsible);
