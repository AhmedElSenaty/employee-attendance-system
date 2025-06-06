import { create } from "zustand";
import i18n from "../config/i18n.config";
import Cookies from "universal-cookie";
import { LanguageFlags, LanguageType, TextDirection } from "../types";

// Constants
const cookies = new Cookies(null, { path: "/" });
const FALLBACK_LANGUAGE: LanguageType = "en";
const FALLBACK_FLAG = "/icons/united-states-flag-icon.svg";

// Language flags mapping
const languageFlags: LanguageFlags = {
  en: "/icons/united-states-flag-icon.svg",
  ar: "/icons/egypt-flag-icon.svg",
};

// Get language from cookies (with fallback and type safety)
const getStoredLanguage = (): LanguageType => {
  const lang = cookies.get("language") as LanguageType | undefined;
  return lang && lang in languageFlags ? lang : FALLBACK_LANGUAGE;
};

// Update document attributes and i18n
const applyLanguageSettings = (language: LanguageType): void => {
  const direction: TextDirection = language === "en" ? "ltr" : "rtl";
  document.documentElement.setAttribute("lang", language);
  document.documentElement.setAttribute("dir", direction);
  i18n.changeLanguage(language);
};

// Initialize with stored or default language
const storedLanguage = getStoredLanguage();
applyLanguageSettings(storedLanguage);

// Zustand store type
type LanguageStore = {
  language: LanguageType;
  direction: TextDirection;
  flag: string;
  flags: LanguageFlags;
  setLanguage: (lang: LanguageType) => void;
};

// Zustand language store
export const useLanguageStore = create<LanguageStore>((set) => ({
  language: storedLanguage,
  direction: storedLanguage === "en" ? "ltr" : "rtl",
  flag: languageFlags[storedLanguage] || FALLBACK_FLAG,
  flags: languageFlags,

  setLanguage: (newLanguage) => {
    const direction = newLanguage === "en" ? "ltr" : "rtl";
    const flag = languageFlags[newLanguage] || FALLBACK_FLAG;

    // Persist language in cookies (1 month)
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    cookies.set("language", newLanguage, { path: "/", expires });

    // Apply changes
    applyLanguageSettings(newLanguage);

    // Update store
    set(() => ({
      language: newLanguage,
      direction,
      flag,
    }));
  },
}));
