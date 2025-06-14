import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { FALLBACK_LANGUAGE, i18n_DEBUG, i18n_DEFAULT_NAMESPACE, i18n_LOAD_PATH, i18n_NAMESPACES, SUPPORTED_LANGUAGES } from "../constants/";

const loadPath = i18n_LOAD_PATH || "/locales/{{lng}}/{{ns}}.json";
const fallbackLng = FALLBACK_LANGUAGE || "en";
const supportedLngs = SUPPORTED_LANGUAGES || ["en"];
const debug = i18n_DEBUG || false;

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    fallbackLng,
    supportedLngs,
    ns: i18n_NAMESPACES,
    defaultNS: i18n_DEFAULT_NAMESPACE,
    detection: {
      order: ["cookie", "localStorage", "sessionStorage", "navigator", "htmlTag", "path", "subdomain"],
      caches: ["cookie"],
    },
    backend: {
      loadPath,
    },
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
    react: {
      useSuspense: true,
    },
    debug,
  });

export default i18n;
