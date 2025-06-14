import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { FALLBACK_LANGUAGE, i18n_DEBUG, i18n_LOAD_PATH, SUPPORTED_LANGUAGES } from "../constants/settings.constants";

const loadPath = i18n_LOAD_PATH || "/locales/{{lng}}/{{ns}}.json";
const fallbackLng = FALLBACK_LANGUAGE || "en";
const supportedLngs = SUPPORTED_LANGUAGES || ["en"];
const debug = i18n_DEBUG || false;


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
  "LeaveRequests",
  "missionRequests",
  "ordinaryRequests",
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
