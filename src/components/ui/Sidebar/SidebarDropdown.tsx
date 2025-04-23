import { ChevronDown } from "lucide-react";
import { useState, ReactNode } from "react";
import { RootState } from "../../../context/store";
import { useSelector } from "react-redux";

interface IProps {
  icon?: ReactNode;
  name: string;
  children?: ReactNode;
  open?: boolean;
}

const SidebarDropdown = ({ icon, name, children, open = false}: IProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const { language } = useSelector((state: RootState) => state.language);
  const isRtl = language == "en" ? false : true;
  return (
    <div>
      {/* Dropdown Toggle Button */}
      <button
        type="button"
        className={`flex items-center gap-1 w-full p-2 text-primary hover:bg-black/5 ${isOpen ? "bg-black/5" : ""} hover:text-primary-hover cursor-pointer rounded-lg transition-all duration-150 ease-in-out group`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon}
        <p className={`text-base flex-1 ${isRtl ? 'me-3 text-right' : 'ms-3 text-left'} whitespace-nowrap font-medium`}>
          {name}
        </p>
        <ChevronDown size={20} className={`transition-transform ${isOpen ? 'duration-200 rotate-180' : ''}`} />
      </button>
      {/* Dropdown Menu */}
      <div
        className={`mt-2 flex flex-col gap-2 ${isRtl ? 'mr-5 pr-2 border-r-2 border-gray-200' : 'ml-5 pl-2 border-l-2 border-gray-200'}`}
      >
        {isOpen && children}
      </div>
    </div>
  );
};

export default SidebarDropdown;
