import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // युआरएल (path) परिवर्तन हुने बित्तिकै स्क्रोललाई टपमा लैजाने
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
