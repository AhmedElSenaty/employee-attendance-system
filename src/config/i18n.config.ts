import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

const fallbackLng = "ar";
const supportedLngs = "en,ar".split(",") || ["en"];
const loadPath = "/locales/{{lng}}/{{ns}}.json";
const debug = false

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    fallbackLng,
    supportedLngs,
    ns: [
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
    ],
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
      useSuspense: true, // Ensures the Suspense fallback is used
    },
    debug
  });

export default i18n;
