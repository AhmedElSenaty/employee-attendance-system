import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation(["footer"]); // Initialize the translation hook with the 'footer' namespace

  return (
    <footer className="bg-[#121e3a] text-white py-5">
      <div className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-15">
        {/* Left Section */}
        <div className="text-center lg:text-left mb-4 lg:mb-0">
          <p className="text-sm sm:text-base">
            {t("copyright")}
          </p>
        </div>

        {/* Right Section */}
        <div className="text-center lg:text-right">
          <ul className="flex space-x-4 text-sm sm:text-base">
            <li>
              <a
                href="#"
                className="text-white hover:text-secondary transition duration-300"
              >
                {t("terms")}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-white hover:text-secondary transition duration-300"
              >
                {t("privacy")}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
