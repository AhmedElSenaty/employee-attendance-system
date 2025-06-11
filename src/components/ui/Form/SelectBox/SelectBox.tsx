import {
  useEffect,
  useRef,
  useState,
  ReactElement,
  OptionHTMLAttributes,
  Ref,
  forwardRef,
  isValidElement,
  ChangeEvent,
} from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectBoxProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  isError?: boolean;
  children: React.ReactNode;
}

const SelectBox = forwardRef(
  ({ isError = false, children, ...rest }: SelectBoxProps, ref: Ref<HTMLSelectElement>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const options = Array.isArray(children)
      ? children
          .filter(
            (child): child is ReactElement<OptionHTMLAttributes<HTMLOptionElement>> =>
              isValidElement(child) && child.type === "option"
          )
          .map((child) => ({
            value: child.props.value,
            label: child.props.children as string,
          }))
      : [];

    const [selected, setSelected] = useState(rest.value?.toString() || rest.defaultValue?.toString() || "");

    const filteredOptions = options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (value: string) => {
      setSelected(value);
      setIsOpen(false);
      setSearch("");

      // Simulate event to trigger form libraries like React Hook Form
      const event = {
        target: { name: rest.name, value },
      };
      if (rest.onChange) rest.onChange(event as ChangeEvent<HTMLSelectElement>);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find((o) => o.value === selected)?.label || options[0]?.label || "Select...";

    return (
      <div ref={wrapperRef} className="relative w-full">
        {/* Native select for form compatibility */}
        <select
          ref={ref}
          name={rest.name}
          className="sr-only"
          value={selected}
          onChange={(e) => handleSelect(e.target.value)}
          onBlur={rest.onBlur}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom select UI */}
        <button
          type="button"
          className={`w-full appearance-none rounded-lg bg-white px-3 py-2.5 pr-8 text-left text-base text-[#19355a]
          outline-1 -outline-offset-1 focus:outline-2 focus:-outline-offset-2 sm:text-lg duration-75 ease-in-out
          ${isError ? "outline-red-300 focus:outline-red-600" : "outline-gray-300 focus:outline-[#b38e19]"}`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {selectedLabel}
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-500 sm:size-4" />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 text-lg text-gray-700 border-b border-gray-200 focus:outline-none"
            />

            <ul className="max-h-60 overflow-y-auto py-1">
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-lg text-gray-500">No options found</li>
              ) : (
                filteredOptions.map((opt) => (
                  <li
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`flex items-center justify-between cursor-pointer px-3 py-2 text-lg text-gray-800 hover:bg-gray-100 ${
                      selected === opt.value ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {opt.label}
                    {selected === opt.value && <Check className="h-4 w-4 text-green-500" />}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

SelectBox.displayName = "SelectBox";

export default SelectBox;
