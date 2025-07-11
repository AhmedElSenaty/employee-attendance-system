import React, { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { useSidebarStore } from "../../../store/sidebar.store";
import { useUserStore } from "../../../store";

interface SidebarProps {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}

const Sidebar = ({ title, subtitle, children }: SidebarProps) => {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const setSidebar = useSidebarStore((state) => state.setSidebar);
  const name = useUserStore((state) => state.name);

  subtitle = name;

  // Close sidebar when clicking outside or pressing the escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebar(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setSidebar]);

  return (
    <>
      {/* Sidebar Toggle Button */}
      <aside className="max-lg:hidden flex flex-col items-center sm:gap-5 py-8 w-11 sm:w-18 h-screen shadow-lg shadow-primary sticky bg-gray-100 left-0 top-0">
        {children && (
          <div className="h-full flex flex-col sm:gap-5 gap-4">
            {(Array.isArray(children) ? children : [children]).map(
              (child, index) =>
                child.props?.icon ? (
                  <button
                    key={index}
                    className="sm:w-12 sm:h-12 w-8 h-8 inline-flex items-center justify-center 
                  relative cursor-pointer font-semibold rounded-lg 
                  transition-colors duration-200 ease-in-out 
                  bg-transparent text-[#19355a] hover:bg-[#27285d] hover:text-[#ffffff]"
                    onClick={() => setSidebar(true)}
                    aria-expanded={isOpen}
                    aria-label="Toggle Sidebar"
                  >
                    <div className="sm:w-7 sm:h-7 w-4 h-4">
                      {React.cloneElement(child.props.icon, {
                        className: "w-full h-full",
                      })}
                    </div>
                  </button>
                ) : null // Return null if icon is undefined
            )}
          </div>
        )}
      </aside>

      {/* Sidebar Container */}
      <div
        className={`z-50 fixed top-0 ltr:left-0 rtl:right-0 h-full w-80 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "ltr:-translate-x-full rtl:translate-x-full opacity-0"
        }`}
        role="dialog"
        aria-hidden={!isOpen}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-primary">{title}</h2>
            <h3 className="text-lg font-medium text-secondary mt-1">
              {subtitle}
            </h3>
          </div>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
            onClick={() => setSidebar(false)}
            aria-label="Close Sidebar"
          >
            <X />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 px-5 pb-10 pt-5 overflow-y-auto h-[calc(100vh-100px)]">
          <div className="space-y-3">{children}</div>
        </div>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setSidebar(false)}
          role="button"
          aria-label="Close Sidebar"
          tabIndex={0}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
