import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useI18nInitialization = () => {
  const { i18n, t } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkI18nInitialized = async () => {
      if (i18n.isInitialized) {
        setIsReady(true);
      } else {
        await i18n.loadResources();
        setIsReady(true);
      }
    };

    checkI18nInitialized();
  }, [i18n]);

  return { isReady, t };
};

export default useI18nInitialization;
