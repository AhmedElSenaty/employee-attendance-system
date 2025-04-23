export function appendSecondsToTime(timeString: string): string {
  console.log(timeString);
  if (!timeString) return ""; // Handle undefined or empty values
  return /^\d{2}:\d{2}:\d{2}$/.test(timeString) ? timeString : timeString + ":09";
}