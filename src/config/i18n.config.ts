import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

const fallbackLng = import.meta.env.VITE_FALLBACK_LANGUAGE || "en";
const supportedLngs = import.meta.env.VITE_SUPPORTED_LANGUAGES?.split(",") || ["en"];
const loadPath = import.meta.env.VITE_I18N_LOAD_PATH || "/locales/{{lng}}/{{ns}}.json";
const debug = import.meta.env.VITE_I18N_DEBUG === "true";

const namespaces = [
  "dashboard",
  "adminPages",
  "attendancePages",
  "calenderPage",
  "common",
  "departmentPages",
  "devicePages",
  "employeePages",
  "entityPages",
  "footer",
  "home",
  "login",
  "managerPages",
  "navbar",
  "officialVacationPages",
  "permissionPages",
  "profilePages",
  "resetAccount",
  "sidebarItems",
  "subDepartmentPages",
  "adminAccount",
  "managerAccount",
  "empolyeeAccount",
];

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    fallbackLng,
    supportedLngs,
    ns: namespaces,
    defaultNS: "common",
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
