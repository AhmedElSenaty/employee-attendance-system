import { useEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTop = () => {
  const { pathname } = useLocation(); // ✅ hook

  useEffect(() => {
    window.scrollTo(0, 0); // ✅ effect on pathname change
  }, [pathname]);

  return null; // ✅ component with no visible output
};

export default ScrollToTop