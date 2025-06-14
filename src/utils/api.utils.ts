import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import { showToast } from "./toast.utils";

/**
 * Handles API error responses by extracting localized messages
 * and displaying them using the `showToast` utility.
 *
 * @param error - Axios error object with a generic error response shape.
 * @param locale - Current locale (`"en"` or `"ar"`) used to determine which message to show.
 *
 * @example
 * try {
 *   await axios.get("/api/user");
 * } catch (err) {
 *   handleApiError(err as AxiosError<IErrorResponse>, "ar");
 * }
 */
export const handleApiError = (error: AxiosError<IErrorResponse>, locale: "en" | "ar") => {
  // Handle multiple validation errors if present
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    error.response.data.errors.forEach((err) => {
      const [enMessage, arMessage] = err.split(" | ");
      showToast("error",locale === "ar" ? arMessage || enMessage : enMessage || arMessage );
    });
  } else {
    // Fallback to a single message if 'errors' array is not present
    const [enMessage, arMessage] = (error.response?.data?.message ?? "").split(" | ");
    showToast("error", locale === "ar" ? arMessage || enMessage : enMessage || arMessage );
  }
};

/**
 * Returns a localized version of a pipe-separated message string.
 *
 * @param msg - The message string in the format "English message | Arabic message".
 * @param lang - Language code: `"en"` or `"ar"`.
 * @returns Localized message string based on the given language, with fallback to the other language if missing.
 *
 * @example
 * const message = getTranslatedMessage("Hello | مرحبًا", "ar"); // returns "مرحبًا"
 */
export const getTranslatedMessage = (msg: string, lang: string) => {
  const [en, ar] = msg.split(" | ");
  return lang === "ar" ? ar || en : en || ar;
};
