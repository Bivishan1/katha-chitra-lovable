import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // scroll to top when url changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
