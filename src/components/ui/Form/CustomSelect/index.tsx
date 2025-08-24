import React from "react";
import Select, { ControlProps, StylesConfig, components } from "react-select";

interface Option {
  value: number | string;
  label: string;
  subLabel?: string; // For employee ID or additional info
}

interface CustomSelectProps {
  options: Option[];
  value?: Option | null;
  onChange: (selected: Option | null) => void;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  error?: boolean;
}

interface CustomMultiSelectProps {
  options: Option[];
  value?: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  error?: boolean;
  showSelectAll?: boolean;
}

const customStyles: StylesConfig<Option, false> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "white",
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "#b38e19" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px #b38e19" : "none",
    padding: "2.5px 0 2.5px 12px",
    minHeight: "40px",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    outlineOffset: "-2px",
    outlineWidth: "2px",
    outlineStyle: state.isFocused ? "solid" : "none",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#19355a",
    fontSize: "1.125rem",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#19355a",
    fontSize: "1.125rem",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#6b7280",
    paddingRight: "12px",
    cursor: "pointer",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgb(0 0 0 / 0.1)",
  }),
  option: (provided, state) => ({
    ...provided,
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "#f3f4f6"
      : state.isFocused
      ? "#f9fafb"
      : "white",
    color: "#1e293b",
    fontWeight: state.isSelected ? "600" : "400",
    padding: "8px 12px",
    fontSize: "1.125rem",
  }),
};

const multiSelectStyles: StylesConfig<Option, true> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "white",
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "#b38e19" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px #b38e19" : "none",
    padding: "2.5px 0 2.5px 12px",
    minHeight: "40px",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    outlineOffset: "-2px",
    outlineWidth: "2px",
    outlineStyle: state.isFocused ? "solid" : "none",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#19355a",
    fontSize: "1.125rem",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#e5e7eb",
    borderRadius: "0.375rem",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#374151",
    fontSize: "0.875rem",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#6b7280",
    ":hover": {
      backgroundColor: "#d1d5db",
      color: "#374151",
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#6b7280",
    paddingRight: "12px",
    cursor: "pointer",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgb(0 0 0 / 0.1)",
  }),
  option: (provided, state) => ({
    ...provided,
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "#f3f4f6"
      : state.isFocused
      ? "#f9fafb"
      : "white",
    color: "#1e293b",
    fontWeight: state.isSelected ? "600" : "400",
    padding: "8px 12px",
    fontSize: "1.125rem",
  }),
};

// Custom Option component to show employee ID under name
const CustomOption = ({ children, ...props }: any) => {
  const { data } = props;

  // Special styling for select all option
  if (data.value === "select-all") {
    return (
      <components.Option {...props}>
        <div className="px-3 py-2 bg-blue-50 border-b border-blue-200">
          <div className="text-sm font-semibold text-blue-700">
            {data.label}
          </div>
          {data.subLabel && (
            <div className="text-xs text-blue-600">{data.subLabel}</div>
          )}
        </div>
      </components.Option>
    );
  }

  return (
    <components.Option {...props}>
      <div>
        <div className="text-sm font-medium text-gray-900">{data.label}</div>
        {data.subLabel && (
          <div className="text-xs text-gray-500">ID: {data.subLabel}</div>
        )}
      </div>
    </components.Option>
  );
};

