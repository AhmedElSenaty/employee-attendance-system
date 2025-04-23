import { Link } from "react-router";
import { logoutUser } from "../../context/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import { Ban } from "lucide-react";
import { RootState } from "../../context/store";
import { formatValue } from "../../utils";

const NotFoundPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((state: RootState) => state.language);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        {/* Animated 404 */}
        <h1 
          className="text-9xl font-extrabold text-red-700"
        >
          {formatValue(404, language)}
          <div className="inline-flex rounded-full bg-red-100 p-4">
            <div className="rounded-full stroke-red-600 bg-red-200 p-4">
              <Ban className="w-12 h-12 sm:w-16 sm:h-16 text-red-600" />
            </div>
          </div>
        </h1>

        {/* Oops! Page not found */}
        <p 
          className="mt-4 text-2xl font-semibold text-primary md:text-3xl"
        >
          <span className="text-red-500">{t("oops")}</span> {t("notFoundPage.title")}
        </p>

        {/* Subtitle */}
        <p 
          className="mt-2 text-lg text-gray-600"
        >
          {t("notFoundPage.message")}
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

export default NotFoundPage;
