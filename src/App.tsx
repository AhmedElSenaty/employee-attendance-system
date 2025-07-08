import { RouterProvider } from "react-router";
import { Suspense, useEffect, useState } from "react";
import createAppRouter from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrandedLoader } from "./components/ui";
import { useUserStore } from "./store";
import { LOADING_DELAY } from "./constants/";
import { useTranslation } from "react-i18next";

const queryClient = new QueryClient();

function App() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);

  const token = useUserStore((state) => state.token);
  const role = useUserStore((state) => state.role);
  console.log(token);
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, LOADING_DELAY);
  }, []);

  if (loading) {
    return <BrandedLoader text={t("loading")} bgColor={"bg-[#19355a]"} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <BrandedLoader text={t("loading")} bgColor={"bg-[#19355a]"} />
        }
      >
        <RouterProvider router={createAppRouter(!!token, role)} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
