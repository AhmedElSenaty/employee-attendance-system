/**
 * Formats a number or numeric string according to the specified locale.
 *
 * @param value - The value to format (number or string representing a number).
 * @param locale - The target locale: `"en"` (default) or `"ar"`.
 * @returns Formatted number as a string. If input is not numeric, returns it unchanged.
 *
 * @example
 * formatValue(123456.78, "en"); // "123,456.78"
 * formatValue("123456.78", "ar"); // "١٢٣٬٤٥٦٫٧٨"
 * formatValue("text", "en"); // "text"
 */
export const formatValue = (value: string | number, locale: "en" | "ar" = "en") => {
  if (typeof value === "number") {
    return value == 0 ? "صفر" : new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(value);
  }

  // Check if it's a valid number
  if (isNaN(parseFloat(value))) return value;

  // Convert and format
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(parseFloat(value));
};

/**
 * Truncates a string to a specified length and optionally adds ellipsis.
 *
 * @param text - The input text to truncate.
 * @param maxLength - Maximum number of characters to keep (default is 20).
 * @param withEllipsis - Whether to append "..." at the end (default is true).
 * @returns The truncated string or "N/A" if the input is empty.
 *
 * @example
 * truncateText("This is a long sentence", 10); // "This is a..."
 * truncateText("Short", 10); // "Short"
 */
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

/**
 * Capitalizes the first letter of a string.
 *
 * @param s - The input string.
 * @returns A string with the first character capitalized.
 *
 * @example
 * capitalizeFirstLetter("hello"); // "Hello"
 * capitalizeFirstLetter(""); // ""
 */
export const capitalizeFirstLetter = (s: string) =>{
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