// Custom Menu component to add select all/deselect all
const CustomMenu = ({ children, ...props }: any) => {
  const { selectProps } = props;
  const { options, value = [], onChange, showSelectAll } = selectProps;

  if (!showSelectAll) {
    return <components.Menu {...props}>{children}</components.Menu>;
  }

  const allSelected = value.length === options.length && options.length > 0;

  const handleSelectAll = () => {
    if (allSelected) {
      onChange([]); // Deselect all
    } else {
      onChange(options); // Select all
    }
  };

  return (
    <div>
      <div className="px-3 py-2 border-b border-gray-200 bg-blue-50">
        <button
          type="button"
          onClick={handleSelectAll}
          className="w-full text-left px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 rounded transition-colors border border-blue-200"
        >
          {allSelected ? "Deselect All" : "Select All"}
        </button>
      </div>
      <components.Menu {...props}>{children}</components.Menu>
    </div>
  );
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  isSearchable = false,
  className = "w-40",
  isDisabled = false,
  isClearable = false,
  error = false,
}) => {
  // Override border color if error is true
  const mergedStyles: StylesConfig<Option, false> = {
    ...customStyles,
    control: (provided, state: ControlProps<Option, false>) => {
      const baseStyles = customStyles.control
        ? customStyles.control(provided, state)
        : provided;
      return {
        ...baseStyles,
        borderColor: error ? "#f87171" /* red-400 */ : baseStyles.borderColor,
        boxShadow: error
          ? "0 0 0 2px #ef4444" /* red-500 */
          : baseStyles.boxShadow,
      };
    },
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgb(0 0 0 / 0.1)",
      zIndex: 9999, // <-- Add this line for z-index
    }),
  };

  return (
    <Select
      className={className}
      classNamePrefix="custom-select"
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isSearchable={isSearchable}
      isClearable={isClearable}
      styles={mergedStyles}
      isDisabled={isDisabled}
    />
  );
};

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  isSearchable = false,
  className = "w-40",
  isDisabled = false,
  isClearable = false,
  error = false,
  showSelectAll = false,
}) => {
  // Override border color if error is true
  const mergedStyles: StylesConfig<Option, true> = {
    ...multiSelectStyles,
    control: (provided, state: ControlProps<Option, true>) => {
      const baseStyles = multiSelectStyles.control
        ? multiSelectStyles.control(provided, state)
        : provided;
      return {
        ...baseStyles,
        borderColor: error ? "#f87171" /* red-400 */ : baseStyles.borderColor,
        boxShadow: error
          ? "0 0 0 2px #ef4444" /* red-500 */
          : baseStyles.boxShadow,
      };
    },
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgb(0 0 0 / 0.1)",
      zIndex: 9999, // <-- Add this line for z-index
    }),
  };

  // Add select all option if enabled
  const allOptions = React.useMemo(() => {
    if (!showSelectAll || options.length === 0) {
      return options;
    }

    const allSelected = value.length === options.length;
    const selectAllOption: Option = {
      value: "select-all",
      label: allSelected ? "Deselect All" : "Select All",
      subLabel: "Click to select/deselect all",
    };

    return [selectAllOption, ...options];
  }, [options, value.length, showSelectAll]);

  // Handle option selection including select all
  const handleChange = React.useCallback(
    (selected: Option[]) => {
      if (!selected || selected.length === 0) {
        onChange([]);
        return;
      }

      // Check if select all option is selected
      const hasSelectAll = selected.some(
        (option) => option.value === "select-all"
      );

      if (hasSelectAll) {
        // If select all is selected, select all regular options
        const allSelected = value.length === options.length;
        if (allSelected) {
          // If all were selected, deselect all
          onChange([]);
        } else {
          // If not all were selected, select all
          onChange(options);
        }
      } else {
        // Filter out the select all option and pass regular selections
        const regularSelections = selected.filter(
          (option) => option.value !== "select-all"
        );
        onChange(regularSelections);
      }
    },
    [onChange, value.length, options]
  );

  // Create custom components
  const customComponents = React.useMemo(
    () => ({
      Option: CustomOption,
    }),
    []
  );

  return (
    <Select
      className={className}
      classNamePrefix="custom-multi-select"
      options={allOptions}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      isSearchable={isSearchable}
      isClearable={isClearable}
      isMulti
      styles={mergedStyles}
      isDisabled={isDisabled}
      components={customComponents}
    />
  );
};

export default CustomSelect;
export { CustomMultiSelect };
