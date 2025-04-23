import { RouterProvider } from "react-router";
import { Suspense, useEffect, useState } from "react";
import { LogoSpinner } from "./components/ui/LogoSpinner";
import useI18nInitialization from "./hooks/useI18nInitializationHook";
import { useSelector } from "react-redux";
import { selectIsLoggedIn, selectRole } from "./context/slices/userSlice";
import createAppRouter from "./router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const SPINNER_BG = "bg-[#19355a]";
const LOADING_DELAY = 1500;

const queryClient = new QueryClient()

function App() {
  const { isReady, t } = useI18nInitialization();
  
  const [loading, setLoading] = useState(true)

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userRole = useSelector(selectRole());

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, LOADING_DELAY);
  }, [])

  if (!isReady || loading) {
    return <LogoSpinner text={t("loading")} bgColor={SPINNER_BG} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LogoSpinner text={t("loading")} bgColor={SPINNER_BG} />}>
        <RouterProvider router={createAppRouter(isLoggedIn, userRole)} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
