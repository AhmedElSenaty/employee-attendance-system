import { createSlice } from "@reduxjs/toolkit";
import i18n from "../../config/i18n.config";
import { egyptFlag, unitedStatesFlag } from "../../assets/icons";
import Cookies from "universal-cookie";

export type LanguageType = "en" | "ar";

const cookies = new Cookies(null, { path: "/" });

const languageFlags: Record<LanguageType, string> = {
  en: unitedStatesFlag,
  ar: egyptFlag,
};

/**
 * Get the stored language from cookies with validation.
*/
const getStoredLanguage = (): LanguageType => {
  const lang = cookies.get("language") as LanguageType | undefined;
  return lang && Object.keys(languageFlags).includes(lang) ? lang : "en";
};

/**
 * Set document attributes for language and direction.
*/
const setDocumentLanguage = (language: LanguageType) => {
  const direction = language === "en" ? "ltr" : "rtl";
  document.documentElement.setAttribute("dir", direction);
  document.documentElement.setAttribute("lang", language);
  i18n.changeLanguage(language);
};

// Initialize state using stored language
const storedLanguage = getStoredLanguage();

const initialState = {
  language: storedLanguage,
  direction: storedLanguage === "en" ? "ltr" : "rtl",
  flag: languageFlags[storedLanguage],
  flags: languageFlags,
};

// Set document language on load
setDocumentLanguage(storedLanguage);

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: { payload: LanguageType }) => {
      const newLanguage = action.payload;
      state.language = newLanguage;
      state.direction = newLanguage === "en" ? "ltr" : "rtl";
      state.flag = languageFlags[newLanguage] || unitedStatesFlag;

      // Store language in cookies for 1 month
      const expires = new Date();
      expires.setMonth(expires.getMonth() + 1);
      cookies.set("language", newLanguage, { path: "/", expires });

      // Apply changes to document
      setDocumentLanguage(newLanguage);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
