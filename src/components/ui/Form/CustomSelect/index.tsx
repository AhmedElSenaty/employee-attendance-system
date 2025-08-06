import React from "react";
import Select, { ControlProps, StylesConfig } from "react-select";

interface Option {
  value: number | string;
  label: string;
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

export default CustomSelect;
