/**
 * Converts a time string in "HH:mm:ss" format to total seconds.
 *
 * @param timeString - Time string in "HH:mm:ss" format.
 * @returns Total number of seconds.
 *
 * @example
 * timeToSeconds("01:30:00"); // returns 5400
 */
export function timeToSeconds(timeString: string) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + Math.floor(seconds);
}

/**
 * Formats a time string in "HH:mm:ss" format to a readable format like "1h 30m 0s".
 *
 * @param timeString - Time string in "HH:mm:ss" format.
 * @returns A human-readable formatted string.
 *
 * @example
 * formatTime("01:30:00"); // returns "1h 30m 0s"
 * formatTime("00:45:10"); // returns "45m 10s"
 */
export function formatTime(timeString: string) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}


/**
 * Formats an ISO date string to `dd/mm/yyyy` format (UK locale).
 *
 * @param dateString - A valid ISO date string.
 * @returns A formatted date string or "Invalid Date" if the input is invalid.
 *
 * @example
 * formatDate("2025-06-14"); // returns "14/06/2025"
 */
export const formatDate = (dateString: string) => {
  if (!dateString) return "Invalid Date"; // Handle empty or undefined values

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid date formats

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};


/**
 * Reverses a date string from "yyyy-mm-dd" to "dd-mm-yyyy".
 *
 * @param dateString - Date string in "yyyy-mm-dd" format.
 * @returns Reversed date string in "dd-mm-yyyy" format.
 *
 * @example
 * reverseDate("2025-06-14"); // returns "14-06-2025"
 */
export function reverseDate(dateString: string) {
  return dateString.split('-').reverse().join('-');
}

/**
 * Starts a countdown timer from the given time string and updates the UI via a setter.
 *
 * @param timeString - Time string in "HH:mm:ss" format to count down from.
 * @param setCountdown - A state setter function to update the countdown display.
 *
 * @example
 * countdownFrom("00:05:00", setCountdown); // updates countdown every second
 */

export function countdownFrom(timeString: string, setCountdown: (value: string | null) => void) {
  let seconds = timeToSeconds(timeString);
  let countdownInterval: Timeout | null = null; // Store the interval globally

  if (seconds <= 0) {
    setCountdown(null);
    return;
  }

  if (countdownInterval) {
    clearInterval(countdownInterval); // Clear any existing countdown
  }

  countdownInterval = setInterval(() => {
    if (seconds <= 0) {
      clearInterval(countdownInterval!);
      countdownInterval = null;
      setCountdown(null);
      return;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    setCountdown(`${minutes}m ${remainingSeconds}s`);

    seconds--;
  }, 1000);
}
