import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import defaultLogo from "../assets/logo.png";
import { useSiteSettings } from "@/lib/cms";

const links = [
  { to: "/work", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/international_support", label: "Intl. Support" },
  { to: "/rental-equipment", label: "Rentals" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export default function SiteHeader() {
  const { data: settings } = useSiteSettings();
  const logo = settings?.logo_url ?? defaultLogo;
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

  const getLinkClassName = (isActive: boolean) => `
  relative hover:text-accent transition-colors duration-300 after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full ${isActive ? "text-accent" : ""}
`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-10 h-16 md:h-20 flex items-center justify-between text-foreground transition-all duration-500 overflow-visible ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled
            ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]"
            : "bg-background/40 backdrop-blur-md border-b border-transparent"
        }`}
      >
        {/* Free-size logo */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          aria-label="Katha Chitra Home"
          className="absolute left-4 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 z-10"
        >
          <img
            src={logo}
            alt="Katha Chitra Logo"
            className="block w-24 sm:w-28 md:w-36 lg:w-40 h-15 object-contain"
          />
        </Link>
        {/* Empty spacer so nav stays aligned */}
        <div className="w-24 sm:w-28 md:w-36 lg:w-40" />

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex gap-8 lg:gap-10 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/80"
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={getLinkClassName(false)}
              activeProps={{ className: getLinkClassName(true) }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="md:hidden flex flex-col gap-1.5 p-2 -mr-2 cursor-pointer"
        >
          <span
            className={`block h-px w-6 bg-current transition-transform ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-current transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-current transition-transform ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 bg-background md:hidden flex flex-col justify-center px-6">
          <ul className="space-y-6">
           {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={getLinkClassName(false)}
              activeProps={{ className: getLinkClassName(true) }}
            >
              {link.label}
            </Link>
          ))}
          </ul>
        </div>
      )}
    </>
  );
}
