// utils/timeUtils.ts
// Converts "HH:mm:ss" format to total seconds
export function timeToSeconds(timeString: string) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + Math.floor(seconds);
}

export function formatTime(timeString: string) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

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

export function reverseDate(dateString: string) {
  return dateString.split('-').reverse().join('-');
}

export function countdownFrom(timeString: string, setCountdown: (value: string | null) => void) {
  let seconds = timeToSeconds(timeString);
  let countdownInterval: NodeJS.Timeout | null = null; // Store the interval globally

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
