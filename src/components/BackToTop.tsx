import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
     let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const next = window.scrollY > 320;
        setVisible((v) => (v === next ? v : next));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
       window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Go to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
       className={`fixed bottom-24 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-accent/40 bg-background/80 text-accent shadow-elevated backdrop-blur-md transition-all duration-300 hover:bg-accent hover:text-accent-foreground sm:h-12 sm:w-12 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-auto"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
