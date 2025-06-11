import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import { showToast } from "./toast.utils";

export const handleApiError = (error: AxiosError<IErrorResponse>, locale: "en" | "ar") => {
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    console.log(error.response.data);
    
    error.response.data.errors.forEach((err) => {
      const [enMessage, arMessage] = err.split(" | ");
      showToast("error",locale === "ar" ? arMessage || enMessage : enMessage || arMessage );
    });
  } else {
    const [enMessage, arMessage] = (error.response?.data?.message ?? "").split(" | ");
    showToast("error", locale === "ar" ? arMessage || enMessage : enMessage || arMessage );
  }
};

export const getTranslatedMessage = (msg: string, lang: string) => {
  const [en, ar] = msg.split(" | ");
  return lang === "ar" ? ar || en : en || ar;
};
