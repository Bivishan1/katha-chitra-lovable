import { Link, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const links = [
  { to: "/work", label: "Work" },
  { to: "/services", label: "Services" },
   { to: "/international_support", label: "Intl. Support" },
     { to: "/rental-equipment", label: "Rentals" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export default function SiteHeader() {
   const [open, setOpen] = useState(false);
   const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const onScroll = () => {
        const currentY = window.scrollY;
      setScrolled(currentY > 10);
      if (open) return;
      
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
        scrollTimer.current = null;
      }
      // Scrolling down and past threshold → hide
      if (currentY > lastScrollY.current && currentY > 80) {
        setHidden(true);
      } else if (currentY < lastScrollY.current) {
        // Scrolling up → show immediately
        setHidden(false);
      }
      lastScrollY.current = currentY;
      // After scroll stops, show header
      scrollTimer.current = setTimeout(() => {
        setHidden(false);
      }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [open]);


  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-10 flex justify-between items-center text-foreground transition-all duration-500 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled
            ? "py-3 md:py-4 bg-background/85 backdrop-blur-xl border-b border-border shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]"
            : "py-4 md:py-6 bg-background/40 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <Link to="/" className="flex items-baseline gap-2 sm:gap-3" onClick={() => setOpen(false)}>
           <span style={{ fontFamily: "var(--font-display)" }} className="text-lg sm:text-xl md:text-2xl font-bold tracking-tighter uppercase text-foreground">
            Katha Chitra Production
          </span>
          <span style={{ fontFamily: "var(--font-nepali)" }} className="hidden sm:inline text-sm text-accent/80">
            कथा चित्र प्रोडक्शन
          </span>
        </Link>
        <div className="hidden md:flex gap-8 lg:gap-10 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/80">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative hover:text-accent transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full ${isActive ? "text-accent" : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col gap-1.5 p-2 -mr-2 md:cursor-default cursor-pointer"
        >
          <span className={`block h-px w-6 bg-current transition-transform ${open ? "translate-y-1.75 rotate-45" : ""}`} />
          <span className={`block h-px w-6 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-6 bg-current transition-transform ${open ? "-translate-y-1.75 -rotate-45" : ""}`} />
        </button>
      </nav>
      {open && (
        <div className="fixed inset-0 z-40 bg-background md:hidden flex flex-col justify-center px-6">
          <ul className="space-y-6">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  onClick={() => setOpen(false)}
                  style={{ fontFamily: "var(--font-display)" }}
                  className={({ isActive }) =>
                    `${isActive ? "text-accent" : "hover:text-accent"} block text-5xl uppercase tracking-tighter`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}