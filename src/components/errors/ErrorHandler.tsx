import { Link } from "react-router";
import { logoutUser } from "../../context/slices/userSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import { ReactNode } from "react";
import { formatValue } from "../../utils";
import { ServerCrash } from "lucide-react";
import { useLanguageStore } from "../../store/language.store";

interface IProps {
  statusCode?: number;
  title?: string;
  message?: string,
  icon?: ReactNode
}

const ErrorHandler = ({ statusCode = 500, title, message, icon}: IProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common"]);
  const { language } = useLanguageStore();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        {/* Animated 404 */}
        <h1 
          className="text-9xl font-extrabold text-red-700"
        >
          {formatValue(statusCode, language)}
          <div className="inline-flex rounded-full bg-red-100 p-4">
            <div className="rounded-full stroke-red-600 bg-red-200 p-4">
              {icon ?? <ServerCrash className="w-12 h-12 sm:w-16 sm:h-16 text-red-600" />}
            </div>
          </div>
        </h1>

        {/* Oops! Page not found */}
        <p 
          className="mt-4 text-2xl font-semibold text-primary md:text-3xl"
        >
          <span className="text-red-500">{t("oops")}</span> {title ?? t("serverErrorPage.title")}
        </p>

        {/* Subtitle */}
        <p 
          className="mt-2 text-lg text-gray-600"
        >
          {message ?? t("serverErrorPage.message")}
        </p>

        {/* Go Home Button */}
        <div 
          className="mt-6 flex justify-center gap-5 flex-wrap"
        >
          <Link to={"/"} reloadDocument>
            <Button variant="primary">
              {t("buttons.goHome")}
            </Button>
          </Link>
          <Link to={"/"} reloadDocument>
          <Button
            variant="danger"
          
            onClick={() => dispatch(logoutUser())}
          >
            {t("buttons.logout")}
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandler;
