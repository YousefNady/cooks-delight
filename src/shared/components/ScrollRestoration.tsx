import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Renamed the file and component to ScrollRestoration to avoid naming conflicts with the BackToTopButton component,
// which also uses window.scrollTo(0, 0) but only on click, not on route changes.
// This prevents confusion and potential bugs when adding more scroll-related features.
const ScrollRestoration = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollRestoration;