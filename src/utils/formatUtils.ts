// utils/formatUtils.ts
export const formatValue = (value: string | number, locale: "en" | "ar" = "en") => {
  if (typeof value === "number") {
    return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(value);
  }

  // Check if it's a valid number
  if (isNaN(parseFloat(value))) return value;

  // Convert and format
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(parseFloat(value));
};

export const truncateText = (
  text: string,
  maxLength: number = 20,
  withEllipsis: boolean = true
): string => {
  if (!text) return "N/A";
  return text.length > maxLength
    ? text.slice(0, maxLength) + (withEllipsis ? "..." : "")
    : text;
};


export const capitalizeFirstLetter = (s: string) =>{
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
