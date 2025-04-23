interface IProps {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
  direction: "prev" | "next" | "first";
}

const PaginationButton = ({ disabled, onClick, children, direction }: IProps) => {
  return (
    <button
      type="button"
      className={`flex items-center justify-center px-4 h-10 rounded-lg transition-all duration-200
      bg-secondary text-white border border-gray-200 font-medium
      hover:bg-secondary-hover hover:text-white
      disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed cursor-pointer capitalize
      `}
      disabled={disabled}
      onClick={onClick}
      aria-label={
        direction === "prev"
          ? "Previous Page"
          : direction === "next"
          ? "Next Page"
          : "Go to First Page"
      }
    >
      {direction === "prev" && (
        <svg
          className="w-3.5 h-3.5 me-2 rtl:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 14 10"
          fill="none"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 5H1m0 0 4 4M1 5l4-4"
          />
        </svg>
      )}
      
      {direction === "first" && (
        <svg
          className="w-4 h-4 me-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 20V10M12 20V4M5 20V10M3 10L12 4l9 6" />
        </svg>
      )}

      {children}

      {direction === "next" && (
        <svg
          className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 14 10"
          fill="none"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      )}
    </button>
  );
};

export default PaginationButton;
