import { Menu } from "lucide-react";
import clsx from "clsx";

const SidebarToggleButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl",
        "bg-primary text-white shadow-lg transition-all duration-300",
        "hover:bg-primary/90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50"
      )}
      aria-label="Open Sidebar"
    >
      <Menu className="w-6 h-6 sm:w-8 sm:h-8" />
    </button>
  );
};

export default SidebarToggleButton;
