import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Clapperboard, Menu, Phone, X } from "lucide-react";
import defaultLogo from "../assets/logo.png";
import { Button } from "@/components/ui/button";
import { useContactDetails, useSiteSettings } from "@/lib/cms";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
  // { to: "/services", label: "Services" },
  // { to: "/international_support", label: "Intl. Support" },
  // { to: "/rental-equipment", label: "Rentals" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const serviceLinks = [
  {
    to: "/international_support",
    eyebrow: "Global productions",
    title: "International Production Support",
    description:
      "Permits, crews, logistics, locations and complete production support across Nepal.",
    icon: Clapperboard,
  },
  {
    to: "/rental-equipment",
    eyebrow: "Professional equipment",
    title: "Camera & Equipment Rentals",
    description:
      "Production-ready cameras, lenses, lighting, sound and grip packages.",
    icon: Clapperboard,
  },
] as const;

export default function SiteHeader() {
  const { data: settings } = useSiteSettings();
  const { data: contact } = useContactDetails();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const logo = settings?.logo_url ?? defaultLogo;
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);

  const serviceSectionActive =
    pathname === "/services" ||
    serviceLinks.some((item) => item.to === pathname);
  const phone = contact?.phone || "+977 9801040899";

  const openServices = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setServicesOpen(true);
  };

  const closeServicesSoon = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    dropdownTimer.current = setTimeout(() => setServicesOpen(false), 140);
  };

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

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!servicesRef.current?.contains(event.target as Node))
        setServicesOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    };
  }, []);

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className={`fixed left-0 right-0 top-0 z-50 px-3 sm:px-5 lg:px-8 text-foreground transition-all duration-500  ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${scrolled ? "py-2" : "py-3 sm:py-2"}`}
      >
        {/* Free-size logo */}
        <div className="relative mx-auto flex h-17 max-w-360 items-center gap-3 rounded-2xl border border-border bg-background/95 px-3 shadow-2xl backdrop-blur-xl sm:h-18.5 sm:px-5 lg:gap-6">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            aria-label="Story Painters Home"
            className="absolute left-4 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 z-10"
          >
            <img
              src={logo}
              alt="Story Painters Logo"
              className="block w-24 sm:w-28 md:w-36 lg:w-40 h-15 object-contain"
            />
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
            <div className="flex items-center rounded-full border border-border bg-secondary/55 p-1 text-xs font-semibold text-muted-foreground">
              <Link
                to="/"
                activeOptions={{ exact: true }}
                className="rounded-full px-4 py-3 transition-colors hover:text-foreground"
                activeProps={{ className: "bg-card text-foreground shadow-sm" }}
              >
                Home
              </Link>

              <div
                ref={servicesRef}
                className="relative flex items-center"
                onMouseEnter={openServices}
                onMouseLeave={closeServicesSoon}
                onFocus={openServices}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget))
                    closeServicesSoon();
                }}
              >
                <div
                  className={cn(
                    "flex items-center rounded-full transition-colors",
                    serviceSectionActive && "bg-card text-foreground shadow-sm",
                  )}
                >
                  <Link
                    to="/services"
                    className="py-3 pl-4 pr-1 hover:text-foreground"
                  >
                    Services
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Toggle services menu"
                    aria-haspopup="menu"
                    aria-expanded={servicesOpen}
                    onClick={() => setServicesOpen((value) => !value)}
                    className="mr-1 h-8 w-8 rounded-full text-current hover:bg-primary/10 hover:text-foreground"
                  >
                    <ChevronDown
                      className={cn(
                        "transition-transform duration-300",
                        servicesOpen && "rotate-180",
                      )}
                    />
                  </Button>
                </div>

                <div
                  role="menu"
                  aria-label="Services"
                  className={cn(
                    "absolute left-1/2 top-[calc(100%+18px)] w-[min(720px,calc(100vw-48px))] -translate-x-1/2 origin-top rounded-xl border border-border bg-background/98 p-3 shadow-2xl backdrop-blur-xl transition-all duration-200",
                    servicesOpen
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-2 opacity-0",
                  )}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {serviceLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          role="menuitem"
                          onClick={() => setServicesOpen(false)}
                          className="group flex min-h-36 gap-4 rounded-lg border border-border bg-card/45 p-5 text-left transition-all hover:border-accent/50 hover:bg-card"
                          activeProps={{
                            className: "border-accent/60 bg-card",
                          }}
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                            <Icon aria-hidden="true" />
                          </span>
                          <span>
                            <span className="block text-[10px] font-semibold uppercase text-accent">
                              {item.eyebrow}
                            </span>
                            <span className="mt-2 block text-sm font-semibold text-foreground">
                              {item.title}
                            </span>
                            <span className="mt-2 block text-xs font-normal leading-5 text-muted-foreground">
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {links.slice(1).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="rounded-full px-4 py-3 transition-colors hover:text-foreground"
                  activeProps={{
                    className: "bg-card text-foreground shadow-sm",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="relative ml-auto hidden shrink-0 items-center gap-4 md:flex">
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground xl:flex"
            >
              <Phone className="h-4 w-4 text-accent" aria-hidden="true" />
              {phone}
            </a>

            <span aria-hidden="true">|</span>

            <Button
              asChild
              className="group h-10 overflow-hidden rounded-lg bg-accent p-0 font-bold uppercase text-accent-foreground shadow-none transition-all duration-300 hover:bg-accent/90 hover:scale-105"
            >
              <Link
                to="/contact"
                className="relative inline-flex  items-center justify-center overflow-hidden rounded-lg px-5 transition-all duration-300 group-hover:px-8"
              >
                {/* Left → Right glow */}
                <span
                  className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/50 to-transparent transition-all duration-700 group-hover:left-[120%]"
                  aria-hidden="true"
                />

                {/* Text */}
                <span className="relative z-10 inline-block transition-transform duration-300 group-hover:scale-105">
                  Get a quote
                </span>
              </Link>
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="ml-auto rounded-full lg:hidden"
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* mobile menu */}
      {open && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-background px-5 pb-10 pt-28 lg:hidden h-[73%]">
          <div className="mx-auto max-w-xl">
            <div className="space-y-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  activeOptions={link.to === "/" ? { exact: true } : undefined}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-4 text-2xl font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  activeProps={{ className: "bg-secondary text-foreground" }}
                >
                  {link.label}
                </Link>
              ))}

              <div className="rounded-lg border border-border bg-card/40 p-2">
                <Link
                  to="/services"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-3 text-2xl font-semibold text-muted-foreground",
                    serviceSectionActive && "text-foreground",
                  )}
                >
                  Services
                </Link>
                <div className="grid gap-2 sm:grid-cols-2">
                  {serviceLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-md border border-border bg-background/60 p-3 text-sm font-medium text-foreground"
                        activeProps={{ className: "border-accent" }}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-accent">
                          <Icon />
                        </span>
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex h-12 items-center justify-center gap-2 rounded-lg border border-border text-sm font-semibold text-foreground"
              >
                <Phone className="h-4 w-4 text-accent" /> {phone}
              </a>
              <Button
                asChild
                size="lg"
                className="h-12 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link to="/contact" onClick={() => setOpen(false)}>
                  Get a quote
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// {open && (
//         <div className="fixed inset-0 z-40 bg-background md:hidden flex flex-col justify-center px-6">
//           <ul className="space-y-6">
//             {links.map((l) => (
//               <li key={l.to}>
//                 <Link
//                   to={l.to}
//                   onClick={() => setOpen(false)}
//                   style={{ fontFamily: "var(--font-display)" }}
//                   className="block text-5xl uppercase tracking-tighter hover:text-accent"
//                   activeProps={{ className: "text-accent" }}
//                 >
//                   {l.label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
