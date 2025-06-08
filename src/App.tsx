import { RouterProvider } from "react-router";
import { Suspense, useEffect, useState } from "react";
import useI18nInitialization from "./hooks/useI18nInitializationHook";
import createAppRouter from "./router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrandedLoader } from "./components/ui";
import { useUserStore } from "./store/user.store";

const SPINNER_BG = "bg-[#19355a]";
const LOADING_DELAY = 1500;

const queryClient = new QueryClient()

function App() {
  
  const { isReady, t } = useI18nInitialization();
  
  const [loading, setLoading] = useState(true)

  const token = useUserStore((state) => state.token);
  const role = useUserStore((state) => state.role);
  const id = useUserStore((state) => state.id);
  console.log(id);
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, LOADING_DELAY);
  }, [])

  if (!isReady || loading) {
    return <BrandedLoader text={t("loading")} bgColor={SPINNER_BG} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<BrandedLoader text={t("loading")} bgColor={SPINNER_BG} />}>
        <RouterProvider router={createAppRouter(!!token, role)} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
