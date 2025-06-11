import { Bounce, toast } from "react-toastify";

/**
 * Displays a toast notification using `react-toastify`.
 *
 * @param {"success" | "error" | "warn"} type - The type of toast notification.
 *    - `"success"`: For successful operations.
 *    - `"error"`: For error messages.
 *    - `"warn"`: For warnings or alerts.
 * 
 * @param {string} message - The message to display in the toast.
 * 
 * @param {number} [time=5000] - Duration in milliseconds before the toast automatically closes.
 *    Defaults to 5000ms (5 seconds).
 * 
 * @example
 * showToast("success", "Data saved successfully!");
 * showToast("error", "Something went wrong.", 3000);
 * showToast("warn", "Please double-check your input.");
 */
export const showToast = (type: "success" | "error" | "warn", message: string, time = 5000) => {
  toast[type](message, {
    position: "top-center",
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });
};
