/**
 * Appends seconds (`:09`) to a time string if it's in `HH:MM` format.
 *
 * - If the time string is already in `HH:MM:SS` format, it returns it unchanged.
 * - If the input is empty or undefined, it returns an empty string.
 * - Otherwise, it appends `:09` to represent seconds.
 *
 * @param {string} timeString - A string representing a time in `HH:MM` or `HH:MM:SS` format.
 * @returns {string} - A valid time string in `HH:MM:SS` format.
 *
 * @example
 * appendSecondsToTime("14:30");     // "14:30:09"
 * appendSecondsToTime("14:30:45");  // "14:30:45"
 * appendSecondsToTime("");          // ""
 */
export function appendSecondsToTime(timeString: string): string {
  console.log(timeString);
  if (!timeString) return ""; // Handle undefined or empty values
  return /^\d{2}:\d{2}:\d{2}$/.test(timeString) ? timeString : timeString + ":09";
}

/**
 * Returns the current date in ISO format (`YYYY-MM-DD`).
 *
 * Uses the browser's local date and converts it to ISO string,
 * then extracts only the date part (before the "T").
 *
 * @returns {string} - The current date in `YYYY-MM-DD` format.
 *
 * @example
 * getTodayDateISO(); // "2025-06-11"
 */
export function getTodayDateISO(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

/**
 * Formats a time string to HH:MM format by ensuring that both hours and minutes
 * are two-digit numbers (e.g., "9:5" becomes "09:05").
 *
 * @param value - A time string in the format "H:M", "HH:M", "H:MM", or "HH:MM".
 * @returns A formatted time string in "HH:MM" format.
 */
export const formatTimeHHMM = (value: string) => {
  const [hours, minutes] = value.split(":");
  // Ensure both hours and minutes are two digits
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};